'use strict';

//import express
const express = require('express');
const boardDao = require('./board_dao');
const userDao = require('./user_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 1000; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

const PORT = 3001;

const app =  express();

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());



// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
      .then((user) => {
        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid username' }] 
              });
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({id: user.id, name: user.name, username : user.username});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});


// For the rest of the code, all APIs require authentication
app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );
  
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
  });

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name, username : user.username});
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
});

//GET /board
app.get('/api/board', (req, res) => {
    const user = req.user && req.user.user;
    boardDao.getBoards(user)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});



//GET /sharedBoardboard
app.get('/api/sharedBoard', (req, res) => {
    const user = req.user && req.user.user;
    boardDao.getSharedBoards(user)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});

//GET /sharedBoardboard
app.get('/api/sharedByUserBoard', (req, res) => {
    const user = req.user && req.user.user;
    boardDao.getSharedBoardsByUser(user)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});



//POST /boards
app.post('/api/boards', (req,res) => {
    const board = req.body;
    if(!board){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        board.owner = user;
        boardDao.createBoard(board)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

//DELETE /boards/<boardId>
app.delete('/api/boards/:boardId', (req,res) => {
    boardDao.deleteBoard(req.params.boardId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

app.get('/api/boardById', (req, res) => {
    boardDao.getBoardById(req.query.idBoard)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});

//GET /columns
app.get('/api/columns', (req, res) => {
    boardDao.getColumns(req.query.idBoard)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});

//POST /columns
app.post('/api/columns', (req,res) => {
    const columns = req.body;
    if(!columns){
        res.status(400).end();
    } else {
        boardDao.createColumn(columns)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

//PUT /column/:ColumnId'
app.put('/api/column/:ColumnId', (req,res) => {
    if(!req.body.id){
        res.status(400).end();
    } else {
        const column = req.body;
        boardDao.updateColumn(req.params.ColumnId,column)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

app.delete('/api/column/:columnId', (req,res) => {
    boardDao.deleteColumn(req.params.columnId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

app.get('/api/cards', (req, res) => {
    boardDao.getCards(req.query.idBoard,req.query.idColumn)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});


app.post('/api/cards', (req,res) => {
    const cards = req.body;
    if(!cards){
        res.status(400).end();
    } else {
        boardDao.createCard(cards)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

app.put('/api/card/:CardId', (req,res) => {
    if(!req.body.id){
        res.status(400).end();
    } else {
        const card = req.body;
        boardDao.updateCard(req.params.CardId,card)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

app.delete('/api/card/:cardId', (req,res) => {
    boardDao.deleteCard(req.params.cardId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

app.get('/api/links', (req, res) => {
    boardDao.getLinks(req.query.idCard)
        .then((course) => {
            if(!course){
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});


app.post('/api/links', (req,res) => {
    const links = req.body;
    if(!links){
        res.status(400).end();
    } else {
        boardDao.createLink(links)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

app.put('/api/link/:LinkId', (req,res) => {
    if(!req.body.id){
        res.status(400).end();
    } else {
        const link = req.body;
        boardDao.updateLink(req.params.LinkId,link)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

app.delete('/api/link/:linkId', (req,res) => {
    boardDao.deleteLink(req.params.linkId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});


app.post('/api/shareBoard', (req,res) => {
    const shared = req.body;
    if(!shared){
        res.status(400).end();
    } else {
        boardDao.createShared(shared)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});


app.get('/api/getAllUser', (req, res) => {
    userDao.getAllUser(req.query.idOwner)
        .then((users) => {
            if(!users){
                res.status(404).send();
            } else {
                
                res.json(users.map((user)=>{return {id: user.id, name: user.name, username : user.username}}));
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));