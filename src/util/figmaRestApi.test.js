require('dotenv').config()
const figmaRestApi = require('./figmaRestApi')
jest.mock('./figmaRestApi')

describe('Figma Rest API', () => {
  it('has a DEV_ACCESS_TOKEN', async () => {
    // Given

    // When

    await figmaRestApi

    // Then
    expect(figmaRestApi.get.mock.calls[0][0]).toEqual()
  })
})
