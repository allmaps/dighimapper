import fs from 'fs'
import url from 'url'
import path from 'path'
import JSONStream from 'JSONStream'
import H from 'highland'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const features = fs
  .createReadStream('./data/dighimapper.geojson')
  .pipe(JSONStream.parse('features.*'))

async function downloadImageInfo(feature) {
  const batch = feature.properties.batch
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

  const dir = path.join(__dirname, 'batches', String(batch))
  const filename = path.join(dir, `${id}.info.json`)

  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filename, JSON.stringify(imageInfo, null, 2))
}

H(features)
  .filter((feature) => feature.properties.batch === 1)
  .flatMap((feature) => H(downloadImageInfo(feature)))
  .done(() => {
    console.log('Done...')
  })
