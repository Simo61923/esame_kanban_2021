import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthContext } from '../auth/AuthContext'
import { NavLink } from 'react-router-dom';

const Header = (props) => {

  return (
    <AuthContext.Consumer>
      {(context) => (

        <Navbar bg="success" variant="dark" expand="sm" fixed="top">
          <Navbar.Toggle aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar" onClick={props.showSidebar} />

          <Navbar.Brand href="index.html">
            <svg className="bi bi-check-all" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z" clipRule="evenodd" />
              <path d="M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z" />
            </svg>
          KanBan
        </Navbar.Brand>

          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/boards" onClick={() => props.getBoard()}>My Board</Nav.Link>
            <Nav.Link as={NavLink} to="/sharedBoardsByMe" onClick={() => props.getSharedByUserBoard()}>My Board Shared</Nav.Link>
            <Nav.Link as={NavLink} to="/public" onClick={() => props.getExampleBoard()}> Public Board</Nav.Link>
          </Nav>

          <Nav className="ml-md-auto">
            {context.authUser &&
              <>
                <Navbar.Brand>Welcome {context.authUser.name}!</Navbar.Brand>
                <Nav.Link onClick={() => { context.logoutUser() }}>Logout</Nav.Link>
              </>}
            {!context.authUser && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
            <Nav.Link href="#">
              <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
                <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
              </svg>
            </Nav.Link>
          </Nav>
        </Navbar>
      )}
    </AuthContext.Consumer>

  );
}

export default Header;
