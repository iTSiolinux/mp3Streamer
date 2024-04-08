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
                    display: grid;
                    width: fit-content;
                    height: fit-content;

                    grid-template-columns: auto auto;
                    padding: 10px;
                    border: 1px solid #ccc; /* Example border */
                    border-radius: 5px; /* Example border radius */
                }
                h2 {
                    margin-bottom: 5px; /* Bottom margin for separation */
                }
                
                div {
                    width: 32px;
                    height: 32px;

                    background-repeat: no-repeat;
                    background-size: cover;
                    background-image: url(/IMG/dots.png);
                }
            </style>
            <h2>${songName}</h2>
            <div></div>
            <p>${artistName}</p>
        `;
    }
}

// Define the custom element
customElements.define('queue-item', QueueItem);