export const unflattenObject = (objectToUnflatten) => {
  const result = {};
  let currentNode;

  Object.keys(objectToUnflatten).forEach((flattenedKey) => {
    const keys = flattenedKey.split('.');
    const keysCount = keys.length - 1;

    currentNode = result;

    for (let i = 0; i < keysCount; i++) {
      const key = keys[i];
      if (currentNode[key]) {
        currentNode = currentNode[key];
      } else {
        currentNode[key] = currentNode = {};
      }
    }

    currentNode[keys[keysCount]] = objectToUnflatten[flattenedKey];
  });

  return result;
};

export const flattenObject = (objectToFlatten) => {
  const result = {};

  Object.keys(objectToFlatten).forEach((property) => {
    if (typeof objectToFlatten[property] === 'object') {
      const flatObject = flattenObject(objectToFlatten[property]);

      Object.keys(flatObject).forEach((subProperty) => {
        result[`${property}.${subProperty}`] = flatObject[subProperty];
      });
    } else {
      result[property] = objectToFlatten[property];
    }
  });

  return result;
};
