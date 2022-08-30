import 'dotenv/config'
import axios from 'axios'
import figmaRestApi from './api/'
import {
  writeToFile,
  findAllByValue,
  filterPrivateComponents,
  camelCaseToDash,
  createFolder,
} from './utils'
import { OUTPUT_FOLDER, RATE_LIMIT, WAIT_TIME_IN_SECONDS } from './constants'

const getProjectNode = async () => {
  return await figmaRestApi.get(
    'files/' +
      process.env.FIGMA_PROJECT_ID +
      '/nodes?ids=' +
      process.env.FIGMA_PROJECT_NODE_ID
  )
}

const getSVGURL = async (id: string) => {
  return await figmaRestApi.get(
    'images/' + process.env.FIGMA_PROJECT_ID + '/?ids=' + id + '&format=svg'
  )
}

const svgExporter = async () => {
  try {
    const response = await getProjectNode()
    const children = await response.data.nodes[
      process.env.FIGMA_PROJECT_NODE_ID
    ].document.children

    // If ignoring private components
    let svgs
    if (process.env.FILTER_PRIVATE_COMPONENTS === 'false') {
      svgs = findAllByValue(children, 'COMPONENT')
    } else {
      svgs = filterPrivateComponents(findAllByValue(children, 'COMPONENT'))
    }

    const numOfSvgs = svgs.length

    console.log('Number of SVGs', numOfSvgs)

    createFolder(OUTPUT_FOLDER)

    for (let i = 0; i < numOfSvgs; i += RATE_LIMIT) {
      const requests = svgs.slice(i, i + RATE_LIMIT).map(async (svg) => {
        // Get URL of each SVG
        let svgName = await svg.name

        if (svgName.includes('/')) {
          const nameArr = svg.name.split('/').join('-')
          svgName = nameArr
        }

        const svgURL = await getSVGURL(svg.id)

        // Get SVG DOM
        const svgDOM = await axios.get(svgURL.data.images[svg.id])
        writeToFile(
          OUTPUT_FOLDER + `${camelCaseToDash(svgName)}.svg`,
          svgDOM.data
        )
      })

      await Promise.all(requests)
        .then(() => {
          console.log(`Wait for ${WAIT_TIME_IN_SECONDS} seconds`)
          return new Promise<void>(function (resolve) {
            setTimeout(() => {
              console.log(`${WAIT_TIME_IN_SECONDS} seconds!`)
              resolve()
            }, WAIT_TIME_IN_SECONDS * 1000)
          })
        })
        .catch((err) => console.error(`Error proccessing ${i} - Error ${err}`))
    }
  } catch (err) {
    console.error(err)
  }
}

svgExporter()
