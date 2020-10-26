import { Component, ComponentInterface, h } from "@stencil/core";

@Component({
  tag: "tab-about",
  styleUrl: "tab-about.css",
  shadow: true,
})
export class TabAbout implements ComponentInterface {
  render() {
    return (
      <div>
        <p>Sample Configurator using StencilJS.</p>

        <p>
          Developing web components with multiple other custom web components in
          it is hard out of the box without tooling.
        </p>

        <p>
          StencilJS provides the tooling needed for these types of projects, and
          so does LitElements. There's a separate example project that uses
          LitElement that you can check out if you prefer LitElements.
        </p>
      </div>
    );
  }
}
