class User{    
    constructor(id, name, username, hash) {
        if(id)
            this.id = id;

        this.name = name;
        this.username = username;
        this.hash = hash;
    }
}

module.exports = User;
