import { useIntl } from 'react-intl';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFetchClient } from '@strapi/strapi/admin';
import { TextInput, Button, Link, Alert } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { ContentLayout } from '../design-system/ContentLayout';

import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../pluginId';
import { HeaderLayout } from '../design-system/HeaderLayout';

const AddTranslation = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [translationKey, setTranslationKey] = useState('');
  const [frozenInput, setFrozenInput] = useState(false);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translationMap, setTranslationMap] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const validateKey = useCallback(() => {
    const { get } = getFetchClient();

    setLoading(true);
    const promise = get(`/${PLUGIN_ID}/validateKey?key=${translationKey}`);

    promise
      .then((result) => {
        if (result.data.success) {
          setLocales(result.data.locales);
          const translationMap = {} as Record<string, string>;

          result.data.locales.forEach((locale: string) => {
            translationMap[locale] = '';
          });

          setTranslationMap(translationMap);
          setFrozenInput(true);
        } else {
          triggerError(`Translation key already used for ${result.data.usedLocales.toString()}`);
        }
      })
      .finally(() => setLoading(false));
  }, [translationKey]);

  const updateTranslationMap = (locale: string, value: string) => {
    setTranslationMap({
      ...translationMap,
      [locale]: value,
    });
  };

  const triggerError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 6000);
  };

  const saveNewTranslation = () => {
    const { post } = getFetchClient();

    setLoading(true);
    const promise = post(`/${PLUGIN_ID}/saveNewTranslation`, {
      key: translationKey,
      values: translationMap,
    });

    promise
      .then((result) => {
        if (result?.data?.success) {
          // Back to home
          navigate('/plugins/strapi-translations');
        } else {
          triggerError('An error happened. Please try again later.');
        }
      })
      .catch((e) => {
        triggerError(e.toString());
      })
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setLocales([]);
    setFrozenInput(false);
  };

  return (
    <div>
      <HeaderLayout
        title={intl.formatMessage({ id: getTranslation('plugin.addTranslation') })}
        navigationAction={
          <Link startIcon={<ArrowLeft />} onClick={() => navigate(`/plugins/strapi-translations`)}>
            {intl.formatMessage({ id: getTranslation('action.back') })}
          </Link>
        }
      />
      <ContentLayout>
        {error && (
          <div style={{ position: 'absolute', width: '90%', top: '50px' }}>
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        <div style={{ maxWidth: '400px' }}>
          <TextInput
            value={translationKey}
            disabled={frozenInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTranslationKey(e.target.value)}
            size="S"
          />
        </div>

        <div style={{ marginTop: '8px', marginBottom: '8px', display: 'flex' }}>
          {locales.length === 0 && (
            <Button onClick={validateKey} loading={loading}>
              {intl.formatMessage({ id: getTranslation('addTranslation.verifyKey') })}
            </Button>
          )}

          {locales.length !== 0 && (
            <Button onClick={reset}>
              {intl.formatMessage({ id: getTranslation('action.reset') })}
            </Button>
          )}
        </div>

        {locales.length !== 0 ? (
          <>
            {locales.map((locale) => (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}
                key={locale}
              >
                <span style={{ width: '40px' }}>{locale}</span>
                <TextInput
                  value={translationMap[locale]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateTranslationMap(locale, e.target.value)
                  }
                  size="S"
                />
              </div>
            ))}
            <div style={{ marginTop: '8px', marginBottom: '8px', display: 'flex' }}>
              <Button onClick={saveNewTranslation} loading={loading}>
                {intl.formatMessage({ id: getTranslation('action.save') })}
              </Button>
            </div>
          </>
        ) : null}
      </ContentLayout>
    </div>
  );
};

export { AddTranslation };
