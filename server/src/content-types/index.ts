export default {
  // TODO: put this in a file
  translation: {
    schema: {
      kind: 'singleType',
      collectionName: 'translations',
      info: {
        singularName: 'translation',
        pluralName: 'translations',
        displayName: 'Translation',
      },
      pluginOptions: {
        'content-manager': {
          visible: false,
        },
        'content-type-builder': {
          visible: false,
        },
        i18n: {
          localized: true,
        },
      },
      options: {
        comment: '',
      },
      attributes: {
        json: {
          type: 'json',
        },
      },
    },
  },
};
