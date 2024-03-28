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
    const chunkSize = 10240;
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
        sendChunk()
        client.interval = setInterval(sendChunk, 1000 / 60);
    }

    const sendMeta = () => {
        
    }

    const sendChunk = () => {
        const chunk = fs.readFileSync(filePath, { encoding: 'binary', start: client.position, end: client.position += chunkSize });
        const MSG2send = JSON.stringify({ event: 'binary-music', mp3: chunk })
        client.send(MSG2send);
        client.position += chunkSize;
    };
});


app.listen(PORT, () => {
    console.log(`🔊 Server started on ws://localhost:${PORT}/music 🔊`);
});