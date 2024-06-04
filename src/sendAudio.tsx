export async function sendAudio(file: any) {
  try {
    fetch("", {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(file)
    }).then(async (response) => {
      const response_body = await response.json();
      if (response.status < 200 && response.status > 399) {
        throw new Error(`Request Error: ${JSON.stringify(response_body)}`);
      } else {
        return response_body;
      }
    });
  } catch (error) {
    alert(`Error while sending file : ${JSON.stringify(error)}`);
  }
}