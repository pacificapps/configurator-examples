import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { IOption, IWattChangeEvent } from '../../idlog-product-configurator/interfaces';

@Component({
  tag: 'tab-watts',
  styleUrl: 'tab-watts.css',
  shadow: true,
})
export class TabWatts implements ComponentInterface {
  @Prop() options: IOption[];

  @Prop() fuel: string;

  @Event() wattsChange: EventEmitter<IWattChangeEvent>;

  handleClick = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.wattsChange.emit({
      value: target.value,
      price: Number(target.dataset.price || 0),
    });
  };

  render() {
    return (
      <Host>
        <div>
          {this.options
            .filter(option => option.groupName === this.fuel)
            .map(option => (
              <p>
                <input
                  type="radio"
                  value={option.value}
                  id={option.value}
                  name="fuel-type"
                  onClick={this.handleClick}
                  checked={option.selected}
                  data-price={option.listPrice}
                />
                <label htmlFor={option.value}>{option.name}</label>
              </p>
            ))}
        </div>
      </Host>
    );
  }
}
