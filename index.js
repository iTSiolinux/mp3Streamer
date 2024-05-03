const express = require("express"),
    app = express(),
    PORT = 5000,
    HTML_PATH = __dirname + '/templates/',
    CACHE_PATH = __dirname + '/.cache/',
    fs = require('fs'),
    ytdl = require('ytdl-core'),
    YT_SEARCH = require('yt-search');



app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(HTML_PATH + "index.html")
})

app.get("/music", async (req, res) => {
    try {
        const uuid = req.query["uuid"];
        if (!uuid) {
            return res.status(400).send('UUID parameter is required');
        }

        const filePath = `${CACHE_PATH}/${uuid}.mp3`;
        // Check if the MP3  cache directory exists and create it if it doesn't
        if (!fs.existsSync(CACHE_PATH)) {
            fs.mkdirSync(CACHE_PATH);
        }
        // Check if the MP3 file already exists in cache
        if (fs.existsSync(filePath)) {
            console.log(`MP3 file for UUID ${uuid} already exists in cache.`);
            // If file exists, serve the cached file
            return res.sendFile(filePath);
        }

        const songURL = 'https://youtube.com/watch?v=' + uuid;

        // Download the song from YouTube
        const audioStream = ytdl(songURL, { filter: 'audioonly' });
        const fileStream = fs.createWriteStream(filePath);
        audioStream.pipe(fileStream);

        // When download is complete, send the file
        fileStream.on('finish', () => {
            console.log(`Song with UUID ${uuid} downloaded and saved to cache.`);
            res.sendFile(filePath);
        });

        // Handle errors during download
        audioStream.on('error', (err) => {
            console.error(`Error downloading song: ${err.message}`);
            res.status(500).send('Error downloading song');
        });
    } catch (error) {
        console.error(`Error processing request: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

app.get("/search", (req, res) => {
    const query = req.query["query"];

    // Perform the search
    YT_SEARCH(query, function (err, result) {
        const DATA = { status: "error", data: null }
        if (err) {
            DATA.data = err;
            res.json(DATA)
            console.error(err)
        } else {
            DATA.status = "succes"
            console.log("success " + query)
            const first3vids = result?.videos.slice(0, 14)

            DATA.data = first3vids
            res.json(DATA)
        }
    });

})

app.listen(PORT, () => {
    console.log(`🔊 Server started on http://localhost:${PORT} 🔊`);
});