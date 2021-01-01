import React from 'react';
import {Accordion, Card, Col, Container, FormControl, Image, InputGroup, Row,  } from "react-bootstrap";
import Button from 'react-bootstrap/Button'

import {AiOutlineSearch, FaLock, FaLockOpen} from "react-icons/all";
import {useSelector} from "react-redux";

const MessageHeader = ({ onChangeHandler,value }) => {
    const chatRoomName = useSelector(state => state.chatRoom.currentRoom && state.chatRoom.currentRoom.name);
    const privateStatus = useSelector(state => state.chatRoom.privateChatRoom);
    return (
        <div style={{
            width: '100%',
            height: '170px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem',
        }}>
            <Container >
                <Row>
                    <Col>
                        <h2>

                            {privateStatus ? <FaLock /> : <FaLockOpen />}
                            &nbsp; {chatRoomName && chatRoomName}
                        </h2>
                    </Col>
                    <Col>
                        <div>
                            <InputGroup style={{ width: '100%', paddingTop: '8px'}} className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1"><AiOutlineSearch /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Username"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={value}
                                    onChange={onChangeHandler}
                                />
                            </InputGroup>
                        </div>
                    </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <p>
                        <Image src=""/> &nbsp; user name
                    </p>
                </div>

                <Row >
                    <Col>
                        <Accordion >
                            <Card>
                                <Card.Header style={{ padding: '0 1rem '}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>

                    <Col>
                        <Accordion >
                            <Card>
                                <Card.Header style={{ padding: '0 1rem '}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>

                </Row>

            </Container>
        </div>
    );
};

export default MessageHeader;
