// Opening connection to a WebSocket
const socket = new WebSocket(`ws${location.protocol === "http:" ? "" : "s"}://${location.host}/music`);

let binaryData = []; // Initialize an empty array to store binary data
const chunkSize = 10240;

socket.addEventListener("error", (e) => {
    console.error(e);
});

socket.addEventListener("open", (e) => {
    console.warn("opened the socket: ", e);
});

socket.addEventListener("message", (e) => {
    const unParsedQuery = e.data;
    const parsedQuery = JSON.parse(unParsedQuery);

    const playChunk = (i = 0) => {
        const binary = binaryData[i];
        const formmatedUrl = `data:audio/mpeg;base64,${binary}`;
        
        document.getElementById("music").src = formmatedUrl;


        setTimeout(playChunk, 1000 * 30, i++)
    }


    if (parsedQuery.event == "binary-music"){
        binaryData.push(parsedQuery.mp3);
        console.log(parsedQuery)
        playChunk()
    } else if (parsedQuery.event == "meta-music"){
        socket.meta = parsedQuery.data;
    }
});

socket.addEventListener("close", (e) => {
    console.warn("connection closed!", e);
});
