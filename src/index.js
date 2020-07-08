require('dotenv').config()
const axios = require('axios')
const figmaRestApi = require('./util/figmaRestApi')
const Utils = require('./util/utils')

const svgHelper = async () => {
  try {
    console.log('url', 'files/' + process.env.FIGMA_BASE_URL + process.env.FIGMA_PROJECT_ID + '/nodes?ids=' + process.env.FIGMA_PROJECT_NODE_ID)
    const response = await figmaRestApi.get('files/' + process.env.FIGMA_PROJECT_ID + '/nodes?ids=' + process.env.FIGMA_PROJECT_NODE_ID)
    const svgs = await response.data.nodes[process.env.FIGMA_PROJECT_NODE_ID].document.children

    const data = await Promise.all(
      svgs.map(async (svg) => {
        // Get URL of each SVG
        const svgName = Utils.camelCaseToDash(svg.name.replace('24px/', ''))
        const svgURL = await figmaRestApi.get('images/' + process.env.FIGMA_PROJECT_ID + '/?ids=' + svg.id + '&format=svg')
        // Get SVG DOM
        const svgDOM = await axios.get(svgURL.data.images[svg.id])
        Utils.writeToFile('./src/svg/' + `${svgName}.svg`, svgDOM.data)
        console.log(svgDOM.data)
        return svgDOM.data
      })
    )

    // console.log('data', data.join(''))

    // writeToFile('sprite.svg', data.join(''))
  } catch (err) {
    console.error(err)
  }
}

svgHelper()
