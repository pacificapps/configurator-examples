import { Component, ComponentInterface, Host, h, getAssetPath, Prop } from '@stencil/core';

@Component({
  tag: 'live-preview',
  styleUrl: 'live-preview.css',
  shadow: true,
  assetsDirs: ['assets'],
})
export class LivePreview implements ComponentInterface {
  @Prop() assetBaseUrl: string = '';

  @Prop() color: string = '';

  @Prop() mode: string = '2d';

  outputArea!: HTMLDivElement;

  render() {
    const defaultColor = this.mode.toLowerCase() === '3d' ? 'blue' : 'white';
    const assetUrl =
      this.mode.toLowerCase() === '3d'
        ? getAssetPath(`./assets/genwatt-sample-1-${this.color || defaultColor}.gltf`)
        : getAssetPath(`./assets/cat-generator-image-${this.color || defaultColor}.jpeg`);

    return (
      <Host>
        {this.mode.toLowerCase() === '3d' ? (
          <model-viewer
            src={assetUrl}
            alt="A 3D model of an astronaut"
            auto-rotate
            camera-controls
          ></model-viewer>
        ) : (
          <img src={assetUrl} />
        )}
      </Host>
    );
  }
}
