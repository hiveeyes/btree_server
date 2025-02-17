/**
 * @description List enum values
 * @param {enum} en Enum to list
 */
const list = (en: any): string[] => {
  const list = [];
  for (const item in en) {
    list.push(en[item]);
  }
  return list;
};

const listNumber = (en: any): number[] => {
  const list = [];
  for (const item in en) {
    list.push(en[item]);
  }
  return list;
};

export { list, listNumber };
