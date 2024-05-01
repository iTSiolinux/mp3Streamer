class Disk {
    constructor(Name, song) {
        if (Name instanceof Array){
            this.name = Name.name
            this.track = Name.track
        } else {
            this.name = Name || "Default disk name"
        }
        if (song instanceof Song){
            this.track = [song] 
        } else {
            this.track = []
        }
    }

    save () {
        localStorage.setItem("disk-" + this.name, JSON.stringify(this))
    }

    static loadDisk(name) {
        const disk = localStorage.getItem("disk-" + name)
        if (disk != null){
            return new Disk(JSON.parse(disk))
        } 
        return new Disk(name, null)
    }
}