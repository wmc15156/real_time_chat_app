import React from 'react';
import {Accordion, Card, Col, Container, FormControl, Image, InputGroup, Row,  } from "react-bootstrap";
import Button from 'react-bootstrap/Button'

import {AiOutlineSearch, FaLock} from "react-icons/all";

const MessageHeader = () => {
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
                    <Col><h2><FaLock />ChatRoomName</h2></Col>
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
