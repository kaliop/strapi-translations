export default {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/',
        // name of the controller file & the method.
        handler: 'controller.index',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/get/:locale',
        handler: 'controller.getTranslation',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/locales',
        handler: 'controller.getLocales',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/validateKey',
        handler: 'controller.validateKey',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/save/:locale',
        handler: 'controller.saveTranslation',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/saveNewTranslation',
        handler: 'controller.saveNewTranslation',
        config: {
          policies: [],
        },
      },
    ],
  },
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/public/translation/:locale',
        handler: 'publicController.getPublicTranslation',
        config: {
          policies: [],
        },
      },
    ],
  },
};
