<div align="center">
<h1>Strapi Translations Center</h1>
	
<p style="margin-top: 0;">Let your customers handle their i18n by theirself.</p>

</div>

- Support multi locale creation
- No configuration needed
- Import/export csv feature
- Seamless UI integration with **Strapi Design System**

## Installation

Install the plugin in your Strapi project

```bash
npm install strapi-translations
```

After installation, enable the plugin in your config file

```js
// config/plugins.js

module.exports = () => ({
  'strapi-translations': {
    enabled: true,
  },
  // .. other plugins
});
```

The plugin should now appear in the **Settings** section of your Strapi app

## Usage

### Contributors

This plugin allows your contributors to handle "cold" translations for your website.
It means that you can completely leverage 100% of translations in Strapi.

![](https://i.imgur.com/7nyR7WH.png)

![](https://i.imgur.com/fMhvlKY.png)

### Devlopers

For developers, the plugin exposes a public API that allows you to create a JSON translation file that can be used in any of your frontend during build process.

The api is available here :

```
/api/strapi-translations/public/translation/[locale]
```

the locale parameter correspond to the Strapi locale configured

## Submit an issue

You can use github issues to raise an issue about this plugin

## Contributing

Feel free to fork and make a pull request of this plugin !

- [NPM package](https://www.npmjs.com/package/strapi-translations)
- [GitHub repository](https://github.com/kaliop/strapi-translations)
