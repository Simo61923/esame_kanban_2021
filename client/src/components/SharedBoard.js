import React, { useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Redirect, Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import slugify from "slugify";
import "../App.css";


const SharedBoard = (props) => {

  let { mode, boards, getExampleBoard, sharedBoards, getBoard } = props;
  //same as componentDidMount()
  useEffect(() => {
    
    getBoard();
  
  }, []);





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
              <h1>Boards shared by me</h1>
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
          </div>
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

export default SharedBoard;