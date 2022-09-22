import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import API_board from '../api/API-board';

const MyVerticallyCenteredModal = (props) => {


    const shareBoard = (id) => {
        let share = { id_owner: props.board[0].owner, id_shared: id, id_board: props.board[0].id }
        API_board.addShared(share).then(
            () => {

                console.log(share);

            }
        ).catch((err) => {
            props.handleErrors(err);
        });

        props.onHide();
    }



    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Select the user to share this Board
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.users && props.users.map(user => (
                    <ButtonGroup vertical>
                        <Button variant="link" onClick={() => shareBoard(user.id)}>{user.name}</Button>
                    </ButtonGroup>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;