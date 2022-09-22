import React, { useEffect } from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form';
import Cards from '../api/Cards'
import moment from 'moment'
import MyLink from './Link'
import * as Icon from 'react-bootstrap-icons';
import API_board from '../api/API-board';

const MyCard = (props) => {

    let { card, idBoard, idColumn, mode, authUser, authErr, addOrEditCard, deleteCard, onCancel, left, right, columnLength, columnRight, columnLeft, up, down, cardsLenght, handleErrors } = props;
    //same as componentDidMount()
    useEffect(() => {
        if (card) {
            API_board.getLinks(card.id).then(
                (links) => {
                    setLinks(links);
                }
            ).catch((err) => {
                handleErrors(err);
            });
        }

    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const card = new Cards('', idBoard, titleCard, description, idColumn, deadline, 0, cardsLenght+Math.random());
        addOrEditCard(card);

        setTitleCard('');
        setDescription('');
        setDeadline('');

    }


    const [titleCard, setTitleCard] = useState(card ? card.title : '');
    const [description, setDescription] = useState(card ? card.description : '');
    const [deadline, setDeadline] = useState(card ? moment(new Date(card.deadline)).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD'));


    const [links, setLinks] = useState(['']);

    const onChangeTitleCard = (event) => {
        setTitleCard(event.target.value);
    };
    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    };

    const onChangeDeadline = (event) => {
        setDeadline(event.target.value);
    };


    const handleBlur = () => {
        if (card != null && titleCard && description) {
            const c = new Cards(card.id, idBoard, titleCard, description, idColumn, deadline, card.archived,card.position);
            addOrEditCard(c);
        }
    }

    const clickOnCancel = () => {
        setTitleCard('');
        setDescription('');
        setDeadline('');
        onCancel();
    }

    const deleteClick = () => {
        deleteCard(card.id);
    }
    const moveLeftClick = () => {
        const c = new Cards(card.id, idBoard, titleCard, description, columnLeft.id, deadline, 0, card.position);
        addOrEditCard(c,columnLeft);
    }
    const moveRightClick = () => {
        const c = new Cards(card.id, idBoard, titleCard, description, columnRight.id, deadline, 0, card.position);
        addOrEditCard(c,columnRight);
    }
    const moveUpClick = () => {
        const c = new Cards(card.id, idBoard, titleCard, description, idColumn, deadline, 0, up.position);
        addOrEditCard(c);
        const c2 = new Cards(up.id, up.id_board, up.title, up.description, up.id_column, up.deadline, 0, card.position);
        addOrEditCard(c2);
    }
    const moveDownClick = () => {
        const c = new Cards(card.id, idBoard, titleCard, description, idColumn, deadline, 0, down.position);
        addOrEditCard(c);
        const c2 = new Cards(down.id, down.id_board, down.title, down.description, down.id_column, down.deadline, 0, card.position);
        addOrEditCard(c2);
    }
    const archiveClick = () => {
        const c = new Cards(card.id, idBoard, titleCard, description, idColumn, deadline, 1, card.position);
        addOrEditCard(c);
    }

    const addOrEditLink = (link) => {
        if (!link.id) {
            //ADD
            API_board.addLink(link)
                .then(() => {
                    API_board.getLinks(card.id).then(
                        (links) => {
                            setLinks(links);
                        }
                    ).catch((err) => {
                        handleErrors(err);
                    });
                }).catch((err) => {
                    handleErrors(err);
                });
        } else {
            //UPDATE
            API_board.updateLink(link)
                .then(() => {
                    API_board.getLinks(card.id).then(
                        (links) => {
                            setLinks(links);
                        }
                    ).catch((err) => {
                        handleErrors(err);
                    });

                }).catch((err) => {

                    handleErrors(err);
                });

        }
    }

    const deleteLink = (link) => {
        API_board.deleteLink(link)
            .then(() => {
                API_board.getLinks(card.id).then(
                    (links) => {
                        setLinks(links);
                    }
                ).catch((err) => {
                    handleErrors(err);
                });
            }).catch((err) => {
                handleErrors(err);
            });
    }

    if (mode === 'private' && (!authUser || authErr)) {
        return <Redirect to='login' />
    }
    return (
        <>

            <Form method="POST" onSubmit={(event) => handleSubmit(event)}>
                <Form.Group controlId={"title" + (card ? card.id : 0)}>
                    <Form.Control type="text" name="title" placeholder=" Title " value={titleCard} onChange={(ev) => onChangeTitleCard(ev)} onBlur={handleBlur} required />
                </Form.Group>
                <Form.Group controlId={"description" + (card ? card.id : 0)}>
                    <Form.Control type="text" name="description" placeholder=" Description " value={description} onChange={(ev) => onChangeDescription(ev)} onBlur={handleBlur} required />
                </Form.Group>
                <Form.Group controlId={"deadline" + (card ? card.id : 0)}>
                    <Form.Control type="date" name="deadline" placeholder=" Deadline " value={deadline} onChange={(ev) => onChangeDeadline(ev)} onBlur={handleBlur} />
                </Form.Group>
                {links && card &&
                    links.map(link => (
                        <MyLink key={link.id} link={link} idCard={card.id} mode="private" addOrEditLink={addOrEditLink} deleteLink={deleteLink} authUser={authUser} authErr={authErr} />
                    ))}
                {card &&
                    <MyLink idCard={card.id} mode="private" addOrEditLink={addOrEditLink} deleteLink={deleteLink} authUser={authUser} authErr={authErr} />
                }

                {!card && <>
                    <Button key={"cancel"} variant="secondary" onClick={clickOnCancel}>Cancel</Button>
                    <Button key={"confirm"} variant="primary" type="submit">Add</Button>
                </>}
                {card && <>
                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="mr-2" aria-label="First group">
                            <Button variant="primary" onClick={moveUpClick} disabled={!up}> <Icon.CaretUpSquare /> </Button>
                            <Button variant="primary" onClick={moveRightClick} disabled={right === columnLength}> <Icon.CaretRightSquare /> </Button>
                            <Button variant="primary" onClick={moveDownClick} disabled={!down}> <Icon.CaretDownSquare /> </Button>
                            <Button variant="primary" onClick={moveLeftClick} disabled={left === -1}> <Icon.CaretLeftSquare /> </Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2" aria-label="Second group">
                            <Button variant="danger" onClick={deleteClick}><Icon.X /> </Button>
                            <Button variant="secondary" onClick={archiveClick}><Icon.Archive /></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </>}
            </Form>


        </>
    );
}

export default MyCard;
/*
{links &&
    links.map(link => (
     <>
     <Form.Group controlId = {link.id} >
     <Form.Label> Link </Form.Label>
     <Form.Control type="link" name={"link"+link.id} placeholder=" Link " value={link} onChange={(ev) => onChangeLink(ev,link)} />
   </Form.Group>
   </>
   ))}*/