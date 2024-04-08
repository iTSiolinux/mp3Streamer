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
                    flex-direction: column; /* Display children in a column */
                    gap: 5px; /* Gap between children */
                    width: fit-content;
                    height: fit-content;
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
            <p>${artistName}</p>
            <div></div>
        `;
    }
}

// Define the custom element
customElements.define('queue-item', QueueItem);