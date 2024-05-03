class Disk {
    constructor(Name, song) {
        if (Name instanceof Array) {
            this.name = Name.name;
            this.track = Name.track;
        } else {
            this.name = Name || "Default disk name";
        }
        if (song instanceof Song) {
            this.track = [song];
        } else if (song instanceof Array){
            this.track = song;
        }
        else {
            this.track = [];
        }
        this.uuid = uuidv4()
    }

    save() {
        localStorage.setItem("disk-" + this.uuid + "-disk", JSON.stringify(this));
    }

    static loadDisk(uuid) {
        const disk = localStorage.getItem("disk-" + uuid + "-disk");
        if (disk != null) {
            return new Disk(JSON.parse(disk));
        }
        return new Disk(null, null);
    }
}