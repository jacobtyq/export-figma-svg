const fs = require("fs");

const writeToFile = async (filename, data) => {
  return fs.writeFile(filename, data, (error) => {
    if (error) throw error;
    console.log(`The file ${filename} has been saved!`);
  });
};

const camelCaseToDash = (string) => {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

const flattenArray = (arr, d = 1) => {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flattenArray(val, d - 1) : val),
        []
      )
    : arr.slice();
};

const findAllByValue = (obj, valueToFind) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      value === valueToFind
        ? acc.concat({
            id: Object.values(obj.id).join(""),
            name: Object.values(obj.name).join(""),
          })
        : typeof value === "object"
        ? acc.concat(findAllByValue(value, valueToFind))
        : acc,
    []
  );
};

const createFolder = async (path) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
  } catch (err) {
    await fs.promises.mkdir(path);
  }
};

const filterPrivateComponents = svgs => svgs.filter(({ name }) => !name.startsWith('.') && !name.startsWith('_'))

exports.writeToFile = writeToFile;
exports.camelCaseToDash = camelCaseToDash;
exports.flattenArray = flattenArray;
exports.findAllByValue = findAllByValue;
exports.createFolder = createFolder;
exports.filterPrivateComponents = filterPrivateComponents;
