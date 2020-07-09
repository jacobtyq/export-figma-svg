const fs = require('fs')

const writeToFile = (filename, data) => {
  return fs.writeFile(filename, data, (error) => {
    if (error) throw error
    console.log('The file has been saved!')
  })
}

const camelCaseToDash = (string) => {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const flattenArray = (arr, d = 1) => {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val, d - 1) : val), [])
    : arr.slice()
}

const findAllByValue = (obj, valueToFind) => {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => (value === valueToFind)
      ? acc.concat(({ id: Object.values(obj.id).join(''), name: Object.values(obj.name).join('') }))
      : (typeof value === 'object')
        ? acc.concat(findAllByValue(value, valueToFind))
        : acc
    , [])
}

exports.writeToFile = writeToFile
exports.camelCaseToDash = camelCaseToDash
exports.flattenArray = flattenArray
exports.findAllByValue = findAllByValue
