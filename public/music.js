const playBtn = document.getElementById("playToggle");
playBtn.style.backgroundImage = "url('/play.png')";

playBtn.addEventListener("click", () => {
    console.log("hi");
    const backgroundImage = getComputedStyle(playBtn).backgroundImage;

    if (backgroundImage.includes("play.png")) { 
        playBtn.style.backgroundImage = "url('/pause.png')"; 
    } else {
        playBtn.style.backgroundImage = "url('/play.png')";
    }
});
