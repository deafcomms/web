import React from 'react';
import './App.css';
import { sendAudio } from './sendAudio';
import { useFilePicker } from 'use-file-picker';

export default function App() {

  const LoadingScreen = () => {
    return (
      <div>
        Loading...
      </div>
    );
  }
  const FileSelector = () => {
    return (
      <div>
        <button onClick={() => openFilePicker()} disabled={loading}>Select file</button>
        {filesContent.map((file, index) => (
          <div key={index}>
            <h2>{file.name}</h2>
            <br />
          </div>
        ))}
      </div>
    );
  }

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.pdf',
  });


  return (
    <div className="App">
      {loading ? <LoadingScreen /> : <FileSelector />}
    </div>
  );
}