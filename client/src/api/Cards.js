import moment from 'moment';

class Cards {

    constructor(id, id_board, title, description, id_column, deadline, archived, position) {
        if (id) {
            this.id = id;
        }

        this.id_board = id_board;
        this.title = title;
        this.description = description;
        this.id_column = id_column;
        if (deadline !== undefined) {
            this.deadline = moment(new Date(deadline));
        }
        this.archived = archived;
        this.position = position;
    }


}


export default Cards;

