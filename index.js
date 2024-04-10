const express = require("express"),
    app = express(),
    PORT = 5200,
    HTML_PATH = __dirname + '/templates/',
    CACHE_PATH = __dirname + '/.cache/';

    const ytSearch = require('yt-search');

    // Define your search query
    const query = 'blinding lights';
    
    // Perform the search
    ytSearch(query, function (err, result) {
      if (err) throw err;
    
      // Process the search results
      console.log(JSON.stringify(result, null, 2));
    });
    

app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile(HTML_PATH + "index.html")
})

app.get("/music/", (req, res) => {
    const songID = req.query["id"];
    console.log("requested song ID: " + songID)
})

app.get("/search/", (req, res) => {
    const query = req.query["query"];

    const response = {query, response: "Yay fake, success"}
    res.json(response)
}) 

app.listen(PORT, () => {
    console.log(`🔊 Server started on localhost:${PORT} 🔊`);
});