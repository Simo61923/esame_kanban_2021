import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Links from '../api/Link'


const MyLink = (props) => {

    let { link, idCard, mode, authUser, authErr, addOrEditLink, deleteLink } = props;




    const [mylink, setmyLink] = useState(link ? link.description : '');

    const onChangeLink = (event) => {
        setmyLink(event.target.value);
    };


    const handleBlur = () => {
        if (mylink != null && mylink !== '') {
            if (isValidUrl(mylink)) {
                const l = new Links((link ? link.id : ''), idCard, mylink);
                addOrEditLink(l);
                setmyLink('');
            }
        }
        if (link && mylink === '') {
            deleteLink(link.id);
        }
    }

    const isValidUrl = (string) => {
        try {
            string = ("http://" + string);
            new URL(string);
        } catch (_) {
            setmyLink("Link not valid");
            return false;
        }

        return true;
    }


    if (mode === 'private' && (!authUser || authErr)) {
        return <Redirect to='login' />
    }
    return (
        <>
            <Form.Group controlId="link" >
                <Form.Control type="link" name="link" placeholder=" Link " value={mylink} onChange={(ev) => onChangeLink(ev, link)} onBlur={handleBlur} />
            </Form.Group>

        </>
    );
}

export default MyLink;
/*
{links &&
    links.map(link => (
     <>

   </>
   ))}*/