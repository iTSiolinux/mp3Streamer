class SearchItem extends HTMLElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.attachEvents();
    }

    buildShadowRoot() {
        this.attachShadow({ mode: 'open' });

        const title = this.getAttribute('title') || '';
        const author = this.getAttribute('author') || '';
        const image = this.getAttribute('image') || '';
        const uuid = this.getAttribute('uuid') || '';

        const CSS = /* css */
        `
        :host {
            display: block;
            width: fit-content;
            max-width: 50%;
            background-color: var(--color-27);
            padding: 4px;
            margin-top: 10px;
            margin-left: 10px;
            border-radius: 5px;
        }

        img.thumbnail {
            width: 512px;
        }

        .plus {
            width: 32px;
            height: 32px;
            background-repeat: no-repeat;
            background-size: cover;
            background-image: url(/IMG/plus.png);
            margin-top: 5%; 
            margin-left: auto;
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
        `;

        const HTML = /* html */       
        ` 
        <style>${CSS}</style>
        <div class="data">            
            <h2>${title}</h2>
            <p>${author}</p>
        </div>
        <img class="thumbnail" src="${image}"/>
        <div class="plus squishy_button" uid="${uuid}"></div>
        `;

        this.shadowRoot.innerHTML = HTML;
    }

    attachEvents() {
        this.shadowRoot.querySelector('.plus').addEventListener('click', () => {
            this.addSong();
        });
    }

    static get observedAttributes() {
        return ['title', 'author', 'image', 'uuid'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'title':
                this.shadowRoot.querySelector('h2').textContent = newValue;
                break;
            case 'author':
                this.shadowRoot.querySelector('p').textContent = newValue;
                break;
            case 'image':
                this.shadowRoot.querySelector('img').src = newValue;
                break;
            case 'uuid':
                this.shadowRoot.querySelector('.plus').setAttribute('uid', newValue);
                break;
            default:
                break;
        }
    }

    addSong() {
        const queue_item = document.createElement("queue-item");
        queue_item.setAttribute("song", this.getAttribute('title'));
        queue_item.setAttribute("artist", this.getAttribute('author'));
        queue_item.setAttribute("time", this.getAttribute('time'));
        queue_item.setAttribute("uuid", this.getAttribute('uuid'));
        document.getElementById("queue").appendChild(queue_item);
    }
}

// Define the custom element
customElements.define('search-item', SearchItem);
