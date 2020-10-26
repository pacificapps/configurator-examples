import { Component, h, Listen, Prop, State, Watch } from '@stencil/core';
import Noty from 'noty';
import mockData from './mock-data.json';
import { IConfiguration, IUser, IWattChangeEvent } from './interfaces';
import colorMap from '../../utils/color-map';

export type Modes = '2d' | '3d';

@Component({
  tag: 'idlog-product-configurator',
  styleUrl: 'idlog-product-configurator.css',
  shadow: true,
})
export class IdlogProductConfigurator {
  /**
   * The iDialogue API URL that the configurator would communicate with.
   * @type {string}
   */
  @Prop() apiUrl: string = 'https://api.i-dialogue.com/v1';

  /**
   * The configurator mode. Note: 3D models are not included in this repository.
   * @type {Modes}
   */
  @Prop() mode: Modes = '2d';

  /**
   * Force mobile layout view, primarily used by the portal builder to preview the mobile view of the configurator.
   * @type {boolean}
   */
  @Prop() forceMobile: boolean = false;

  /**
   * The base URL of the assets used by the configurator.
   * @type {string}
   */
  @Prop() baseUrl!: string;

  /**
   * The Salesforce OrgID that the configurator would use to fetch configurations, and the Salesforce Org that the configurator would save leads.
   * @type {string}
   */
  @Prop() orgId!: string;

  /**
   * The ID of the template or configuration that the configurator would use to load the initial configuration options.
   * @type {string}
   */
  @Prop() configId!: string;

  /**
   * The room ID to associate the configuration with.
   * @type {string}
   */
  @Prop() roomId: string;

  /**
   * The item ID of the configuration plugin that is loaded in a particular room.
   * @type {string}
   */
  @Prop() itemId: string;

  /**
   * The member ID of the current user in the room.
   * @type {string}
   */
  @Prop() memberId: string;

  /**
   * The Lead ID. If empty, it'll auto-create one when the user interacts with the configurator for the first time.
   * @type {string}
   */
  @Prop() crmId: string;

  /**
   * A string representation of a JSON object that contains the current user's details, which would be used to pre-fill the Quotation Form.
   * @type {string}
   */
  @Prop() user: string;

  /**
   * If preview mode is enabled, the configurator will not send any events/requests to the API endpoint
   * @type {boolean}
   */
  @Prop() isPreviewMode: boolean = false;

  //-------- States --------//

  @State() config: IConfiguration;

  @State() userObject: IUser;

  @State() color: string;

  @State() fuel: string;

  @State() watts: string;

  @State() price: string = '$5,000';

  @State() showQuoteDialog: boolean = false;

  @State() isLoading: boolean = true;

  //-------- Internal states that shouldn't trigger a re-render --------//

  _postTimeout: NodeJS.Timeout;

  _configUrl: string;

  _crmId: string;

  _configId: string;

  _isTemplate: boolean;

  @Watch('mode')
  mapColor(newValue: string) {
    if (newValue === '3d' && this.color === 'white') {
      this.color = 'blue';
    } else if (newValue === '2d' && this.color === 'blue') {
      this.color = 'white';
    }
  }

  @Listen('colorChange')
  colorChangeHandler(event: CustomEvent<string>) {
    const mapped = colorMap(event.detail, this.mode === '3d');
    this.color = mapped.label.toLowerCase();
    this.processChange(event.detail, 'Colors');
  }

  @Listen('fuelChange')
  fuelChangeHandler(event: CustomEvent<string>) {
    this.fuel = event.detail;
    this.processChange(event.detail, 'Fuel Options');
  }

  @Listen('wattsChange')
  wattsChangeHandler(event: CustomEvent<IWattChangeEvent>) {
    this.watts = event.detail.value;
    this.price = `$${event.detail.price.toLocaleString()}`;
    this.processChange(event.detail.value, 'Power - Watts');
  }

  async componentWillLoad() {
    const requiredProps = ['configId', 'orgId'];
    const missingProp = requiredProps.find(prop => !this[prop]);
    if (missingProp) throw new Error(`${missingProp} is required`);

    try {
      this.userObject = JSON.parse(this.user);
    } catch (error) {
      console.warn(error.message);
    }

    this._crmId = localStorage.getItem(`idlog-cnfg-crm-${this.configId}`);
    this._configId = localStorage.getItem(`idlog-cnfg-id-${this.configId}`);

    // Get configuration
    this._configUrl = `${this.apiUrl}/orgs/${this.orgId}/configurations/${
      this._configId ?? this.configId
    }`;

    const configuration = await fetch(this._configUrl)
      .then(res => res.json())
      .then(res => res.configuration)
      .catch(error => {
        console.error(error.message);
        return mockData;
      });

    // This mutates the cards list, adds a `selected` state
    this.processInitialData(configuration);

    this.config = configuration;

    const colorCard = this.config.cards.find(card => card.name === 'Colors');

    if (colorCard) {
      const selected = colorCard.options.find(opt => opt.selected);
      const mapped = colorMap(selected?.value || colorCard.options[0]?.value, this.mode === '3d');
      this.color = mapped.label.toLowerCase();
    }
  }

  processInitialData(configuration: IConfiguration) {
    // Set a default selected option if they do not exist
    const cards = configuration?.cards || [];
    configuration.cards = cards.sort((l, r) => l.order - r.order);

    if (typeof configuration.isTemplate !== 'undefined') {
      this._isTemplate = configuration.isTemplate;
    }

    const fuels = configuration.cards.find(card => card.name === 'Fuel Options');
    const watts = configuration.cards.find(card => card.name === 'Power - Watts')
    const selectedFuel = fuels?.options?.find(opt => opt.selected);
    const selectedWatts = watts?.options?.find(opt => opt.selected);
    this.fuel = selectedFuel?.value;
    this.price = `$${selectedWatts?.listPrice.toLocaleString()}`;
  }

  async processChange(value: string, nav: string) {
    if (!this.crmId && !this._crmId) {
      await this.debouncedPost('CONFIGURATION_START', { isTemplate: false });
    }

    const config = JSON.parse(JSON.stringify(this.config)) as IConfiguration;

    const dataIndex = config.cards.findIndex(card => card.name === nav);

    if (dataIndex === -1) return;

    const currentSel = config.cards[dataIndex].options.findIndex(opt => opt.selected);
    const targetSel = config.cards[dataIndex].options.findIndex(opt => opt.value === value);

    config.cards[dataIndex].options = config.cards[dataIndex].options.map(opt => ({
      ...opt,
      selected: false,
    }));

    if (currentSel !== targetSel) {
      config.cards[dataIndex].options[targetSel] &&
        (config.cards[dataIndex].options[targetSel].selected = true);
    }

    if (nav === 'Fuel Options' && currentSel !== targetSel) {
      const wattageIndex = config.cards.findIndex(card => card.name === 'Power - Watts');

      if (wattageIndex !== -1) {
        const _currentSel = config.cards[wattageIndex].options.findIndex(opt => opt.selected);
        const _targetSel = config.cards[wattageIndex].options.findIndex(
          opt => opt.groupName === value,
        );

        config.cards[wattageIndex].options[_currentSel].selected = false;
        config.cards[wattageIndex].options[_targetSel].selected = true;
      }
    }

    this.config = config;

    this.debouncedPost();
  }

  handleClick = () => {
    this.showQuoteDialog = true;
  };

  hideQuoteDialog = () => {
    this.showQuoteDialog = false;
  };

  handleSave = async event => {
    this.hideQuoteDialog();

    try {
      await this.debouncedPost('CONFIGURATION_SUBMIT', event.detail);
      new Noty({
        text: 'Quote request sent. A Sales Rep will contact you soon.',
        type: 'success',
        theme: 'metroui',
      }).show();
    } catch (error) {
      // Do nothing, Noty should be triggered by debouncedPost
    }
  };

  debouncedPost = (eventType: string = 'CONFIGURATION_UPDATE', payload = {}) => {
    if (this._isTemplate && eventType !== 'CONFIGURATION_START') return;
    if (eventType !== 'CONFIGURATION_START' && !this._configId) {
      throw new Error(`Unauthorized action: Trying to send event type ${eventType} to default template ID`);
    }

    clearTimeout(this._postTimeout);
    return new Promise((resolve, reject) => {
      this._postTimeout = setTimeout(async () => {
        try {
          const crmId = this.crmId || this._crmId;
          const payloadBody = {
            orgId: this.orgId,
            roomId: this.roomId,
            itemId: this.itemId,
            memberId: this.memberId,
            configuration: this.config,
            origin: this.isPreviewMode ? 'builder' : 'website',
            event: eventType,
            identifier: navigator.appVersion,
            timeZone: new Date().getTimezoneOffset() / 60,
            crmId,

            ...payload,
          } as any;

          if (this._configId) {
            payloadBody.id = this._configId;
          }

          const response = await fetch(this._configUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadBody),
          });
          const parsed = await response.json();

          if (response.status >= 300 || parsed.success === false) {
            throw new Error(
              parsed.message ??
                `API Responded with status ${response.status} and without any error message.`,
            );
          }

          if (parsed.event === 'CONFIGURATION_START') {
            this._crmId = parsed.crmId;
            this._configId = parsed.id;
            this._configUrl = `${this.apiUrl}/orgs/${this.orgId}/configurations/${
              this._configId ?? this.configId
            }`;
            this._isTemplate = parsed.configuration.isTemplate;

            localStorage.setItem(`idlog-cnfg-crm-${this.configId}`, this._crmId);
            localStorage.setItem(`idlog-cnfg-id-${this.configId}`, this._configId);
          }

          resolve();
        } catch (error) {
          new Noty({
            text: error.message,
            type: 'error',
            theme: 'metroui',
          }).show();

          reject();
        }
      }, 300);
    });
  };

  render() {
    return (
      <div class={`container ${this.forceMobile ? '' : 'default-behavior'}`}>
        <main>
          <div class="config-group">
            <live-preview assetBaseUrl={this.baseUrl} color={this.color} mode={this.mode} />
            <tabs-container
              forceMobile={this.forceMobile}
              cards={this.config.cards}
              mode={this.mode}
              fuel={this.fuel}
            />
          </div>
          <price-preview>
            <span slot="price">{this.price}</span>
            <span slot="button">
              <button class="submit" onClick={this.handleClick}>
                Request Quote
              </button>
            </span>
          </price-preview>
          <intake-form
            isOpen={this.showQuoteDialog}
            user={this.userObject}
            onRequestHide={this.hideQuoteDialog}
            onRequestSave={this.handleSave}
          />
        </main>
      </div>
    );
  }
}
