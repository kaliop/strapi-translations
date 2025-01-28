import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';
import { AddTranslation } from './AddTranslation';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/add" element={<AddTranslation />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
