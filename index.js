const { send } = require("process");

const express = require("express"),
    wsInit = require("express-ws"),
    fs = require("fs"),
    app = express(),
    PORT = 5200,
    HTML_PATH = __dirname + '/templates/';


app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(HTML_PATH + "index.html")
})

wsInit(app);

app.ws('/music', (client, req) => {
    const filePath = __dirname + '/public/music.mp3';
    const chunkSize = 1024 * 500;
    client.position = 0;

    client.on('message', (message) => {
        if (message === 'play') {
            awakeMusic()
        }
    });

    client.on('close', () => {
        console.log('Client disconnected');
        clearInterval(client.interval);
    });

    client.on('error', (err) => {
        console.error('Error occurred:', err);
        clearInterval(client.interval);
    });

    const awakeMusic = () => {
        console.log("awaking the music loop")
        sendMeta()
        sendChunk()
        client.interval = setInterval(sendChunk, 1000 / 6);
    }

    const sendMeta = () => {
        const META = {
            fileSize: fs.statSync(filePath).size,
            format: "mp3",
            chunkSize: chunkSize
        }

        client.meta = META;
        const MSG2SEND = JSON.stringify({ event: "meta-music", data: META })
        client.send(MSG2SEND)
    }

    let last = null

    const sendChunk = () => {
        remainingFileSize = client.meta.fileSize - client.position;

        if (remainingFileSize <= 0) {
            clearInterval(client.interval)
            console.log("file sending is done;")
            return;
        }

        console.log(`[ ${(client.meta.fileSize / 1024).toFixed(0)} MB / ${(remainingFileSize / 1024).toFixed(0)} MB ]`);

        const chunkSizeToRead = Math.min(remainingFileSize, chunkSize);

        console.log({start: client.position, end: (client.position + chunkSizeToRead)})

        const chunk = fs.readFileSync(filePath, { encoding: 'base64', start: client.position, end: (client.position += chunkSizeToRead) });
        if (last !== chunk){
            last = chunk
            console.log("bruhhhh")
        }

        const MSG2send = JSON.stringify({ event: "binary-music", mp3: chunk });
        client.send(MSG2send);
    };
});


app.listen(PORT, () => {
    console.log(`🔊 Server started on ws://localhost:${PORT}/music 🔊`);
});