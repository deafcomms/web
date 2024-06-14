import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { FileUploader } from "react-drag-drop-files";

// Set AssemblyAI Axios Header
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "03fc8c0d61e7483c9af4143fe3baed38",
    "content-type": "application/json",
    "transfer-encoding": "chunked",
  },
})

const App = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null)

  function DragDrop() {
    const fileTypes = ["flac", "mp4", "mp3", "mpeg", "m4a", "ogg", "wav", "webm"];

    const handleChange = (file: File) => {
      setAudioFile(file)
    };
    return (
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    );
  }

  // AssemblyAI API

  // State variables
  const [uploadURL, setUploadURL] = useState("")
  const [transcriptID, setTranscriptID] = useState("")
  const [transcriptData, setTranscriptData] = useState<any>("")
  const [transcript, setTranscript] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Upload the Audio File and retrieve the Upload URL
  useEffect(() => {
    if (audioFile) {
      assembly.post("/upload", audioFile).then((res) => {
        setUploadURL(res.data.upload_url)
      }).catch((err) => {
        console.error(err)
      })
    }
  }, [audioFile])

  // Submit the Upload URL to AssemblyAI and retrieve the Transcript ID
  const submitTranscriptionHandler = () => {
    assembly.post("/transcript", {
      audio_url: uploadURL,
    }).then((res) => {
      setTranscriptID(res.data.id)
      checkStatusHandler()
    }).catch((err) => {
      console.error(err)
    }
    )
  }

  // Check the status of the Transcript
  const checkStatusHandler = async () => {
    setIsLoading(true)
    try {
      await assembly.get(`/transcript/${transcriptID}`).then((res) => {
        setTranscriptData(res.data)
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Periodically check the status of the Transcript
  useEffect(() => {
    const interval = setInterval(() => {
      if (transcriptData.status !== "completed" && isLoading) {
        checkStatusHandler()
      } else {
        setIsLoading(false)
        setTranscript(transcriptData.text)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  },)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Example" style={{ width: '200px', height: 'auto', margin: '20px' }} />
      <h1>DEAFCOMMS</h1>
      <DragDrop />
      {audioFile ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p>{audioFile.name}</p>
          <button style={{ alignSelf: 'center' }} onClick={submitTranscriptionHandler}>SUBMIT</button>
        </div>
      ) : (
        <p>Please Submit a file</p>
      )}

      {transcriptData.status === "completed" ? (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{fontWeight: "bold", marginRight: '5px'}}>File Transcript:</p>
          <p> {transcript}</p>
        </div>
      ) : (
        <p>{transcriptData.status}</p>
      )}
    </div>
  )
}

export default App
