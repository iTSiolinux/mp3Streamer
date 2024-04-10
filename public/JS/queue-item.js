let temp = null

class QueueItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const songName = this.getAttribute('song') || 'Default Song';
        const artistName = this.getAttribute('artist') || 'Default Artist';

        const CSS = /* css */
        `
        :host {
            position: relative;
            display: flex;
            height: fit-content;

            flex-wrap: wrap;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px; 
        }
        div.data {
            order: -1;
            margin-right: 10px;
        }
        
        div.three_dots {
            width: 32px;
            height: 32px;

            background-repeat: no-repeat;
            background-size: cover;
            background-image: url(/IMG/dots.png);
            margin-top: 5%; 
            margin-left: auto;
        }

        p, h2 {
            margin: 0;
            height: fit-content;
        }

        .squishy_button {
            width: 64px;
            height: 64px;

            transition: 250ms;
            background-color: var(--color-27);
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 15%;
        }

        .squishy_button:hover {
            background-color: var(--color-26);
            transition: 250ms;
        }

        .squishy_button:active {
            background-color: var(--color-25);
            transition: 250ms;
        }

        .context-queue-item {
            position: absolute;
            display: grid;
            width: 100%;
            height: fit-content;

            z-index: 1;
            box-sizing: border-box;
            background-color: white;
            left: 0;
            top: 100%;
            gap: 4px;
            padding: 4px;
            justify-content: center;
            animation: scaleEffect 0.5s ease forwards;
        }

        @keyframes scaleEffect {
            from {
                transform: scale(0, 0) translate(100%, -100%); /* Start from a small scale and top-right position */
                opacity: 0; /* Start with opacity 0 */
            }
            to {
                transform: scale(1, 1) translate(0, 0); /* Scale to full size and center position */
                opacity: 1; /* Show with full opacity */
            }
        }

        @keyframes scaleEffectReverse {
            from {
                transform: scale(1, 1) translate(0, 0); /* Start from full size and center position */
                opacity: 1; /* Start with full opacity */
            }
            to {
                transform: scale(0, 0) translate(100%, -100%); /* Scale to small size and top-right position */
                opacity: 0; /* Hide with zero opacity */
            }
        }
        `

        const HTML = /* html */       
        ` 
            <div class="data">            
                <h2>${songName}</h2>
                <p>${artistName}</p>
            </div>
            <div class="three_dots squishy_button"></div>
            <style> ${CSS} </style>
        `

        this.shadowRoot.innerHTML = HTML;
;

        this.shadowRoot.querySelector('.three_dots').addEventListener('mouseup', () => {
            this.openContext();
        });
    }

    static get observedAttributes() {
        const observedAttributesArray = []
        for (const attribute in this) {
            observedAttributesArray.push(attribute)
        }
        return observedAttributesArray;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'song') {
            const songHeading = this.shadowRoot.querySelector('h2');
            songHeading.textContent = newValue;
        } else if (name === 'artist') {
            const artistParagraph = this.shadowRoot.querySelector('p');
            artistParagraph.textContent = newValue;
        }
    }

    openContext () {
        if (this?.ctxElem === undefined){
            this.ctxElem = document.createElement("div");
    
            this.ctxElem.classList.add("context-queue-item");
    
            this.appendOptions()
    
            this.shadowRoot.querySelector('.three_dots').appendChild(this.ctxElem)
            

            this.addEventListener("mouseleave", this.closeContext);
        }
    }

    closeContext () {
        this.ctxElem.style.animation = "scaleEffectReverse 0.5s ease forwards"; // Apply the reverse animation
        setTimeout(() => {
            this.ctxElem?.remove();
            this.ctxElem = undefined;
        }, 500); // Remove the element after the animation completes
}

    appendOptions() {
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
        <div class="option" ID="3">Move to the bottom ⏬</div>
        <div class="option" ID="4">Move to the top ⏫</div>
        `
        this.ctxElem.innerHTML = HTML
        const optionsArray = this.ctxElem.getElementsByClassName("option")
        for (let i = 0; i < optionsArray.length; i++) {
            const optionElem = optionsArray[i]; 
            if (typeof optionElem === 'object') {
                optionElem.addEventListener("click", () => {
                    this.handleOption(optionElem)
                })
            }
        }
    }

    handleOption(elem) {
        if (elem instanceof HTMLDivElement){
            this.closeContext()

            const ID = elem.getAttribute("ID")
            if (ID == 2){
                this.style.animation = "scaleEffectReverse 1s forwards"
                setTimeout(()=>{
                    this.remove()
                }, 900)
            }
        }
    }
}

// Define the custom element
customElements.define('queue-item', QueueItem);
