import { useState } from 'react';
import { Dialog, Button, Textarea } from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';
import { CsvToJson } from '../utils/csv';
import type { TranslationRow } from '../pages/HomePage';

type Props = {
  locale: string;
  setTranslations: (translations: { key: string; value: string }[]) => void;
};

export const ImportModal = ({ setTranslations }: Props) => {
  const intl = useIntl();
  const [temporaryContent, setTemporaryContent] = useState('');

  const importTranslations = () => {
    const confirmation = confirm(
      intl.formatMessage({ id: getTranslation('import.confirmOverwrite') })
    );

    if (confirmation) {
      setTranslations(CsvToJson(temporaryContent) as TranslationRow[]);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>{intl.formatMessage({ id: getTranslation('import.cta') })}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{intl.formatMessage({ id: getTranslation('import.title') })}</Dialog.Header>
        <Dialog.Body icon={<WarningCircle fill="danger600" />}>
          <Textarea
            value={temporaryContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTemporaryContent(e.target.value)
            }
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button fullWidth variant="tertiary">
              {intl.formatMessage({ id: getTranslation('action.cancel') })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button fullWidth variant="danger-light" onClick={importTranslations}>
              {intl.formatMessage({ id: getTranslation('action.import') })}
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
