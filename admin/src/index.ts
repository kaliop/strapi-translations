import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Translation center',
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    this.registerTrads(app).then(() => {
      app.registerPlugin({
        id: PLUGIN_ID,
        initializer: Initializer,
        isReady: false,
        name: PLUGIN_ID,
      });
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            const translationObject = {} as Record<string, any>;

            Object.keys(data).map((key) => {
              translationObject[getTranslation(key)] = data[key];
            });

            return {
              data: translationObject,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
