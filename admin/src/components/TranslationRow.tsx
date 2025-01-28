import { Grid, TextInput, Tr, Td, Typography, IconButton } from '@strapi/design-system';
import { Pencil, Check, Duplicate } from '@strapi/icons';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

type Props = {
  translationKey: string;
  translationValue: string;
  onChangeTranslationKey: (oldTranslationKey: string, newTranslationKey: string) => void;
  onChangeTranslationValue: (newTranslationValue: string, translationKey: string) => void;
  updateInfo: (info: string) => void;
};

export const TranslationRow = (props: Props) => {
  const intl = useIntl();
  const {
    translationKey,
    translationValue,
    onChangeTranslationKey,
    onChangeTranslationValue,
    updateInfo,
  } = props;
  const [editKey, setEditKey] = useState(false);
  const isAdmin = true; // TODO

  const changeKey = (newKey: string) => {
    onChangeTranslationKey(newKey, translationKey);
  };

  const changeValue = (newValue: string) => {
    onChangeTranslationValue(newValue, translationKey);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(translationKey);

    updateInfo(intl.formatMessage({ id: getTranslation('action.copied') }));
  };

  return (
    <Tr>
      <Td style={{ width: '48%' }}>
        {editKey && isAdmin ? (
          <TextInput
            value={translationKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeKey(e.target.value)}
          />
        ) : (
          <Grid.Item padding={1} col={4}>
            <Typography>{translationKey}</Typography>
          </Grid.Item>
        )}
      </Td>

      <Td style={{ width: '48%' }}>
        {editKey ? (
          <TextInput
            value={translationValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeValue(e.target.value)}
          />
        ) : (
          <Typography>{translationValue}</Typography>
        )}
      </Td>

      <Td style={{ width: '4%' }}>
        {editKey ? (
          <IconButton
            withTooltip={false}
            onClick={() => setEditKey(false)}
            label="Edit"
            borderWidth={0}
          >
            <Check />
          </IconButton>
        ) : (
          <div style={{ display: 'flex' }}>
            <IconButton
              withTooltip={false}
              onClick={() => setEditKey(true)}
              label="Validate"
              borderWidth={0}
            >
              <Pencil />
            </IconButton>
            <IconButton withTooltip={false} onClick={() => copyKey()} label="Copy" borderWidth={0}>
              <Duplicate />
            </IconButton>
          </div>
        )}
      </Td>
    </Tr>
  );
};
