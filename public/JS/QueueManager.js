class QueueManager {
    constructor(element) {
        this.queueElement = element;

        this.queue = [];
        this.index = 0;
    }

    UpdatePlayerBar (d, t) {
        document.querySelector("body > div.player_bar > div.shadow").style.width = `${t / d}%`;
    }

    song = {
        Add: (song) => {
            if (song instanceof Song){
                this.queue.push(song)
                this.queueElement.append(song.element)
            }
        },
        Remove: (song) => {
            if (song instanceof Song){
                const songIndex = this.queue.indexOf(song);
                this.queue.splice(songIndex, 1);
                song.Remove()
            }
        }
    }

    Play () {
        this.index = this.index % this.queue.length;
        
        playBtn.style.backgroundImage = "url('/IMG/pause.png')"; 
        this.queue[this.index].element.play()
    }

    Pause () {
        playBtn.style.backgroundImage = "url('/IMG/play.png')";
        this.queue[this.index].element.pause()
    }
}

class Song {
    constructor (values) {
        console.log(values)
        this.authorName = values.author.name || "Default author name";
        this.durationInSeconds = values.duration.seconds || 0;
        this.thumbnail = values.thumbnail || "/error.png";
        this.name = values.title || "Default name";
        this.id = values.videoId || "";

        this.element = document.createElement("queue-item");

        this.element.setAttribute("song", this.name);
        this.element.setAttribute("artist", this.authorName);
        this.element.setAttribute("time", this.durationInSeconds);
        this.element.setAttribute("uuid", this.id);
    }

    Remove() {
        this.element?.pause()
        this.element?.remove()
    }
}