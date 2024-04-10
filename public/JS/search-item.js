class SearchItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const title = this.getAttribute('title') || 'Default title';
        const author = this.getAttribute('author') || 'Default author';
        const image = this.getAttribute('image') || 'Default image';

        const CSS = /* css */
        `
        :host {
            width: fit-content;
            max-width: 100%;

            background-color: var(--color-27);
            padding: 4px;
            margin-top: 10px;
            margin-left: 10px;
            border-radius: 5px;
        }
        img.thumbnail {
            width: 512px;
        }
        `

        const HTML = /* html */       
        ` 
            <div class="data">            
                <h2>${title}</h2>
                <p>${author}</p>
            </div>
            <img class="thumbnail" src="${image}"/>
            <div class="plus squishy_button"></div>
            <style> ${CSS} </style>
        `

        this.shadowRoot.innerHTML = HTML;
;

        this.shadowRoot.querySelector('.plus').addEventListener('mouseup', () => {
            this.addSong();
        });
    }

    static get observedAttributes() {
        return ['title', 'author', 'image'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            const titleHeading = this.shadowRoot.querySelector('h2');
            titleHeading.textContent = newValue;
        } else if (name === 'author') {
            const authorParagraph = this.shadowRoot.querySelector('p');
            authorParagraph.textContent = newValue;
        } else if (name === 'image'){
            const authorParagraph = this.shadowRoot.querySelector('img');
            authorParagraph.src = newValue;
        }
    }

    addSong () {

    }
}

// Define the custom element
customElements.define('search-item', SearchItem);
