import type { Core } from '@strapi/strapi';
import { UID } from './controller';
import { unflattenObject } from '../helpers/manipulations';

const publicController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getPublicTranslation(ctx) {
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
      ctx.body = {
        success: false,
        data: null,
      };
      return;
    }

    const translationHolder = {} as Record<string, any>;

    translationContent.json.map(({ key, value }) => {
      translationHolder[key] = value;
    });

    ctx.body = {
      success: true,
      data: unflattenObject(translationHolder),
    };
  },
});

export default publicController;
