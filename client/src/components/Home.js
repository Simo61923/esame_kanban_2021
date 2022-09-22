import React, { useEffect } from "react";
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Board from '../api/Board'
import { Redirect, Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import slugify from "slugify";
import "../App.css";


const Home = (props) => {

  let { mode, boards, getExampleBoard, sharedBoards, getBoard } = props;
  //same as componentDidMount()
  useEffect(() => {
    if (mode === "public") {
      getExampleBoard();
    }
    else {
      getBoard();
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "public") {
      const board = new Board('', isTitle, 1, 0, 0);
      props.addExampleBoard(board);
    }
    else {
      const board = new Board('', isTitle, props.authUser.id, 0, 0);
      props.addBoard(board);
    }
    setTitle('');
    setAddBoardForm(false);
  }
  const clickOnCancel = () => {
    setTitle('');
    setAddBoardForm(false);
  }
  const [isTitle, setTitle] = useState('');
  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };


  const [isAddBoardForm, setAddBoardForm] = useState(false);
  const handleClick = () => { setAddBoardForm(true) }
  const deleteClick = (id) => {
    if (mode === 'public') {
      props.deleteExampleBoard(id);
    }
    else {
      props.deleteBoard(id);
    }
  }

  if (mode === 'private' && (!props.authUser || props.authErr)) {
    return <Redirect to='login' />
  }
  return (
    <>
      <div className="home">
        <div className="main-content">
          {mode === 'public' &&
            <>
              <h1>Public Boards</h1>
            </>
          }
          {mode === 'private' &&
            <>
              <h1>My Boards</h1>
            </>
          }
          <div className="boards">
            {
              boards && boards.length === 0 &&
              <div> Nessuna Board disponibile
                    </div>
            }
            {boards &&
              boards.map(board => (
                <>
                  <Card key={board.id + 'd'} style={{ width: '18rem' }}>
                    <Link
                      key={board.id + 'b'}
                      to={`/boards/${board.id}/${slugify(board.name, {
                        lower: true
                      })}`}
                    >
                      <Card.Body>
                        <Card.Title>{board.name}</Card.Title>
                        <Card.Text>
                          N.of Cards: {board.nCards}
                        </Card.Text>
                        <Card.Text>
                          N.of Cards Stored: {board.nCardStored}
                        </Card.Text>
                      </Card.Body>
                    </Link>
                    <Button key={board.id + 'bu'} variant="danger" onClick={() => deleteClick(board.id)}> Delete Board </Button>
                  </Card>
                  <div className="mini-board">
                  </div>
                </>
              ))}
            {!isAddBoardForm &&
              <Button key={"buttonsuccess"} variant="success" style={{ width: '18rem' }} onClick={handleClick}>
                add new Board
            </Button>}
            {isAddBoardForm &&
              <Card style={{ width: '18rem' }}>
                <Form method="POST" onSubmit={(event) => handleSubmit(event)}>
                  <Form.Group controlId="title">
                    <Form.Label> Title </Form.Label>
                    <Form.Control type="text" name="title" placeholder=" Title " value={isTitle} onChange={(ev) => onChangeTitle(ev)} required autoFocus />
                  </Form.Group>
                  <Button key={"cancel"} variant="secondary" onClick={clickOnCancel}>Cancel</Button>
                  <Button key={"confirm"} variant="primary" type="submit">Add</Button>
                </Form>
              </Card>
            }
          </div>
          {mode === 'private' && sharedBoards && sharedBoards.length > 0 &&
            <>
              <h1>Boards Shared fom Me</h1>

              <div className="boards">
                {sharedBoards &&
                  sharedBoards.map(sharedBoards => (
                    <>
                      <Card key={sharedBoards.id + "c"} style={{ width: '18rem' }}>
                        <Link
                          key={sharedBoards.id + "s"}
                          to={`/boards/${sharedBoards.id}/${slugify(sharedBoards.name, {
                            lower: true
                          })}`}
                        >
                          <Card.Body>
                            <Card.Title>{sharedBoards.name}</Card.Title>
                            <Card.Text>
                              N.of Cards: {sharedBoards.nCards}
                            </Card.Text>
                            <Card.Text>
                              N.of Cards Stored: {sharedBoards.nCardStored}
                            </Card.Text>
                          </Card.Body>
                        </Link>
                        <Button key={sharedBoards.id + "button"} variant="danger" onClick={() => deleteClick(sharedBoards.id)}> Delete Board </Button>
                      </Card>
                      <div className="mini-board">
                      </div>
                    </>
                  ))}
              </div>
            </>
          }
          {props.authErr &&
            <Alert variant="danger">
              {props.authErr.msg}
            </Alert>
          }
        </div>
      </div>
    </>
  );
}

export default Home;