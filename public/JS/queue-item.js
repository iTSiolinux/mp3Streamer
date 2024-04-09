class QueueItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const songName = this.getAttribute('song') || 'Default Song';
        const artistName = this.getAttribute('artist') || 'Default Artist';

        this.shadowRoot.innerHTML = /* html */
            ` 
            <div class="data">            
                <h2>${songName}</h2>
                <p>${artistName}</p>
            </div>
            <div class="three_dots squishy_button"></div>
            <style>
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
                    display: block;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    background-color: white;
                    left: 0;
                }
            </style>
        `;

        this.shadowRoot.querySelector('.three_dots').addEventListener('click', () => {
            this.displayContextMenu();
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

    displayContextMenu () {
        this.contextElem = document.createElement("div");
        const Elem = this.contextElem;

        Elem.classList.add("context-queue-item");

        

        this.shadowRoot.querySelector('.three_dots').appendChild(Elem)

        function clickOutsideHandler(event) {
            if (!Elem.contains(event.target)) {
                Elem.remove();
            }
        }
        
        document.addEventListener("mouseout", clickOutsideHandler);
    }
}

// Define the custom element
customElements.define('queue-item', QueueItem);

