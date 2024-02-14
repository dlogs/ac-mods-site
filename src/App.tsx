import { useEffect, useState } from 'react'
import './App.css'
import FileTable from './components/FileTable'
import Uploader from './components/Uploader'
import { UploadedContent } from './types/UploadedContent'
import { getUploadedMods } from './services/mods'

function App() {
  const [uploadedMods, setUploadedMods] = useState<UploadedContent[]>([])
  useEffect(() => {
    getUploadedMods().then(setUploadedMods)
  }, [])

  return (
    <main>
      <article id='cars'>
        <h1>Cars</h1>
        <FileTable rowContents={uploadedMods.filter((mod) => mod.category === 'Car')} />
      </article>
      <article id='tracks'>
        <h1>Tracks</h1>
        <FileTable rowContents={uploadedMods.filter((mod) => mod.category === 'Track')} />
      </article>
      <Uploader />
    </main>
  )
}

export default App
