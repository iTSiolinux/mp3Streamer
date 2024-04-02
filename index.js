const { send } = require("process");

const express = require("express"),
    app = express(),
    PORT = 5200,
    HTML_PATH = __dirname + '/templates/',
    CACHE_PATH = __dirname + '/.cache/';

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(HTML_PATH + "index.html")
})

app.get("/music/", (req, res) => {
    const songID = req.query["id"];
    console.log("requested song ID: " + songID)
})

app.listen(PORT, () => {
    console.log(`🔊 Server started on localhost:${PORT} 🔊`);
});