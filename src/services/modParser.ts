import { Archive } from 'libarchive.js'

Archive.init({
  workerUrl: '/libarchive.js/dist/worker-bundle.js',
})

interface FileArrayEntry {
  file: { name: string; size: number; _path: string; extract: () => Promise<File> }
  path: string
}

interface ModInfo {
  category: string
  name: string
  id: string
  version: string
}

interface UiData {
  name: string
  version: string
}

export const findModInfo = async (file: File): Promise<ModInfo> => {
  const archive = await Archive.open(file)
  const entries = (await archive.getFilesArray()) as FileArrayEntry[]
  const filePaths = entries.map((entry: FileArrayEntry) => entry.file._path)

  const carUiPath = filePaths.find((path: string) => path.endsWith('ui_car.json'))
  if (carUiPath) {
    const uiFile = await archive.extractSingleFile(carUiPath)
    const uiData = getUiData(await uiFile.text())
    const id = carUiPath.match(/cars\/(.+?)\//)?.[1] || carUiPath[0].split('/')[0]
    return {
      category: 'Car',
      name: uiData.name,
      id: id || 'unknown',
      version: uiData.version,
    }
  }
  const trackUiPaths = filePaths.filter((path: string) => path.endsWith('ui_track.json'))
  if (trackUiPaths.length > 0) {
    const uiDatas = await Promise.all(
      trackUiPaths.map(async (path: string) => {
        const uiFile = await archive.extractSingleFile(path)
        const uiData = getUiData(await uiFile.text())
        return {
          name: uiData.name,
          version: uiData.version,
        }
      }),
    )
    let commonLetters = ''
    const nameLengths = uiDatas.map((data) => data.name.length)
    const minLength = Math.min(...nameLengths)

    for (let i = 0; i < minLength; i++) {
      const letter = uiDatas[0].name[i]
      if (uiDatas.every((data) => data.name[i] === letter)) {
        commonLetters += letter
      } else {
        break
      }
    }
    commonLetters = commonLetters.replace(/( |-)+$/, '')

    const id = trackUiPaths[0].match(/tracks\/(.+?)\//)?.[1] || trackUiPaths[0].split('/')[0]
    return {
      category: 'Track',
      name: commonLetters,
      id,
      version: uiDatas[0].version,
    }
  }
  throw new Error('No ui_car.json or ui_track.json found')
}

const getUiData = (fileContent: string): UiData => {
  const rawData = JSON.parse(fileContent)
  return {
    name: rawData.name,
    version: rawData.version || '',
  }
}
