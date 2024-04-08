class QueueItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const songName = this.getAttribute('song') || 'Default Song';
        const artistName = this.getAttribute('artist') || 'Default Artist';

        this.shadowRoot.innerHTML =
        ` 
            <style>
                :host {
                    position: relative;
                    display: flex;
                    width: fit-content;
                    height: fit-content;

                    flex-wrap: wrap;
                    padding: 10px;
                    border: 1px solid #ccc; /* Example border */
                    border-radius: 5px; /* Example border radius */
                }
                div.data {
                    order: -1;
                }
                
                div.three_dots {
                    width: 32px;
                    height: 32px;

                    background-repeat: no-repeat;
                    background-size: cover;
                    background-image: url(/IMG/dots.png);
                    margin-top: 5%; 
                }

                p, h2 {
                    margin: 0;
                    height: fit-content;
                }
            </style>

            <div class="data">            
                <h2>${songName}</h2>
                <p>${artistName}</p>
            </div>
            <div class="three_dots"></div>
        `;
    }

    static get observedAttributes() {
        return ['song', 'artist']; // Specify the attributes to observe for changes
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
}

// Define the custom element
customElements.define('queue-item', QueueItem);