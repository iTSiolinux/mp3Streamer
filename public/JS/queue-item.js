class QueueItem extends HTMLElement {
    constructor() {
        super();
        this.buildShadow()
    }

    //  observed attributes
    static get observedAttributes() {
        return ['song', 'artist', 'time', 'uuid'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'song') {
            this.shadowRoot.querySelector('h2').textContent = newValue;
        } else if (name === 'artist') {
            this.shadowRoot.querySelector('p:nth-of-type(1)').textContent = newValue;
        } else if (name === 'time') {
            let time = parseInt(newValue) || 0;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            const formattedTime = `${minutes < 10 ? '' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            this.shadowRoot.querySelector('p:nth-of-type(2)').textContent = formattedTime;
        } else if (name === 'uuid') {
            this.song.fetch()
        }
    }

    // build element shadow
    buildShadow() {
        this.attachShadow({ mode: 'open' });
        const songName = this.getAttribute('song') || 'Default Song';
        const artistName = this.getAttribute('artist') || 'Default Artist';
        let time = parseInt(this.getAttribute('time')) || 0;

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        // Format time as mm:ss
        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

        const HTML = /* html */
            `
            <div class="data">            
                <h2>${songName}</h2>
                <p>${artistName}</p>
                <p>${formattedTime}</p>
            </div>
            <div class="three_dots squishy_button"></div>
            <link rel="stylesheet" href="/CSS/QueueItem.css">
        `;

        this.shadowRoot.innerHTML = HTML;

        this.shadowRoot.querySelector('.three_dots').addEventListener('click', () => {
            this.context.open();
        });
    }

    // context utills
    context = {
        open: () => {
            if (this?.ctxElem === undefined) {
                this.ctxElem = document.createElement("div");

                this.ctxElem.classList.add("context-queue-item");

                this.context.appendOptions()

                this.shadowRoot.querySelector('.three_dots').appendChild(this.ctxElem)


                this.addEventListener("mouseleave", this.closeContext);
            }
        },
        close: () => {
            this.ctxElem.style.animation = "scaleEffectReverse 0.5s ease forwards";
            setTimeout(() => {
                this.ctxElem?.remove();
                this.ctxElem = undefined;
            }, 500);
        },
        appendOptions: () => {
            const CSS = /* css */
                `
            div.option {
                width: 100%;
                height: 32px;
                background-color: cyan;
                border-radius: 5px;
                padding: 4px;
                text-align: center;
                transition: 250ms;
                user-select: none;
            }

            div.option:hover {
                transition: 750ms;
                scale: 1.1;
            }

            div.option:active {
                scale: 1.05;
            }
            `

            const HTML = /* html */
                `
            <style> ${CSS} </style>
            <div class="option" ID="1">Add to favorite ❤</div>
            <div class="option" ID="2">Remove from queue 🗑</div>
            <div class="option" ID="3">Move to the top ⏫</div>
            <div class="option" ID="4">Move to the bottom ⏬</div>
            `

            this.ctxElem.innerHTML = HTML
            const optionsArray = this.ctxElem.getElementsByClassName("option")
            for (let i = 0; i < optionsArray.length; i++) {
                const optionElem = optionsArray[i];
                if (typeof optionElem === 'object') {
                    optionElem.addEventListener("click", () => {
                        this.context.handleOptions(optionElem)
                    })
                }
            }
        },
        handleOptions: (elem) => {
            if (elem instanceof HTMLDivElement) {
                this.context.close()

                const ID = elem.getAttribute("ID")
                if (ID == 1){

                }
                else if (ID == 2) {
                    this.style.animation = "scaleEffectReverse 1s forwards"
                    setTimeout(() => {
                        if (Q.index == Q.RemoveSong(this)) {
                            Q.Controller.Pause()
                        }
                        clearInterval(this.loop)
                        this.song.pause()
                        this.remove()
                    }, 900)
                } else if (ID == 3) {

                } else if (ID == 4) {
                    
                }
            }
        }
    }
    // song utills 
    song = {
        fetch: () => {
            const uuid = this.getAttribute("uuid");
            fetch(`/music?uuid=${uuid}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Get the response body as a blob
                })
                .then(blob => {
                    const audioURL = URL.createObjectURL(blob); // Create a URL for the blob
                    const audio = new Audio(audioURL); // Create a new Audio object
                    this.mp3 = audio;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },
        play: () => {
            this.mp3.play()
            this.classList.add("playing")
            this.loop = setInterval(()=>{
                Q.UpdatePlayerBar(this.mp3.duration, this.mp3.currentTime)
                if (this.mp3.duration == this.mp3.currentTime){
                    Q.Controller.Reset()
                    Q.Controller.Pause()
                    Q.index++;
                    Q.Controller.Play()
                }
            }, 5)
        },
        reset: () => {
            this.classList.remove("playing")
            this.mp3.currentTime = 0;
        },
        pause: () => {
            clearInterval(this.loop)
            this.mp3.pause()
        }
    }
}

customElements.define('queue-item', QueueItem);
