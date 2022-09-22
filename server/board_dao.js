'use strict';

const Board = require('./board');
const db = require('./db');
const Column = require('./column');
const Cards = require('./cards');
const Link = require('./link');


/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createBoard = function (row) {
    const id = row.id;
    const name = (row.name? row.name : row.title);
    const owner = row.owner;
    const nCards = row.nCards;
    const nCardStored = row.nCardStored;

    return new Board(id, name, owner, nCards, nCardStored);
}

const createColumn = function (row) {
    const id = row.id;
    const id_board = row.id_board;
    const description = row.description;

    return new Column(id, id_board, description);
}

const createCard = function (row) {

    const id = row.id;
    const id_board = row.id_board;
    const title = row.title;
    const description = row.description;
    const id_column = row.id_column;
    const deadline = row.deadline;
    const archived = (row.archived == 1) ? true : false;
    const position = row.position;
    return new Cards(id, id_board, title, description, id_column, deadline, archived,position);
}

//get Boards for user
exports.getBoards = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `select b.id as id, b.title as name,owner as owner,sum(case when (c.archived is null or c.archived = 0)  and c.id is not null then 1 else 0 end) as nCards, sum(case when (c.archived = 1)  and c.id is not null then 1 else 0 end)as nCardStored
        from kanban_t_boards b
        left join kanban_t_cards c on c.id_board = b.id
        where owner = ?
        group by b.id`;
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let boards = rows.map((row) => createBoard(row));
                resolve(boards);
            }
        });
    });
}

//get Boards shared with user
exports.getSharedBoards = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `select b.id as id, b.title as name,b.owner as owner,sum(case when (c.archived is null or c.archived = 0)  and c.id is not null then 1 else 0 end) as nCards, sum(case when (c.archived = 1)  and c.id is not null then 1 else 0 end)as nCardStored
        from kanban_r_shared s
        inner join kanban_t_boards b on b.id = s.id_board
        left join kanban_t_cards c on c.id_board = b.id
        where s.id_shared = ?
        group by b.id`;
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let boards = rows.map((row) => createBoard(row));
                resolve(boards);
            }
        });
    });
}

//get Boards shared by user
exports.getSharedBoardsByUser = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `select b.id as id, b.title as name,b.owner as owner,sum(case when (c.archived is null or c.archived = 0)  and c.id is not null then 1 else 0 end) as nCards, sum(case when (c.archived = 1)  and c.id is not null then 1 else 0 end)as nCardStored
        from kanban_r_shared s
        inner join kanban_t_boards b on b.id = s.id_board
        left join kanban_t_cards c on c.id_board = b.id
        where s.id_owner = ?
        group by b.id`;
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let boards = rows.map((row) => createBoard(row));
                resolve(boards);
            }
        });
    });
}

/**
 * Delete a board with a given id
 */
exports.deleteBoard = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM kanban_t_boards WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        })
    });
}
exports.getBoardById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `select *
                    from kanban_t_boards b
                    where b.id = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let columns = rows.map((row) => createBoard(row));
                resolve(columns);
            }
        });
    });
}


exports.getColumns = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `select *
                    from kanban_t_columns c
                    where c.id_board = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let columns = rows.map((row) => createColumn(row));
                resolve(columns);
            }
        });
    });
}

exports.createColumn = function (column) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO kanban_t_columns(id_board, description) VALUES(?,?)';
        db.run(sql, [column.id_board, column.description], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(this.lastID);

            }
        });

    });
}

exports.deleteColumn = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM kanban_t_columns WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err)
                reject(err);
            else{
                const sql2 = 'DELETE FROM kanban_t_cards WHERE id_column = ?';
            db.run(sql2, [id], (err) => {
            if (err)
                reject(err);
            else{
                resolve(null);
            }
            })
            }
        })
    });
}


exports.updateColumn = function (id, column) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE kanban_t_columns SET id_board = ?, description = ? where id = ?';
        db.run(sql, [column.id_board, column.description, id], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(null);

            }
        });

    });
}

exports.getCards = function (idBoard, idColumn) {
    return new Promise((resolve, reject) => {
        const sql = `select *
                    from kanban_t_cards c
                    where c.id_board = ? and c.id_column = ?
                    order by c.position`;
        db.all(sql, [idBoard, idColumn], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cards = rows.map((row) => createCard(row));
                resolve(cards);
            }
        });
    });
}

exports.createCard = function (card) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO kanban_t_cards(id_board,title,description,id_column,deadline,archived,position) VALUES(?,?,?,?,?,?,?)';
        db.run(sql, [card.id_board, card.title, card.description, card.id_column, card.deadline, card.archived,card.position], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(this.lastID);

            }
        });

    });
}

exports.deleteCard = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM kanban_t_cards WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err)
                reject(err);
            else{
                
                resolve(null);
    
            }
        })
    });
}


exports.updateCard = function (id, card) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE kanban_t_cards SET id_board = ?,title = ?,description = ?,id_column = ?,deadline = ?,archived = ?,position = ? where id = ?';
        db.run(sql, [card.id_board, card.title, card.description, card.id_column, card.deadline, card.archived,card.position, id], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(null);

            }
        });

    });
}

exports.getLinks = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `select *
                    from kanban_t_links l
                    where l.id_card = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let links = rows.map((row) => new Link(row.id, row.id_card, row.description));
                resolve(links);
            }
        });
    });
}

exports.createLink = function (link) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO kanban_t_links(id_card, description) VALUES(?,?)';
        db.run(sql, [link.id_card, link.description], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(this.lastID);

            }
        });

    });
}

exports.deleteLink = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM kanban_t_links WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        })
    });
}


exports.updateLink = function (id,link) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE kanban_t_links SET id_card = ?, description = ? where id = ?';
        db.run(sql, [link.id_card, link.description, id], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(null);

            }
        });

    });
}

exports.createShared = function (shared) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO kanban_r_shared(id_owner, id_shared,id_board) VALUES(?,?,?)';
        db.run(sql, [shared.id_owner, shared.id_shared, shared.id_board], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(this.lastID);

            }
        });

    });
}

/**
 * Insert a board in the database and returns the id of the inserted board. 
 * To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
 */
exports.createBoard = function (board) {
    return new Promise((resolve, reject) => {
        let board_id;
        const sql = 'INSERT INTO kanban_t_boards(title, owner) VALUES(?,?)';
        db.run(sql, [board.name, board.owner], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                board_id = this.lastID;
                //resolve(this.lastID);
                const sql2 = 'INSERT INTO kanban_t_columns(id_board, description) VALUES(?,?)';
                db.run(sql2, [board_id, "toDo"], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                });
                db.run(sql2, [board_id, "Doing"], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(board_id);
                    }
                });
            }
        });


    });
}


