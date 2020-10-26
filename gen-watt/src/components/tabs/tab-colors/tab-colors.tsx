import { Component, ComponentInterface, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import cx from 'classnames';
import colorMap from '../../../utils/color-map';
import { IOption } from '../../idlog-product-configurator/interfaces';

@Component({
  tag: 'tab-colors',
  styleUrl: 'tab-colors.css',
  shadow: true,
})
export class TabColors implements ComponentInterface {
  @Prop() mode: string = '2d';

  @Prop() options: IOption[];

  @Event({
    eventName: 'colorChange',
    bubbles: true,
  })
  colorChange: EventEmitter<string>;

  handleClick = (color: string) => () => {
    this.colorChange.emit(color);
  };

  render() {
    return (
      <Host>
        {this.options.map(color => {
          return (
            <div class="row" onClick={this.handleClick(color.value)}>
              <div
                style={{ backgroundColor: colorMap(color.value, this.mode === '3d').hex }}
                class={cx('pallet', color.selected && 'selected')}
              ></div>
              <label>{colorMap(color.value, this.mode === '3d').label}</label>
            </div>
          );
        })}
      </Host>
    );
  }
}
