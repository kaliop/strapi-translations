import type { Core } from '@strapi/strapi';

export const UID = 'plugin::strapi-translations.translation';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-translations')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async getTranslation(ctx) {
    const { locale } = ctx.params;

    if (!locale) {
      ctx.body = {
        success: false,
        error: 'missing locale',
      };
      return;
    }

    const translationContent = await strapi.documents(UID).findFirst({
      locale,
      status: 'published',
    });

    ctx.body = {
      success: true,
      data: translationContent,
    };
  },
  async saveTranslation(ctx) {
    // TODO: sanitize payload

    const { locale } = ctx.params;

    if (!locale) {
      ctx.body = {
        success: false,
        error: 'missing locale',
      };
      return;
    }

    const translationContent = await strapi.documents(UID).findFirst({
      locale,
      status: 'published',
    });

    if (!translationContent) {
      // Create
      await strapi.documents(UID).create({
        data: {
          json: ctx.request.body,
        },
        locale,
      });
    } else {
      // Update
      await strapi.documents(UID).update({
        documentId: translationContent.documentId,
        data: {
          // @ts-ignore
          json: ctx.request.body,
        },
        locale,
      });
    }

    ctx.body = {
      success: true,
    };
  },
  async getLocales(ctx) {
    const locales = await strapi.plugins.i18n.services.locales.find();

    ctx.body = {
      success: true,
      locales,
    };
  },
  async validateKey(ctx) {
    const locales = await strapi.plugins.i18n.services.locales.find();

    const translationKey = ctx.query.key;

    const documents = await strapi.documents(UID).findMany({
      limit: 100,
      start: 0,
    });

    const usedLocales = [];

    for (const locale of locales) {
      const document = documents.find((document) => document.locale === locale.code);

      if (document && Array.isArray(document.json)) {
        const keyPresent = document.json.find((row) => row.key === translationKey);

        if (keyPresent) usedLocales.push(locale.code);
      }
    }

    ctx.body = {
      success: usedLocales.length === 0,
      locales: locales.map((locale) => locale.code),
      usedLocales,
    };
  },
  async saveNewTranslation(ctx) {
    const { key: translationKey, values } = ctx.request.body;

    for (const locale in values) {
      const document = await strapi.documents(UID).findFirst({
        locale,
        status: 'published',
      });

      // Somehow
      if (!document) {
        await strapi.documents(UID).create({
          data: {
            json: [
              {
                key: translationKey,
                value: values[locale],
              },
            ],
          },
          locale,
        });
      } else {
        const translations = document.json;

        const translationExists = translations.find((t) => t.key === translationKey);

        if (!translationExists) {
          translations.push({
            key: translationKey,
            value: values[locale],
          });
        } else {
          translationExists.value = values[locale];
        }

        await strapi.documents(UID).update({
          documentId: document.documentId,
          data: {
            // @ts-ignore
            json: translations,
          },
          locale,
        });
      }

      ctx.body = {
        success: true,
      };
    }
  },
});

export default controller;
