# GenWatt Configurator

The GenWatt Configurator is a web component that you can easily add into any existing site, and should
work out of the box for all modern browsers.

> Note: This example does not include the 3D model.

## Development

The project makes use of [StencilJS](https://stenciljs.com/) as the toolchain for building web components. We'll need to install its dependencies first before running or building the project.

Stencil would auto-generate a README file for each component, wherein the important component to refer to would be the entry file, whose filename is the same as the `tag` name defined in the [manifest.json](manifest.json) file. In this case, it's [idlog-product-configurator](src/components/idlog-product-configurator).

#### Prerequisites

1. [NodeJS](https://nodejs.org/en/)
2. Install dependencies. Execute `npm i` in your command line inside this folder

```bash
# assuming that your current path is inside configurator-sdk/gen-watt
npm i
```

#### Available npm commands

Running the demo:

```bash
npm run start
```

Build files for deployment:

```bash
npm run build
```

## Usage

In order to load this configurator in your site, you'll have to first build the project and upload it to your server.

1. Build the project by executing: `npm run build`
2. Upload the output files in `./dist` to your server
3. Add the following script and link tags to your HTML (replace `YOUR_URL` with the actual URL path):
```html
  <script type="module" src="{YOUR_URL}/gen-watt.esm.js"></script>
  <script nomodule src="{YOUR_URL}/gen-watt.js"></script>
  <link rel="stylesheet" href="{YOUR_URL}/gen-watt.css">

  <!-- If you're going to load 3D models in your configurator, you'll need to load up google's model-viewer web component -->
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```
4. Add the `idlog-product-configurator` to your site
```html
<idlog-product-configurator mode="2d" org-id="{ORG_ID}" config-id="{CONFIG_ID}"></idlog-product-configurator>
```