const playBtn = document.getElementById("playToggle");
playBtn.style.backgroundImage = "url('/IMG/play.png')";

playBtn.addEventListener("click", () => {
    const backgroundImage = getComputedStyle(playBtn).backgroundImage;

    if (backgroundImage.includes("play.png")) { 
        playBtn.style.backgroundImage = "url('/IMG/pause.png')"; 
    } else {
        playBtn.style.backgroundImage = "url('/IMG/play.png')";
    }
});



const searchBox = document.getElementById("search")

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (searchBox.value.length > 4){
            fetch("/search?query=" + encodeURIComponent(searchBox.value))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                temp = data
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