import { Component, ComponentInterface, h, State, Prop } from '@stencil/core';
import { ICard } from '../idlog-product-configurator/interfaces';

@Component({
  tag: 'tabs-container',
  styleUrl: 'tabs-container.css',
  shadow: true,
})
export class TabsContainer implements ComponentInterface {
  @Prop() forceMobile: boolean = false;

  @Prop() cards: ICard[];

  @Prop() mode: string = '2d';

  @Prop() fuel: string;

  @State() active: string;

  componentWillLoad() {
    if (this.cards.length > 0) {
      this.active = this.cards[0].name;
    }
  }

  handleClick = (event: MouseEvent) => {
    this.active = (event.target as HTMLButtonElement).dataset.name as string;
  };

  renderContents() {
    const activeCard = this.cards.find(card => card.name === this.active);
    const options = activeCard?.options || [];

    if (this.active === 'Colors') {
      return <tab-colors mode={this.mode} options={options}></tab-colors>;
    }

    if (this.active === 'Power - Watts') {
      return <tab-watts fuel={this.fuel} options={options}></tab-watts>;
    }

    if (this.active === 'Fuel Options') {
      return <tab-fuel options={options}></tab-fuel>;
    }

    return null;
  }

  render() {
    return (
      <div class={`container ${this.forceMobile ? '' : 'default-behavior'}`}>
        <ul class="links">
          {this.cards
            .sort((l, r) => l.order - r.order)
            .map(card => (
              <li class={this.active === card.name && 'active'}>
                <button data-name={card.name} onClick={this.handleClick}>
                  {card.label || card.name}
                </button>
              </li>
            ))}
        </ul>
        <div class="contents">{this.renderContents()}</div>
      </div>
    );
  }
}
