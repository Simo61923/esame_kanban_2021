import Board from './Board';
const baseURL = "/api";

let boards = [
    {
        'id': 'x0',
        'name': 'Summer',
        'owner': 1,
        'nCards': 5,
        'nCardStored': 2

    },
    {
        'id': 'x1',
        'name': 'ToDo',
        'owner': 1,
        'nCards': 7,
        'nCardStored': 1
    },
];

let cards = [
    {
        'id': 1,
        'id_board': 'xx',
        'title': 'Plannig',
        'description': 'how planning',
        'links': ["link1", "link2"],
        'deadline': "2020-10-01",
        'column': "column1",
        'id_column': 1

    },
    {
        'id': 2,
        'id_board': 'xx',
        'title': 'Plannig2',
        'description': 'how planning2',
        'links': ["link1", "link2"],
        'deadline': "",
        'column': "column1",
        'id_column': 1
    },
    {
        'id': 3,
        'id_board': 'xx',
        'title': 'Plannig3',
        'description': 'how planning3',
        'links': ["link1", "link2"],
        'deadline': "2020-10-01",
        'column': "column2",
        'id_column': 2
    },
];
let myBoards = [];
let mySharedBoards = [];

async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getBoards() {
    let url = "/board";
    const response = await fetch(baseURL + url);
    const boardsJson = await response.json();
    if (response.ok) {
        myBoards = boardsJson.map((b) => new Board(b.id, b.name, b.owner, b.nCards, b.nCardStored));
        return myBoards;
    } else {
        let err = { status: response.status, errObj: boardsJson };
        console.log(err);
        throw err;  // An object with the error coming from the server
    }
}

async function getsharedBoard() {
    let url = "/sharedBoard";
    const response = await fetch(baseURL + url);
    const boardsJson = await response.json();
    if (response.ok) {
        mySharedBoards = boardsJson.map((b) => new Board(b.id, b.name, b.owner, b.nCards, b.nCardStored));
        return mySharedBoards;
    } else {
        let err = { status: response.status, errObj: boardsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getsharedByUserBoard() {
    let url = "/sharedByUserBoard";
    const response = await fetch(baseURL + url);
    const boardsJson = await response.json();
    if (response.ok) {
        return boardsJson.map((b) => new Board(b.id, b.name, b.owner, b.nCards, b.nCardStored));
    } else {
        let err = { status: response.status, errObj: boardsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getExamlpeBoard() {

    return boards;
}

async function addExampleBoard(board) {
    return new Promise((resolve, reject) => {
        const oldid = boards[boards.length - 1].id;
        const arrayid = [...oldid];
        const id = 'x' + (+arrayid[arrayid.length - 1] + 1);
        board.id = id;
        boards.push(board);
    });
}
async function deleteExampleBoard(id) {
    return new Promise((resolve, reject) => {
        boards.splice(boards.findIndex(el => el.id === id), 1);
        resolve(null);
    });
}


async function getExamlpeCard(idBoard) {

    return cards.filter(card => {
        return card.id_board === idBoard;
    });
}

async function addBoard(board) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/boards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(board),
        }).then((response) => {
            if (response.ok) {
                resolve(response.json().then(el => { return el }));
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteBoard(boardId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/boards/" + boardId, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

async function getAllUsers(idOwner) {
    let url = "/getAllUser";
    const queryParams = "?idOwner=" + idOwner;
    url += queryParams;
    const response = await fetch(baseURL + url);
    const usersJson = await response.json();
    if (response.ok) {
        let users = usersJson.map((b) => new User(b.id, b.name, b.username));
        return users;
    } else {
        let err = { status: response.status, errObj: usersJson };
        throw err;  // An object with the error coming from the server
    }
}

const API = { isAuthenticated, getBoards, getsharedBoard, getsharedByUserBoard, getExamlpeBoard, addExampleBoard, addBoard, deleteBoard, getExamlpeCard, deleteExampleBoard, userLogin, userLogout, getAllUsers };
export default API;

class User {

    constructor(id, name, username) {

        this.id = id;
        this.name = name;
        this.username = username;

    }


}
