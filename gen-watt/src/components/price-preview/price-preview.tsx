import { Component, ComponentInterface, Host, h } from "@stencil/core";

@Component({
  tag: "price-preview",
  styleUrl: "price-preview.css",
  shadow: true,
})
export class PricePreview implements ComponentInterface {
  render() {
    return (
      <Host>
        <div class="col">
          <p>
            <slot name="left-slot" />
          </p>
        </div>
        <div class="col">
          <label>Price</label>
          <p>
            <slot name="price" />
          </p>
        </div>
        <div class="col">
          <p>
            <slot name="button" />
          </p>
        </div>
      </Host>
    );
  }
}
