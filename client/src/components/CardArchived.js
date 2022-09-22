import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form';
import Cards from '../api/Cards'
import * as Icon from 'react-bootstrap-icons';


const MyCardArchived = (props) => {

    let { card, mode, authUser, authErr, addOrEditCard } = props;



    const [titleCard, setTitleCard] = useState(card ? card.title : '');
    const [description, setDescription] = useState(card ? card.description : '');

    const archiveClick = () => {
        const c = new Cards(card.id, card.id_board, card.title, card.description, card.id_column, card.deadline, 0, card.position);
        addOrEditCard(c);
    }





    if (mode === 'private' && (!authUser || authErr)) {
        return <Redirect to='login' />
    }
    return (
        <>

            <Form method="POST" >
                <Form.Group controlId={"title" + (card ? card.id : 0)}>
                    <Form.Control type="text" name="title" placeholder=" Title " value={titleCard} disabled />
                </Form.Group>
                <Form.Group controlId={"description" + (card ? card.id : 0)}>
                    <Form.Control type="text" name="description" placeholder=" Description " value={description} disabled />
                </Form.Group>
                <ButtonGroup className="mr-2" aria-label="Second group">
                    <Button variant="secondary" onClick={archiveClick}><Icon.ArrowUpCircle /></Button>
                </ButtonGroup>

            </Form>


        </>
    );
}

export default MyCardArchived;
