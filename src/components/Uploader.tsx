import { useRef, useState } from 'react'
import styles from './Uploader.module.css'
import { uploadMod } from '../services/mods'
import { findModInfo } from '../services/modParser'

export interface UploadProps {
  refreshMods: () => void
}

export default function Uploader({ refreshMods }: UploadProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const categoryInput = useRef<HTMLSelectElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const idInput = useRef<HTMLInputElement>(null)
  const versionInput = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileParseStatus, setFileParseStatus] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const selectFile = async (file: File) => {
    console.log(file)
    setSelectedFile(file)
    setFileParseStatus('Parsing values from file...')
    const modInfo = await findModInfo(file)
    categoryInput.current!.value = modInfo.category
    nameInput.current!.value = modInfo.name
    idInput.current!.value = modInfo.id
    versionInput.current!.value = modInfo.version
    setFileParseStatus(null)
  }

  const clearInputs = () => {
    setSelectedFile(null)
    categoryInput.current!.value = ''
    nameInput.current!.value = ''
    idInput.current!.value = ''
    versionInput.current!.value = ''
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      selectFile(file)
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0]
      selectFile(file)
    }
  }

  const handleUploadClicked = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }
    if (categoryInput.current!.value === '') {
      alert('Please select a category')
      return
    }
    if (nameInput.current!.value === '') {
      alert('Please select a name')
      return
    }
    if (idInput.current!.value === '') {
      alert('Please select an ID')
      return
    }

    setUploadStatus('Uploading...')
    try {
      await uploadMod(
        selectedFile!,
        categoryInput.current!.value,
        nameInput.current!.value,
        idInput.current!.value,
        versionInput.current!.value,
      )
      setUploadStatus('Upload successful')
    } catch (error) {
      console.error(error)
      setUploadStatus('Upload failed')
    }
    clearInputs()
    refreshMods()
  }

  return (
    <article id='uploader'>
      <h1>Uploader</h1>
      <label htmlFor='file'>Select File</label>
      {!selectedFile ? (
        <div className={styles.dropFileContainer} onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
          {'Drag & Drop'}
          <br />
          {'or '}
          <button type='button' onClick={() => fileInput.current?.click()}>
            Browse
          </button>
        </div>
      ) : (
        <>
          <input type='text' value={selectedFile?.name} readOnly />
          <button type='button' onClick={() => setSelectedFile(null)}>
            Clear File
          </button>
        </>
      )}
      <input type='file' name='file' hidden ref={fileInput} onChange={handleFileSelect} />
      {fileParseStatus && <div>{fileParseStatus}</div>}
      <label htmlFor='category'>Category</label>
      <select name='category' ref={categoryInput}>
        <option value=''>Unknown</option>
        <option value='Track'>Track</option>
        <option value='Car'>Car</option>
      </select>
      <label htmlFor='name'>Name</label>
      <input type='text' name='name' ref={nameInput} />
      <label htmlFor='id'>ID</label>
      <input type='text' name='id' ref={idInput} />
      <label htmlFor='version'>Version</label>
      <input type='text' name='version' ref={versionInput} />
      <button type='button' onClick={handleUploadClicked}>
        Upload
      </button>
      <div>{uploadStatus}</div>
    </article>
  )
}
