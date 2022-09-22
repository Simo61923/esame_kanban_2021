import Board from "./Board"
import Column from "./Column"
import Cards from "./Cards"
import Link from "./Link"
const baseURL = "/api";


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

let myColumns = [];

async function getBoard(idBoard) {
    let url = "/boardById";
    const queryParams = "?idBoard=" + idBoard;
    url += queryParams;
    const response = await fetch(baseURL + url);
    const boardJson = await response.json();
    if (response.ok) {

        return boardJson.map((b) => new Board(b.id, b.name, b.owner, 0, 0));;
    } else {
        let err = { status: response.status, errObj: boardJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getColumns(idBoard) {
    let url = "/columns";
    const queryParams = "?idBoard=" + idBoard;
    url += queryParams;
    const response = await fetch(baseURL + url);
    const columnsJson = await response.json();
    if (response.ok) {
        myColumns = columnsJson.map((b) => new Column(b.id, b.id_board, b.description));
        return myColumns;
    } else {
        let err = { status: response.status, errObj: columnsJson };
        throw err;  // An object with the error coming from the server
    }
}
async function addColumn(column) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/columns", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(column),
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

async function updateColumn(column) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/column/" + column.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(column),
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

async function deleteColumn(columnId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/column/" + columnId, {
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

async function getCards(idBoard, idColumn) {
    let url = "/cards";
    const queryParams = "?idBoard=" + idBoard + "&idColumn=" + idColumn;
    url += queryParams;
    const response = await fetch(baseURL + url);
    const cardsJson = await response.json();
    if (response.ok) {
        return cardsJson.map((b) => new Cards(b.id, b.id_board, b.title, b.description, b.id_column, b.deadline, b.archived, b.position));
    } else {
        let err = { status: response.status, errObj: cardsJson };
        throw err;  // An object with the error coming from the server
    }
}
async function addCard(card) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(card),
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

async function updateCard(card) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/card/" + card.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(card),
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

async function deleteCard(cardId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/card/" + cardId, {
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

async function getLinks(idCard) {
    let url = "/links";
    const queryParams = "?idCard=" + idCard;
    url += queryParams;
    const response = await fetch(baseURL + url);
    const linksJson = await response.json();
    if (response.ok) {
        return linksJson.map((b) => new Link(b.id, b.id_card, b.description));
    } else {
        let err = { status: response.status, errObj: linksJson };
        throw err;  // An object with the error coming from the server
    }
}
async function addLink(link) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/links", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(link),
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

async function updateLink(link) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/link/" + link.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(link),
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

async function deleteLink(linkId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/link/" + linkId, {
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

async function addShared(shared) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/shareBoard", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shared),
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



//const API_board = {getColumns, getBoards, getExamlpeBoard, addExampleBoard, addBoard, deleteBoard, getExamlpeCard, deleteExampleBoard };
const API_board = { getBoard, getColumns, updateColumn, addColumn, deleteColumn, getCards, updateCard, addCard, deleteCard, getLinks, updateLink, addLink, deleteLink, addShared }
export default API_board;
