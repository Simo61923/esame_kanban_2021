class Board{    

    constructor(id, name, owner, nCards, nCardStored) {
        if(id){
            this.id = id;
        }
            
        this.name = name;
        this.owner = owner;
        this.nCards = nCards;
        this.nCardStored = nCardStored;
    }


}


module.exports = Board;

