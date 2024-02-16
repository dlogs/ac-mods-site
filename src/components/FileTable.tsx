import { UploadedContent } from '../types/UploadedContent'
import styles from './FileTable.module.css'

interface TableRowProps {
  rowContent: UploadedContent
}

const rootUrl = 'https://acfiles.419fragkings.win/file/419acmods/'

function TableRow({ rowContent }: TableRowProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const deleteRow = () => {
    alert('made you look')
  }

  const downloadUrl = rootUrl + rowContent.fileName

  return (
    <tr>
      <td>{rowContent.name}</td>
      <td>{rowContent.acId}</td>
      <td>{rowContent.version}</td>
      <td>
        {rowContent.uploadedAt.toLocaleString()} by
        {rowContent.uploadedBy}
      </td>
      <td>
        <div className={styles.rowButtonContainer}>
          <button onClick={() => copyToClipboard(downloadUrl)}>Copy Link</button>
          <a href={downloadUrl}>
            <strong>Download</strong>
          </a>
          <button onClick={() => deleteRow()}>Delete</button>
        </div>
      </td>
    </tr>
  )
}

export interface FileTableProps {
  rowContents: UploadedContent[]
}

export default function FileTable({ rowContents }: FileTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Version</th>
          <th>Uploaded</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rowContents.map((content) => (
          <TableRow key={content.fileId} rowContent={content} />
        ))}
      </tbody>
    </table>
  )
}
