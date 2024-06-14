import React from 'react';
import './App.css';
import { FileUploader } from "react-drag-drop-files";
import { checkStatus, sendAudio, getFileData } from './sendAudio';

const saveAsTextFile = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function App() {
  interface ButtonProps {
    color: string;
    text: string;
    onClick: any;
  }
  //flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
  const fileTypes = ["flac", "mp4", "mp3", "mpeg", "m4a", "ogg", "wav", "webm"];
  const [file, setFile] = React.useState<File | null>(null);
  const [jobId, setJobID] = React.useState("");
  const [status, setStatus] = React.useState<Map<string, string>>(new Map());

  const accessToken = "02d9*";

  function DragDrop() {

    const handleChange = (file: File) => {
      setFile(file);
      const fileUri = URL.createObjectURL(file);
      alert(`FILE CHARGED: ${fileUri}`);
    };
    return (
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    );
  }

  const transmitData = async (file: File) => {
    const res = await sendAudio(file, accessToken)
    if (res != null) {
      alert(`JOB ID BOZZO: ${res.id}`);
      setJobID(res.id);
      setStatus(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(res.id, res.status);
        return newMap;
      });
    }

    const stat = await checkStatus(jobId, accessToken)
    alert(`CHECK DATA STATUS: ${JSON.stringify(stat)}`);
    console.log(`CHECK DATA STATUS: ${JSON.stringify(stat)}`);
  }

  const Button: React.FC<ButtonProps> = ({ color, text, onClick }) => {
    return (
      <button
        style={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };

  const ccat = async () => {
    const request = await fetch(`https://catfact.ninja/fact`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json"
      }
    });
    const body = await request.json();
    alert(`Stat ${request.status} : ${JSON.stringify(body)}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginTop: '5%', fontSize: '3em' }}>
        Software Engineering Final Project
      </h1>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <DragDrop />
      </div>

      {(file == null) ? null :
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h2>{file.name}</h2>
          <div >
            <Button color="blue" text="Download Subtitles" onClick={() => { transmitData(file) }} />
          </div>
        </div>}
        <Button color="pink" text="check status" onClick={async () => {
        const stat = await checkStatus(jobId, accessToken)
        alert(`CHECK DATA STATUS: ${JSON.stringify(stat)}`);
        console.log(`CHECK DATA STATUS: ${JSON.stringify(stat)}`);
      }} />
      <Button color="cyan" text="Retrieve File" onClick={async () => {
        const stat = await getFileData(jobId, accessToken)
        alert(`GET DATA STATUS: ${JSON.stringify(stat)}`);
        console.log(`GET DATA STATUS: ${JSON.stringify(stat)}`);
      }} />
      <Button color='red' text='cat' onClick={() => {ccat()}}/>
    </div>
  );
}