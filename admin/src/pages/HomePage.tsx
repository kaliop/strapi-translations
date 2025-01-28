import { useEffect, useState, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { getFetchClient } from '@strapi/strapi/admin';
import {
  Button,
  SingleSelect,
  SingleSelectOption,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Typography,
  Alert,
} from '@strapi/design-system';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '../design-system/ContentLayout';
import { HeaderLayout } from '../design-system/HeaderLayout';
import { getTranslation } from '../utils/getTranslation';
import { TranslationRow } from '../components/TranslationRow';
import { PLUGIN_ID } from '../pluginId';
import { ImportModal } from '../components/ImportModal';
import { JsonToCsv } from '../utils/csv';

export type TranslationRow = { key: string; value: string };

const HomePage = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [originalTranslations, setOriginalTranslations] = useState<
    { key: string; value: string }[]
  >([]);
  const [translations, setTranslations] = useState<TranslationRow[]>([]);
  const [locale, setLocale] = useState('');
  const [usableLocales, setUsableLocales] = useState<{ code: string; name: string }[]>([]);
  const [modifications, setModifications] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    const { get } = getFetchClient();

    const promise = get(`/${PLUGIN_ID}/locales`);

    promise.then((result) => {
      setUsableLocales(result.data.locales);
      if (result.data.locales.length > 0) {
        const locale = result.data.locales[0].code;
        setLocale(locale);
        loadTranslations(locale);
      }
    });
  }, []);

  const updateTranslations = (translations: TranslationRow[]) => {
    setModifications(true);
    setTranslations(translations);
  };

  const updateInfo = (info: string) => {
    setInfo(info);
    setTimeout(() => {
      setInfo('');
    }, 6000);
  };

  const loadTranslations = useCallback(
    (locale: string) => {
      const { get } = getFetchClient();

      setLoading(true);
      const promise = get(`/${PLUGIN_ID}/get/${locale}`);

      promise.then((result) => {
        if (Array.isArray(result?.data?.data?.json)) {
          setOriginalTranslations(result.data.data.json);
          setTranslations(result.data.data.json);
        } else {
          setTranslations([]);
          setOriginalTranslations([]);
        }

        setLoading(false);
      });
    },
    [locale]
  );

  const saveTranslations = useCallback(() => {
    const { post } = getFetchClient();

    setLoading(true);
    const promise = post(`/${PLUGIN_ID}/save/${locale}`, translations);

    promise.then((result) => {
      setTimeout(() => {
        if (result.data.success) {
          setModifications(false);
        }

        setLoading(false);
      }, 2500);
    });
  }, [locale, translations]);

  const changeLocale = (newLocale: string) => {
    if (modifications) {
      const confirmation = confirm('Current modifications?');
      if (!confirmation) return;
    }

    setLocale(newLocale);
    loadTranslations(newLocale);
  };

  const generateExport = () => {
    JsonToCsv(translations, locale);
  };

  const onChangeTranslationKey = (newTranslationKey: string, oldTranslationKey: string) => {
    if (oldTranslationKey) {
      const keyAlreadyExists = translations.find((t) => t.key === newTranslationKey);

      if (keyAlreadyExists) return;
    }

    const translationIndex = translations.findIndex((t) => t.key === oldTranslationKey);

    if (translationIndex === -1) return;

    const copy = [...translations];
    copy[translationIndex].key = newTranslationKey;

    updateTranslations(copy);
  };

  const onChangeValue = (newTranslationValue: string, key: string) => {
    const translationIndex = translations.findIndex((t) => t.key === key);

    if (translationIndex === -1) return;

    const copy = [...translations];
    copy[translationIndex].value = newTranslationValue;

    updateTranslations(copy);
  };

  return (
    <div>
      <HeaderLayout
        title={intl.formatMessage({ id: getTranslation('plugin.title') })}
        subtitle={intl.formatMessage({ id: getTranslation('plugin.subtitle') })}
      />
      <ContentLayout>
        {info && (
          <div style={{ position: 'absolute', width: '90%', top: '50px' }}>
            <Alert variant="info">{info}</Alert>
          </div>
        )}
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <div>
            <SingleSelect
              onChange={changeLocale}
              value={locale}
              placeholder={intl.formatMessage({ id: getTranslation('languagePicker.title') })}
            >
              {usableLocales.map((locale) => (
                <SingleSelectOption value={locale.code}>{locale.name}</SingleSelectOption>
              ))}
            </SingleSelect>
          </div>
          {/* Actions */}
          {modifications ? (
            <div style={{ marginLeft: '8px' }}>
              <Button onClick={saveTranslations} loading={loading}>
                {intl.formatMessage({ id: getTranslation('action.save') })}
              </Button>
            </div>
          ) : null}
          {locale && (
            <>
              <div style={{ marginLeft: '8px' }}>
                <Button onClick={() => navigate('/plugins/strapi-translations/add')}>
                  {intl.formatMessage({ id: getTranslation('action.addTranslation') })}
                </Button>
              </div>

              {/* Import/export */}
              <div style={{ marginLeft: 'auto' }}>
                <ImportModal locale={locale} setTranslations={updateTranslations} />
              </div>
              {translations.length && (
                <div style={{ marginLeft: '8px' }}>
                  <Button onClick={() => generateExport()}>
                    {intl.formatMessage({ id: getTranslation('export.action') })}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {locale ? (
          <Box padding={8} background="neutral100">
            <Table colCount={3} rowCount={translations.length}>
              <Thead>
                <Tr>
                  <Td>
                    <Typography variant="sigma">Translation Key</Typography>
                  </Td>
                  <Td>
                    <Typography variant="sigma">Translation Value</Typography>
                  </Td>
                  <Td>
                    <Typography variant="sigma">Actions</Typography>
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                {translations.map((entry, index) => (
                  <TranslationRow
                    key={index}
                    translationKey={entry.key}
                    translationValue={entry.value}
                    onChangeTranslationKey={onChangeTranslationKey}
                    onChangeTranslationValue={onChangeValue}
                    updateInfo={updateInfo}
                  />
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : null}
      </ContentLayout>
    </div>
  );
};

export { HomePage };
