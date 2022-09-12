import fs from 'fs'
import JSONStream from 'JSONStream'
import H from 'highland'

const features = fs
  .createReadStream('./data/dighimapper.geojson')
  .pipe(JSONStream.parse('features.*'))

async function createMap(feature) {
  const id = feature.properties.identifier
  const imageUri = `https://images.dighimapper.eu/iiif/2/${id}.tif`
  const imageInfoUrl = `${imageUri}/info.json`

  let imageInfo
  try {
    imageInfo = await fetch(imageInfoUrl).then((response) => response.json())
  } catch (err) {
    console.error('Error fetching', imageInfoUrl)
    return
  }

  const pixelMask = [
    [0, 0],
    [imageInfo.width, 0],
    [imageInfo.width, imageInfo.height],
    [0, imageInfo.height]
  ]

  const gcps = [
    {
      world: feature.geometry.coordinates[0][0],
      image: pixelMask[0]
    },
    {
      world: feature.geometry.coordinates[0][1],
      image: pixelMask[1]
    },
    {
      world: feature.geometry.coordinates[0][2],
      image: pixelMask[2]
    },
    {
      world: feature.geometry.coordinates[0][3],
      image: pixelMask[3]
    }
  ]

  const map = {
    version: 1,
    image: {
      uri: imageUri,
      type: 'ImageService2',
      width: imageInfo.width,
      height: imageInfo.height
    },
    pixelMask,
    gcps
  }

  return map
}

H(features)
  .filter((feature) => feature.properties.batch === 1)
  .filter((feature) => feature.geometry)
  .flatMap((feature) => H(createMap(feature)))
  .compact()
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(process.stdout)
