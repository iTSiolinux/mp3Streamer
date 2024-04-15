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

            playBtn.style.backgroundImage = "url('/IMG/pause.png')";
            this.queue[this.index].element.song.play()
        },
        Reset: () => {
            this.queue[this.index].element.song.reset()
        },
        Pause: () => {
            playBtn.style.backgroundImage = "url('/IMG/play.png')";
            this.queue[this.index].element.song.pause()
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
        }
    }
}

class Song {
    constructor(values) {
        this.authorName = values.author.name || "Default author name";
        this.durationInSeconds = values.duration.seconds || 0;
        this.thumbnail = values.thumbnail || "/error.png";
        this.name = values.title || "Default name";
        this.id = values.videoId || "";
        this.vid = values;

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