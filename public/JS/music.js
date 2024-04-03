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
