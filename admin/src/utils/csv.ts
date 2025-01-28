const separator = '|';

export const JsonToCsv = (
  translations: {
    key: string;
    value: string;
  }[],
  filename: string
) => {
  if (!Array.isArray(translations) || translations.length === 0) {
    console.error('Invalid input: must be a non-empty array.');
    return;
  }

  // Generate CSV content
  const csvRows = translations.map(({ key, value }) => {
    return `${key}${separator}${value}`;
  });

  // Create CSV file content
  const csvContent = csvRows.join('\n');

  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
};

export const CsvToJson = (data: string) => {
  const lines = data.trim().split('\n');
  if (lines.length < 1) {
    console.error('Invalid CSV format: must contain at least one data row.');
    return [];
  }

  const jsonArray = lines
    .map((line, index) => {
      const [key, ...splittedValues] = line.split(separator);
      const value = splittedValues.join(separator);

      if (!key || typeof key !== 'string') {
        console.error(`Invalid key on line ${index + 2}: must be a non-empty string.`);
        return null;
      }

      return { key, value };
    })
    .filter((item) => item !== null);

  return jsonArray;
};
