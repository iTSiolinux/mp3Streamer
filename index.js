const express = require("express"),
    app = express(),
    PORT = 5200,
    HTML_PATH = __dirname + '/templates/',
    CACHE_PATH = __dirname + '/.cache/',
    YT_SEARCH = require('yt-search');



app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(HTML_PATH + "index.html")
})

app.get("/music/", (req, res) => {
    const songID = req.query["id"];
    console.log("requested song ID: " + songID)
})

app.get("/search", (req, res) => {
    const query = req.query["query"];

    // Perform the search
    YT_SEARCH(query, function (err, result) {
        const DATA = { status: "error", data: null }
        if (err) {
            res.json(DATA)
        } else {
            DATA.status = "succes"

            const first3vids = result?.videos.slice(0, 3)

            DATA.data = first3vids
            res.json(DATA)
        }
    });

})

app.listen(PORT, () => {
    console.log(`🔊 Server started on localhost:${PORT} 🔊`);
});