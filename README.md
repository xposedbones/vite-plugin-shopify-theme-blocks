# vite-plugin-flatten-theme-blocks
This is intended for themes that have a build process and do not use the Shopify Github Integration.

Shopify requires a flat directory structure for their theme blocks, which can become quite messy when working with a large codebase. This plugin allows you to have a clean directory structure, while still supporting Shopify's requirement.

This plugin will convert this structure:
```
theme-blocks/
  _hero/
    slide.liquid
    title.liquid
  other-component/
    image.liquid
  global-block.liquid
```

To this:
```
blocks/
  _hero-slide.liquid
  _hero-title.liquid
  other-component-image.liquid
  global-block.liquid
```

## Installation

```sh
npm install vite-plugin-flatten-theme-blocks
```

## Usage
### Making sure that Shopify CLI won't fail
Add `theme-blocks/` to your `.shopifyignore` file.

### Prevent duplicated code in your repo
Add `blocks/` to your `.gitignore` file.

### Load the plugin
Load the plugin in your vite.config.js
```
import FlattenThemeBlocks from 'vite-plugin-flatten-theme-blocks';
```

Add the plugin to your plugin list and make sure it is loaded before the shopify plugin
```
plugins: [
  ...
  FlattenThemeBlocks(),
  shopify(),
  ...
]
```

You can change the name of your entry folder like so
```
FlattenThemeBlocks({source: 'another-name'})
```