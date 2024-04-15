// Queue Usage 
const Q = new QueueManager(document.getElementById("queue"), QueueItem)

// player toggle
const playBtn = document.getElementById("playToggle");
playBtn.style.backgroundImage = "url('/IMG/play.png')";

playBtn.addEventListener("click", () => {
    const backgroundImage = getComputedStyle(playBtn).backgroundImage;

    if (backgroundImage.includes("play.png")) { 
        Q.Controller.Play()
    } else {
        Q.Controller.Pause()
    }
});

// search box
const searchBox = document.getElementById("search")
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (searchBox.value.length > 4){
            while (document.getElementById("searchRes").firstChild) {
                document.getElementById("searchRes").removeChild(document.getElementById("searchRes").firstChild);
            }

            const loadingSVG = document.createElement("img")
            loadingSVG.src = "/IMG/search.gif"
            loadingSVG.classList.add("squishy_button")
            loadingSVG.style.width = "64px"
            loadingSVG.style.padding = "16px"
            loadingSVG.style.margin = "16px"

            document.getElementById("searchRes").append(loadingSVG)

            fetch("/search?query=" + encodeURIComponent(searchBox.value))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status == "succes"){
                    temp = data
                    appendSearchRes(data)
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            const oldPlaceholder = searchBox.getAttribute("placeholder")
            searchBox.value = ''
            searchBox.setAttribute("placeholder", "Too much short, try again 😢")

            setTimeout(()=>{
                searchBox.setAttribute("placeholder", oldPlaceholder)
            }, 1500)
        }
    }
});

function appendSearchRes(dataSet) {
    while (document.getElementById("searchRes").firstChild) {
        document.getElementById("searchRes").removeChild(document.getElementById("searchRes").firstChild);
    }

    dataSet.data.forEach(vid => {
        const SEARCH_ITEM = document.createElement("search-item")
        SEARCH_ITEM.setAttribute("title", vid.title)
        SEARCH_ITEM.setAttribute("author", vid.author.name)
        SEARCH_ITEM.setAttribute("image", vid.thumbnail)
        SEARCH_ITEM.setAttribute("uuid", vid.videoId)
        SEARCH_ITEM.setAttribute("time", vid.seconds)
        SEARCH_ITEM.vid = vid

        document.getElementById("searchRes").append(SEARCH_ITEM)
    });
}

