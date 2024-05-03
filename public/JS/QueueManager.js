class QueueManager {
    constructor(element) {
        this.queueElement = element;

        this.queue = [];
        this.index = 0;
    }

    UpdatePlayerBar(d, t) {
        document.querySelector("body > div.player_bar > div.shadow").style.width = `${t / d * 100}%`;
    }

    song = {
        Add: (song) => {
            if (song instanceof Song) {
                this.queue.push(song)
                this.queueElement.append(song.element)
            }
        },
        Remove: (song) => {
            if (song instanceof Song) {
                const songIndex = this.queue.indexOf(song);
                this.queue.splice(songIndex, 1);
                song.Remove()
            }
        }
    }

    Controller = {
        Play: () => {
            this.index = Math.max(this.index % this.queue.length, 0);
            this.queue[this.index]?.element.song.play()
            const playBtn = document.getElementById("playToggle");
            playBtn.style.backgroundImage = "url('/IMG/pause.png')";

            this.Controller.loop = setInterval(() => {
                const mp3 = this.queue[this.index]?.element.mp3
                if (mp3 instanceof Audio){
                    this.UpdatePlayerBar(mp3.duration, mp3.currentTime)
                    if (mp3.duration == mp3.currentTime) {
                        Q.Controller.Pause()
                        Q.Controller.Reset()
                        Q.index++;
                        Q.Controller.Play()
                    }
                } else {
                    this.UpdatePlayerBar(100, 0)
                }


            }, 5)
        },
        Reset: () => {
            this.queue[this.index].element.song.reset()
        },
        Pause: () => {
            this.queue[this.index]?.element.song.pause()
            const playBtn = document.getElementById("playToggle");
            playBtn.style.backgroundImage = "url('/IMG/play.png')";

        },
        Next: () => {
            this.Controller.Pause()
            this.Controller.Reset()
            this.index++;
            this.index = Math.max(this.index, this.queue.length - 1)

            this.Controller.Play()
        },
        Back: () => {
            this.Controller.Pause()
            this.Controller.Reset()
            this.index--;
            this.index = Math.min(this.index, 0)
            this.Controller.Play()
        },
        loop: null
    }
}

class Song {
    constructor(values) {
        this.authorName = (values.author || values.authorName) ? (values.author?.name || values.authorName || "Default author name passed") : "Default author name";
        this.durationInSeconds = (values.duration || values.durationInSeconds)  ? values.duration?.seconds || values.durationInSeconds || -1 : 0;
        this.thumbnail = values.thumbnail || "/error.png";
        this.name = values.title || values.name || "Default name";
        this.id = values.videoId || values.id || "";
        this.vid = values;

        this.element = document.createElement("queue-item"); // Create custom queue-item element

        this.element.setAttribute("song", this.name);
        this.element.setAttribute("artist", this.authorName);
        this.element.setAttribute("time", this.durationInSeconds);
        this.element.setAttribute("uuid", this.id);
    }

    Remove() {
        if (this.element.song) {
            this.element.song.pause(); // Assuming this is how you access the audio element
        }
        this.element?.remove();
    }
}
