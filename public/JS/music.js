// Queue Usage 
const Q = new QueueManager(document.getElementById("queue"), QueueItem)

// player toggle
const playBtn = document.getElementById("playToggle");
playBtn.style.backgroundImage = "url('/IMG/play.png')";

playBtn.addEventListener("click", () => {
    const backgroundImage = getComputedStyle(playBtn).backgroundImage;

    if (backgroundImage.includes("play.png")) {
        Q.Controller.Play()
    } else {
        Q.Controller.Pause()
    }
});

// search box
const searchBox = document.getElementById("search")
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (searchBox.value.length > 4) {
            fetch("/search?query=" + encodeURIComponent(searchBox.value))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status == "succes") {
                        temp = data
                        appendSearchRes(data)
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });

            while (document.getElementById("searchRes").firstChild) {
                document.getElementById("searchRes").removeChild(document.getElementById("searchRes").firstChild);
            }

            const loadingSVG = document.createElement("img")
            loadingSVG.src = "/IMG/search.gif"
            loadingSVG.classList.add("squishy_button")
            loadingSVG.style.width = "64px"
            loadingSVG.style.padding = "16px"
            loadingSVG.style.margin = "16px"

            document.getElementById("searchRes").append(loadingSVG)
        } else {
            const oldPlaceholder = searchBox.getAttribute("placeholder")
            searchBox.value = ''
            searchBox.setAttribute("placeholder", "Too much short, try again 😢")

            setTimeout(() => {
                searchBox.setAttribute("placeholder", oldPlaceholder)
            }, 1500)
        }
    }
});

function appendSearchRes(dataSet) {
    while (document.getElementById("searchRes").firstChild) {
        document.getElementById("searchRes").removeChild(document.getElementById("searchRes").firstChild);
    }

    dataSet.data.forEach(vid => {
        const SEARCH_ITEM = document.createElement("search-item")
        SEARCH_ITEM.setAttribute("title", vid.title)
        SEARCH_ITEM.setAttribute("author", vid.author.name)
        SEARCH_ITEM.setAttribute("image", vid.thumbnail)
        SEARCH_ITEM.setAttribute("uuid", vid.videoId)
        SEARCH_ITEM.setAttribute("time", vid.seconds)
        SEARCH_ITEM.vid = vid

        document.getElementById("searchRes").append(SEARCH_ITEM)
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const diskSelect = document.getElementById("diskSelect");
    const newDiskInput = document.getElementById("diskName");
    const saveDiskBTN = document.getElementById("save_btn");

    // Populate the dropdown with existing disks
    function populateDisks() {
        diskSelect.innerHTML = `
            <option value="" disabled selected>Select a disk</option>
            <option value="new">Add new disk...</option>
        `;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("disk-")) {
                const diskData = JSON.parse(localStorage.getItem(key));
                const option = document.createElement("option");
                option.value = diskData.uuid;
                option.textContent = diskData.name;
                diskSelect.appendChild(option);
            }
        }
    }

    function findDiskByName(name) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("disk-")) {
                const diskData = JSON.parse(localStorage.getItem(key));
                if (diskData.name === name) {
                    return diskData;
                }
            }
        }
        return null;
    }

    function deleteDiskByUUID(uuid) {
        localStorage.removeItem("disk-" + uuid + "-disk");
    }

    function saveNewDisk() {
        const diskName = newDiskInput.value;
        const existingDisk = findDiskByName(diskName);

        if (existingDisk) {
            deleteDiskByUUID(existingDisk.uuid);
        }

        const newDisk = new Disk(diskName, Q.queue); // Assuming Q.queue contains the current queue of songs
        newDisk.save();

        newDiskInput.value = "";
        newDiskInput.style.display = "none";

        populateDisks();

        diskSelect.value = newDisk.uuid;
    }

    function saveToExistingDisk(diskUUID) {
        deleteDiskByUUID(diskUUID);

        const diskName = diskSelect.options[diskSelect.selectedIndex].text;
        const newDisk = new Disk(diskName, Q.queue);
        newDisk.save();

        populateDisks();

        diskSelect.value = newDisk.uuid;
    }

    populateDisks();

    saveDiskBTN.addEventListener("click", () => {
        if (diskSelect.value === "new") {
            saveNewDisk();
        } else {
            saveToExistingDisk(diskSelect.value);
        }
    });

    diskSelect.addEventListener("change", (event) => {
        if (event.target.value === "new") {
            newDiskInput.style.display = "inline";
            newDiskInput.focus();
        } else {
            newDiskInput.style.display = "none";
        }
    });

    newDiskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && newDiskInput.value.length > 4) {
            saveNewDisk();
        }
    });

    if (localStorage.length < 1) {
        fetch("/search?query=Thunder")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    const song = new Song(data.data[0]);
                    const disk = new Disk("fav", song);
                    disk.save();
                    populateDisks();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const diskBtn = document.getElementById("disks-container");
    diskBtn.addEventListener("click", () => {
        const disksContainer = document.getElementById("disks-container");

        disksContainer.innerHTML = "";

        const disksDiv = document.createElement("div");
        disksDiv.id = "disk_div";

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("disk-")) {
                const diskData = JSON.parse(localStorage.getItem(key));

                const diskDiv = document.createElement("div");
                diskDiv.classList.add("track");
                diskDiv.style.textAlign = "center";

                const a = document.createElement("a");
                a.textContent = `Disk Name: ${diskData.name}, Track: ${diskData.track.length}`;
                diskDiv.append(a);

                for (let j = 0; j < diskData.track.length; j++) {
                    const song = diskData.track[j];
                    const p = document.createElement("p");
                    p.textContent = `${song.name}\n${song.authorName}`;
                    diskDiv.append(p);
                }

                const appendDiskBtn = document.createElement("div");
                appendDiskBtn.classList.add("plus", "squishy_button");
                appendDiskBtn.addEventListener("click", () => {
                    for (let j = 0; j < diskData.track.length; j++) {
                        const songData = diskData.track[j];
                        const song = new Song(songData);
                        Q.song.Add(song);
                    }
                });

                const removeDisk = document.createElement("div");
                removeDisk.classList.add("remove", "squishy_button");
                removeDisk.addEventListener("click", () => {
                    deleteDiskByUUID(diskData.uuid)
                    populateDisks()
                });

                const ButtonDiv = document.createElement("div")
                ButtonDiv.append(appendDiskBtn);
                ButtonDiv.append(removeDisk);
                diskDiv.append(ButtonDiv)

                fragment.appendChild(diskDiv);
            }
        }

        disksDiv.appendChild(fragment);
        if (disksDiv.children.length){
            document.body.appendChild(disksDiv);

            disksDiv.style.position = "absolute";
            disksDiv.style.top = `${disksContainer.offsetTop}px`;
            disksDiv.style.left = `${disksContainer.offsetLeft}px`;
    
            disksDiv.addEventListener("mouseleave", () => {
                disksDiv.remove();
            });
        }
    });
});
