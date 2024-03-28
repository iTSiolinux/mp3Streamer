// Opening connection to a WebSocket
const socket = new WebSocket(`ws${location.protocol === "http:" ? "" : "s"}://${location.host}/music`);

let binaryData = []; // Initialize an empty array to store binary data
const chunkSize = 10240;

socket.addEventListener("error", (e) => {
    console.error(e);
});

socket.addEventListener("open", (e) => {
    console.warn("opened the socket: ", e);
    socket.send('play');
});

socket.addEventListener("message", (e) => {
    const unParsedQuery = e.data;
    const parsedQuery = JSON.parse(unParsedQuery);

    if (parsedQuery.event == "binary-music"){
        binaryData.push(new Uint8Array(parsedQuery.mp3));
    }

    if (binaryData.length * chunkSize >= totalFileSize) {
      let blob = new Blob(binaryData, { type: 'audio/mpeg' });
      let url = URL.createObjectURL(blob);
      
      document.getElementById('yourAudioElementId').src = url;
      
      // Revoke the object URL when no longer needed
      setTimeout(() => URL.revokeObjectURL(url), 60000); // Wait for some time before revoking the URL
      binaryData = []; // Reset the binaryData array
    }
});

socket.addEventListener("close", (e) => {
    console.warn("connection closed!", e);
});
