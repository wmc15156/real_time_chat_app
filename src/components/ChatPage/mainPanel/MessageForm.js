import React, { useState, useRef } from 'react';
import {Col, Form, ProgressBar, Row} from "react-bootstrap";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {GrEmoji} from "react-icons/all";
import mime from 'mime-types';

import firebase from '../../../firebase';
import chatRoom from "../../../redux/reducer/chatRoom";
import {useSelector} from "react-redux";



const MessageForm = () => {

    const [text, setText] = useState('');
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const chatRoom = useSelector(state => state.chatRoom);
    const user = useSelector(state => state.user.customerUser);
    const inputOpenImageRef = useRef();
    const firebaseStorageRef = firebase.storage().ref();


    const messageRef = firebase.database().ref('message');

    const handleChange = e => {
        setText(e.target.value)
    }

    const addEmoji = e => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        setText(text + emoji)

    }

    const createMessage = (fileUrl=null) => {
        const message = {
            timeStamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL,
            }
        };

        if(fileUrl) {
            message['image'] = fileUrl;
        } else {
            message['content'] = text;
        }
        return message;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        if(!text) {
            setError(prev => prev.concat('텍스트를 먼저 작성해주세요.'));
        }

        setLoading(true);

        // request database

        try {
            await messageRef.child(chatRoom.currentRoom.id).push().set(
                createMessage()
            )

            setText('');  //reset input field to empty
            setError([]);
            setLoading(false);
        } catch(err) {
            console.error(err);
            setError(prev => prev.concat(err));
            setLoading(false);
        }

    }

    const handleImageClick = () => {
        inputOpenImageRef.current.click();
    }

    const handleImageUpload = (e) => {
        const uploadFile = e.target.files[0];
        if(!uploadFile) return;
        const filePath = `messages/public/${uploadFile.name}`;
        const metaData = { contentType: mime.lookup(uploadFile.name)}

        try {

            let uploadTask = firebaseStorageRef.child(filePath).put(uploadFile);

            uploadTask.on('state_change', uploadTaskSnapShot => {
                console.log(uploadTaskSnapShot.bytesTransferred)
                let percentage = Math.round(
                    (uploadTaskSnapShot.bytesTransferred / uploadTaskSnapShot.totalBytes) * 100
                );
                console.log(percentage);

                setUploadPercentage(percentage);
            });


        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        value={text}
                        onChange={handleChange}
                        as="textarea" rows={3}
                    />
                </Form.Group>
            </Form>
            {!(uploadPercentage === 0 || uploadPercentage === 100) &&
                <ProgressBar variant="warning" label={`${uploadPercentage}%`} now={uploadPercentage} />
            }


            <Row style ={{ marginTop: '20px' }}>
                <Col  style={{ display: "flex", justifyContent: 'center'}}>
                    <button  onClick={handleSubmit} disabled={loading} className="message-form-button" >
                        SEND
                    </button>
                </Col>
                <Col style={{ display: "flex", justifyContent: 'center' }}>
                    <button  disabled={loading} onClick={ handleImageClick } className="message-form-button">
                        Upload
                    </button>

                </Col>

            </Row>

            {/*<span style={{ visibility:"hidden" }} >*/}
            {/*   <Picker onSelect={addEmoji} />*/}
            {/*</span>*/}
            <input
                type="file"
                accept='image/jpeg, image/png'
                style={{ display: 'none' }}
                ref={inputOpenImageRef}
                onChange={handleImageUpload}
            />
            
        </div>
    );
};

export default MessageForm;
