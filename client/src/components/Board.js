import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'
import API_board from '../api/API-board';
import API from '../api/API';
import Column from './Column';
import Columns from '../api/Column';
import MyVerticallyCenteredModal from './ModalShare';


class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = { columns: '', isTitle: '',card:'', isAddColumnForm: false, modalShow: false };
    }


    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState({ authUser: user });
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
            this.handleErrors(err);
        });

        API_board.getBoard(this.props.idBoard).then(
            (myBoard) => {
                this.setState({ myBoard: myBoard });
            }
        ).catch((err) => {
            this.handleErrors(err);

        });

        API_board.getColumns(this.props.idBoard).then(
            (columns) => {
                this.setState({ columns: columns });
            }
        ).catch((err) => {
            this.handleErrors(err);

        });
    }



    handleErrors(err) {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err.errorObj });
                if(this.props){
                this.props.history.push("/login");
                }
            }
            else {
                if(this.props){
                this.props.history.push("/error");
                }
            }
        }
    }


    updateColumn = () => {
      
        API_board.getColumns(this.props.idBoard).then(
            (columns) => {
                
                this.setState({ columns: columns });
            }
        ).catch((err) => {
            console.log(err);
        });
    }

    updateRender = (card) => {
        if(card){
        this.setState({ card: card }); 
        }
        else{
            this.setState({ card: '' });
        }
    }

    addOrEditColumn = (column) => {
        if (!column.id) {
            //ADD
            API_board.addColumn(column)
                .then(() => {
                    API_board.getColumns(this.props.idBoard).then(
                        (columns) => {
                            this.setState({ columns: columns });
                        }
                    ).catch((err) => {
                        this.handleErrors(err);
                    });
                }).catch((err) => {
                    this.handleErrors(err);
                });
        } else {
            //UPDATE
            API_board.updateColumn(column)
                .then(() => {
                    API_board.getColumns(this.props.idBoard).then(
                        (columns) => {
                            this.setState({ columns: columns });
                        }
                    ).catch((err) => {
                        this.handleErrors(err);
                    });
                }
                ).catch((err) => {
                    this.handleErrors(err);
                });
        }
    }

    deleteColumn = (column) => {
        API_board.deleteColumn(column)
            .then(() => {
                API_board.getColumns(this.props.idBoard).then(
                    (columns) => {
                        this.setState({ columns: columns });
                    }
                ).catch((err) => {
                    this.handleErrors(err);
                });
            }
            ).catch((err) => {
                this.handleErrors(err);
            });
    }


    handleSubmit = (event) => {
        event.preventDefault();
        /*if (mode === "public") {
          const board = new Board('', isTitle, 1, 0, 0);
          props.addExampleBoard(board);
        }
        else {*/
        const column = new Columns('', this.props.idBoard, this.state.isTitle);
        this.addOrEditColumn(column);
        //}
        this.setState({ isTitle: '', isAddColumnForm: false })
    }
    clickOnCancel = () => {
        this.setState({ isTitle: '', isAddColumnForm: false })
    }

    onChangeTitle = (event) => {
        this.setState({ isTitle: event.target.value });
    };

    handleClick = () => { this.setState({ isAddColumnForm: true }) }

    getColumnsEl = (i) => {
        if (i === -1 || i === this.state.columns.length) {
            return null;
        }
        return this.state.columns[i];

    }

    shareBoard = () => {
        this.setState({ modalShow: true });
        API.getAllUsers(this.state.myBoard[0].owner).then(
            (users) => {
                this.setState({ users: users });
            }
        ).catch((err) => {
            this.handleErrors(err);
        });
    }

    setModalShow = () => {
        this.setState({ modalShow: false });
    }

    render() {
        if (this.state.authErr)
            return <Redirect to='/login' />;
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        <MyVerticallyCenteredModal
                            show={this.state.modalShow}
                            onHide={() => this.setModalShow()}
                            handleErrors={this.handleErrors}
                            users={this.state.users}
                            board={this.state.myBoard}

                        />
                        <Container fluid>
                            <Row style={{ paddingBottom: "1em" }}>
                                {this.state.myBoard && this.state.myBoard.map(board => (<>{this.state.authUser && board.owner === this.state.authUser.id &&
                                    <Button variant="info" onClick={() => this.shareBoard()}>Share Board</Button>}
                                </>
                                ))

                                }
                            </Row>
                            <Row>
                                {this.state.columns &&
                                    this.state.columns.map(column => (
                                        <> <Col key={column.id}>
                                            <Column column={column} mode="private" addOrEditColumn={this.addOrEditColumn} deleteColumn={this.deleteColumn} authUser={this.state.authUser} authErr={this.state.authErr} left={(this.state.columns.indexOf(column)) - 1} columnLeft={this.getColumnsEl(this.state.columns.indexOf(column) - 1)} right={(this.state.columns.indexOf(column)) + 1} columnRight={this.getColumnsEl(this.state.columns.indexOf(column) + 1)} columnsLength={this.state.columns.length} updateColumn={this.updateColumn} handleErrors={this.handleErrors} mycard={this.state.card} />
                                        </Col>
                                        </>
                                    ))}
                                <Col>
                                    {!this.state.isAddColumnForm &&
                                        <Button key={"buttonsuccess"} variant="success" style={{ width: '18rem' }} onClick={this.handleClick}>
                                            add new Column
            </Button>}
                                    {this.state.isAddColumnForm &&
                                        <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
                                            <Form.Group controlId="title">
                                                <Form.Label> Title </Form.Label>
                                                <Form.Control type="text" name="title" placeholder=" Title " value={this.state.isTitle} onChange={(ev) => this.onChangeTitle(ev)} required autoFocus />
                                            </Form.Group>
                                            <Button key={"cancel"} variant="secondary" onClick={this.clickOnCancel}>Cancel</Button>
                                            <Button key={"confirm"} variant="primary" type="submit">Add</Button>
                                        </Form>
                                    }
                                </Col>
                                {context.authErr &&
                                    <Alert variant="danger">
                                        {context.authErr.msg}
                                    </Alert>
                                }
                            </Row>
                        </Container>
                    </>
                )}
            </AuthContext.Consumer>

        );
    }


}

export default Board;