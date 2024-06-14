export async function sendAudio(file: File, token: string) {
  try {
    // curl -X POST "https://localhost:3000/poyo" 
    //   -H "Authorization: Bearer $ACCESS_TOKEN"
    //   -H "Content-Type: multipart/form-data" 
    //   -F "media=@/path/to/media_file.mp3;type=audio/mp3"
    //   -F "options={\"metadata\":\"This is a sample submit jobs option for multipart\", \"custom_vocabularies\":[{\"phrases\": [\"Amelia Earhart\", \"Paul McCartney\"]}]}"

    const formData = new FormData();
    formData.append('media', file, file.name);
    formData.append('options', JSON.stringify({
      metadata: 'This is a sample submit jobs option for multipart',
      custom_vocabularies: [
        { phrases: ['Amelia Earhart', 'Paul McCartney'] }
      ]
    }));
    const request = await fetch("https://api.rev.ai/speechtotext/v1/jobs", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    console.log("SEND AUD: ", request.status);
    const request_body = await request.json();
    if (request.status < 200 && request.status > 399) {
      throw new Error(`Request Error: ${JSON.stringify(request_body)}`);
    } else {
      return request_body;
    }
  } catch (error) {
    alert(`Error while sending file : ${JSON.stringify(error)}`);
  }
}

export async function checkStatus(id: string, token: string) {
  try {
    console.log(`CHECK STAT ID : ${id} - tok: ${token}`);
    const request = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("FETCH OVERTT");
    const request_body = await request.json();
    if (request.status < 200 && request.status > 399) {
      alert(`${request.status} - Request Error: ${JSON.stringify(request_body)}`)
      throw new Error(`${request.status} - Request Error: ${JSON.stringify(request_body)}`);
    } else {
      return request_body;
    }
  } catch (e) {
    alert(`Error while Checking Status : ${JSON.stringify(e)}`);
  }
}

export async function getFileData(id: string, token: string) {
  try {
    const request = await fetch(`https://api.rev.ai/speechtotext/v1/jobs/${id}/transcript`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.rev.transcript.v1.0+json'
      },
    });
    const request_body = await request.json();
    if (request.status < 200 && request.status > 399) {
      alert(`${request.status} - Request Error: ${JSON.stringify(request_body)}`)
      throw new Error(`${request.status} - Request Error: ${JSON.stringify(request_body)}`);
    } else {
      return request_body;
    }

  } catch (e) {
    alert(`Error While Retrieving data : ${JSON.stringify(e)}`);
  }
}