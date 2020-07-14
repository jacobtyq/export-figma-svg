require('dotenv').config()
const axios = require('axios')
const figmaRestApi = require('./util/figmaRestApi')
const Utils = require('./util/utils')

const svgHelper = async () => {
  try {
    console.log('url', 'files/' + process.env.FIGMA_BASE_URL + process.env.FIGMA_PROJECT_ID + '/nodes?ids=' + process.env.FIGMA_PROJECT_NODE_ID)
    const response = await figmaRestApi.get('files/' + process.env.FIGMA_PROJECT_ID + '/nodes?ids=' + process.env.FIGMA_PROJECT_NODE_ID)
    const children = await response.data.nodes[process.env.FIGMA_PROJECT_NODE_ID].document.children

    console.log('Number of SVGs', Utils.findAllByValue(children, 'INSTANCE').length)
    const svgs = Utils.findAllByValue(children, 'INSTANCE')

    const data = await Promise.all(
      svgs.map(async (svg, index) => {
        // Get URL of each SVG
        let svgName = await svg.name

        if (svgName.includes('/')) {
          const nameArr = svg.name.split('/').join('-')
          svgName = nameArr
        }
        const svgURL = await figmaRestApi.get('images/' + process.env.FIGMA_PROJECT_ID + '/?ids=' + svg.id + '&format=svg')
        // Get SVG DOM
        const svgDOM = await axios.get(svgURL.data.images[svg.id])
        Utils.writeToFile('./src/svg/' + `${Utils.camelCaseToDash(svgName)}.svg`, svgDOM.data)
        // return svgDOM.data
      })
    )
  } catch (err) {
    console.error(err)
  }
}

svgHelper()
