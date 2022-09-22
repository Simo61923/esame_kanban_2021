import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import API from './api/API';
import {Redirect, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import {AuthContext} from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import  Home  from './components/Home';
import Board from './components/Board'
import SharedBoard from './components/SharedBoard';
import ErrorPage from './components/Error';


class App extends React.Component {
  
  constructor(props)  {
    super(props);
    this.state = {boards: [], openMobileMenu: false};
  }

  componentDidMount() {
    //check if the user is authenticated
    API.isAuthenticated().then(
      (user) => {
        this.setState({authUser: user});
        this.props.history.push("/boards");
      }
    ).catch((err) => { 
      this.setState({authErr: err.errorObj});
      this.props.history.push("/login");
    });
  }

  handleErrors(err) {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authErr: err.errorObj});
          this.props.history.push("/login");
        }
        else{
          this.props.history.push("/error");
        }
    }
}

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.props.history.push("/public");
      this.setState({authUser: null,authErr: null, boards: null});
      API.getExamlpeBoard().then((boards) => this.setState({boards: boards})).catch((errorObj)=>{this.handleErrors(errorObj)});
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => { 
        this.setState({authUser: user, authErr: null});
        API.getBoards()
        .then((boards) => {
          this.setState({boards: boards});
          this.props.history.push("/boards");
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });

        API.getsharedBoard()
        .then((sharedBoards) => {
          this.setState({sharedBoards: sharedBoards});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
        API.getsharedByUserBoard()
        .then((sharedByUserBoard) => {
          this.setState({sharedByUserBoard: sharedByUserBoard});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
      
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({authErr: err0});
      }
    );
  }
/*
  getProjects(tasks) {
    return [...new Set(tasks.map((task) => {
      if(task.project)
        return task.project;
      else
        return null;
    }))];
  }*/

  showSidebar = () => {
    this.setState((state) => ({openMobileMenu: !state.openMobileMenu}));
  }

  getBoard = () => {
    this.setState({boards: []});
      API.getBoards()
        .then((boards) => {
          this.setState({boards: boards});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });

        API.getsharedBoard()
        .then((sharedBoards) => {
          this.setState({sharedBoards: sharedBoards});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
  }

  getSharedByUserBoard = ()=>{
    API.getsharedByUserBoard()
    .then((sharedByUserBoard) => {
      this.setState({sharedByUserBoard: sharedByUserBoard});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
  
  }

  getExampleBoard = () => {
    API.getExamlpeBoard()
      .then((boards) => this.setState({boards: boards}))
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }


  addBoard = (board) => {
      API.addBoard(board)
        .then((id) => {
          API.getBoards()
          .then((boards) => {
            this.setState({boards: boards});
            this.props.history.push("/boards");
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
  
          API.getsharedBoard()
          .then((sharedBoards) => {
            this.setState({sharedBoards: sharedBoards});
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        }); 
  }


  deleteBoard = (board) => {
    API.deleteBoard(board)
      .then(() => {
        API.getBoards()
        .then((boards) => {
          this.setState({boards: boards});
          this.props.history.push("/boards");
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });

        API.getsharedBoard()
        .then((sharedBoards) => {
          this.setState({sharedBoards: sharedBoards});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
      })
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }
  
  addExampleBoard = (board) => {
    API.addExampleBoard(board).then(()=>{
      API.getExamlpeBoard()
      .then((boards) => this.setState({boards: boards})).catch((errorObj) => {
        this.handleErrors(errorObj);
      });
    });
  }

  deleteExampleBoard = (id) =>{
    API.deleteExampleBoard(id).then(()=>{
      API.getExamlpeBoard()
      .then((boards) => this.setState({boards: boards})).catch((errorObj) => {
        this.handleErrors(errorObj);
      });
    });
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return(
      <AuthContext.Provider value={value}>
        
        <Header showSidebar={this.showSidebar} getExampleBoard = {this.getExampleBoard} getBoard = {this.getBoard} getSharedByUserBoard = {this.getSharedByUserBoard}/>

        <Container fluid>

          <Switch>
            <Route path='/login'>
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav"> 
                  <LoginForm/>
                </Col>
              </Row>
            </Route>

            <Route path='/public'>
              <Row className="vheight-100">
                <Col className="below-nav "> 
                  <h5 className = "titleBoard"><strong>Boards</strong></h5>
                  <Home key={"public"} boards = {this.state.boards} mode = "public" getExampleBoard = {this.getExampleBoard} addExampleBoard = {this.addExampleBoard} deleteExampleBoard = {this.deleteExampleBoard}/>
                </Col>
              </Row>
            </Route>

            

            <Route path='/boards/:id/:name' render={({match}) => {
                      return <Row className="vheight-100">
                      <Col className="below-nav"> 
                        <h5 className = "titleBoard"><strong>{match.params.name}</strong></h5>
                        <Board idBoard = {match.params.id} mode = "private" history = {this.props.history} />
                      </Col>
                    </Row>
                  }}/>

              <Route path='/boards'>
              <Row className="vheight-100">
                <Col className="below-nav"> 
                  <h5 className = "titleBoard"><strong>Boards</strong></h5>
                  <Home key={"private"} boards = {this.state.boards}  sharedBoards = {this.state.sharedBoards} mode = "private" authUser = {this.state.authUser} authErr = {this.state.authErr} getBoard = {this.getBoard} addBoard = {this.addBoard} deleteBoard = {this.deleteBoard}/>
                </Col>
              </Row>
            </Route>
              

              <Route path='/sharedBoardsByMe'>
              <Row className="vheight-100">
                <Col className="below-nav"> 
                  <h5 className = "titleBoard"><strong>Boards </strong></h5>
                  <SharedBoard key={"privateShared"} boards = {this.state.sharedByUserBoard}   mode = "private" authUser = {this.state.authUser} authErr = {this.state.authErr} getBoard = {this.getSharedByUserBoard} deleteBoard = {this.deleteBoard}/>
                </Col>
              </Row>
            </Route>
          
            <Route path='/error'>
            <Row className="vheight-100">
                <Col className="below-nav"> 
              <ErrorPage/>
              </Col>
              </Row>
            </Route>


            <Route>
              <Redirect to='/boards' />
            </Route>

          </Switch>            

          
        </Container>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
