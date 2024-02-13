import { useRef, useState } from 'react'
import styles from './Uploader.module.css'
import { uploadMod } from '../services/mods'

export default function Uploader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const categoryInput = useRef<HTMLSelectElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const idInput = useRef<HTMLInputElement>(null)
  const versionInput = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File>()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      console.log(file)
      setSelectedFile(file)
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0]
      console.log(file)
      setSelectedFile(file)
    }
  }

  const handleUploadClicked = async () => {
    uploadMod(
      selectedFile!,
      categoryInput.current!.value,
      nameInput.current!.value,
      idInput.current!.value,
      versionInput.current!.value,
    )
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
        <input type='text' value={selectedFile?.name} readOnly />
      )}
      <input type='file' name='file' hidden ref={fileInput} onChange={handleFileSelect} />
      <label htmlFor='category'>Category</label>
      <select name='category' ref={categoryInput}>
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
    </article>
  )
}
