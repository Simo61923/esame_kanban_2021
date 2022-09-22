import React, { useEffect } from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import API_board from '../api/API-board';
import MyCard from './Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyCardArchived from './CardArchived';



const Column = (props) => {

    let { column, mode, authUser, authErr, addOrEditColumn, deleteColumn, columnsLength, left, right, columnRight, columnLeft, updateColumn, handleErrors ,mycard} = props;
    //same as componentDidMount()

    useEffect(() => {
        API_board.getCards(column.id_board, column.id).then(
            (cards) => {
                setCards(cards);
            }
        ).catch((err) => {
            handleErrors(err);
        });
        
    }, []);

    const [cards, setCards] = useState([{}]);


    const addOrEditCard = (card,col) => {
        if (!card.id) {
            //ADD
            API_board.addCard(card)
                .then(() => {
                    API_board.getCards(column.id_board, column.id).then(
                        (cards) => {
                            setCards(cards);
                        }
                    ).catch((err) => {
                        handleErrors(err);
                    });
                }).catch((err) => {
                    handleErrors(err);
                });
        } else {
            //UPDATE
            API_board.updateCard(card)
                .then(() => {
                    updateColumn(card);
                    API_board.getCards(column.id_board, column.id).then(
                        (cards) => {
                            updateColumn();
                            setCards(cards);
                        }
                    ).catch((err) => {
                        handleErrors(err);
                    });

                }).catch((err) => {

                    handleErrors(err);
                });

        }
        setAddCardForm(false);
    }

    const deleteCard = (card) => {
        API_board.deleteCard(card)
            .then(() => {
                API_board.getCards(column.id_board, column.id).then(
                    (cards) => {
                        setCards(cards);
                    }
                ).catch((err) => {
                    handleErrors(err);
                });
            }).catch((err) => {
                handleErrors(err);
            });
    }



    const [title, setTitle] = useState(column.description);

    const onChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleTitleBlur = () => {
        if (title != null) {
            let col = column;
            col.description = title;
            addOrEditColumn(col);
        }
    }
    const deleteClick = () => {
        deleteColumn(column.id);
    }




    const [isAddCardForm, setAddCardForm] = useState(false);
    const handleClick = () => { setAddCardForm(true) }

    const clickOnCancel = () => {
        setAddCardForm(false);
    }

    const getCard = (i) => {
        if (i === -1 || i === getRealCard(cards).length) {
            return null;
        }
        return cards[i];

    }

    const getRealCard = (cards) => {
        let l = [];
        cards.forEach(el => { if (!el.archived) l.push(el); });
        return l;

    }


    if (mode === 'private' && (!authUser || authErr)) {
        return <Redirect to='login' />
    }
    return (
        <>
            <Col responsive >

                <Row>
                    <InputGroup className="mb-3">
                        <FormControl
                            value={title}
                            placeholder="Title"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(ev) => onChangeTitle(ev)}
                            onBlur={handleTitleBlur} required
                        />
                        <Button key={column.id + "button"} variant="danger" onClick={() => deleteClick()}> X </Button>
                    </InputGroup>

                </Row>
                <ListGroup>
                    {cards &&
                        cards.map(card => (card.archived == 0 &&
                            <>  <ListGroup.Item variant="success">
                                <MyCard key={card.id} card={card} idBoard={column.id_board} idColumn={column.id} mode="private" addOrEditCard={addOrEditCard} deleteCard={deleteCard} left={left} columnRight={columnRight} right={right} columnLeft={columnLeft} columnLength={columnsLength} up={getCard(getRealCard(cards).indexOf(card) - 1)} down={getCard(getRealCard(cards).indexOf(card) + 1)} cardsLenght={getRealCard(cards).length} authUser={authUser} authErr={authErr} handleErrors={handleErrors} />
                            </ListGroup.Item>
                            </>
                        ))}
                    {cards &&
                        cards.map(card => (card.archived == 1 &&
                            <>  <ListGroup.Item variant="dark">
                                <MyCardArchived key={card.id} card={card} mode="private" addOrEditCard={addOrEditCard} authUser={authUser} authErr={authErr} handleErrors={handleErrors} />
                            </ListGroup.Item>
                            </>
                        ))}


                    <ListGroup.Item>  {!isAddCardForm &&
                        <Button key={"buttonsuccess"} variant="success" style={{ width: '18rem' }} onClick={handleClick}>
                            add new Card
            </Button>}
                        {isAddCardForm &&
                            <>
                                <MyCard mode="private" idBoard={column.id_board} idColumn={column.id} addOrEditCard={addOrEditCard} deleteCard={deleteCard} onCancel={clickOnCancel} authUser={authUser} authErr={authErr} cardsLenght={cards.length} />
                            </>
                        }
                    </ListGroup.Item>
                </ListGroup>
            </Col>

        </>
    );
}

export default Column;

/*{links &&
                     links.map(link => (
                      <>
                      <Form.Group controlId = {link.id} >
                      <Form.Label> Link </Form.Label>
                      <Form.Control type="url" name={"link"+link.id} placeholder=" Link " value={link} onChange={(ev) => onChangeLink(ev,link)} />
                    </Form.Group>
                    </>
                    ))}*/