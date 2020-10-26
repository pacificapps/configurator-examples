import { Component, ComponentInterface, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { IOption } from '../../idlog-product-configurator/interfaces';

@Component({
  tag: 'tab-fuel',
  styleUrl: 'tab-fuel.css',
  shadow: true,
})
export class TabFuel implements ComponentInterface {
  @Prop() options: IOption[];

  @Event() fuelChange: EventEmitter<string>;

  handleClick = (event: Event) => {
    this.fuelChange.emit((event.target as HTMLInputElement).value);
  };

  render() {
    return (
      <Host>
        <div>
          {this.options.map(option => (
            <p>
              <input
                type="radio"
                value={option.value}
                id={option.value}
                name="fuel-type"
                onClick={this.handleClick}
                checked={option.selected}
              ></input>
              <label htmlFor={option.value}>{option.name}</label>
            </p>
          ))}
        </div>
      </Host>
    );
  }
}
