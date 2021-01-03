import React, { useEffect, useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  FormControl,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";

import {
  AiOutlineSearch,
  FaLock,
  FaLockOpen,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/all";
import { useSelector } from "react-redux";

import firebase from "../../../firebase";

const MessageHeader = ({ onChangeHandler, value }) => {
  const chatRoomName = useSelector(
    (state) => state.chatRoom.currentRoom && state.chatRoom.currentRoom.name
  );

  const chatRoom = useSelector((state) => state.chatRoom.currentRoom);

  const userRef = firebase.database().ref("users");
  const user = useSelector((state) => state.user.customerUser);
  const privateStatus = useSelector((state) => state.chatRoom.privateChatRoom);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  const addFavoriteListener = (chatRoomId, userId) => {
    userRef
      .child(userId)
      .child("favorite")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const chatRoomsId = Object.keys(data.val());
          console.log(chatRoomId, "chatRoomId");
          const isAlreadyFavorite = chatRoomsId.includes(chatRoomId);
          console.log(isAlreadyFavorite, "isFavor");
          setIsFavorite(isAlreadyFavorite);
        }
      });
  };

  const handleFavorite = () => {
    if (isFavorite) {
      userRef
        .child(`${user.uid}/favorite`)
        .child(chatRoom.id)
        .remove((err) => {
          if (err) {
            console.err(err);
          }
        });
      setIsFavorite((prev) => !prev);
    } else {
      userRef.child(`${user.uid}/favorite`).update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
      setIsFavorite((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        border: ".2rem solid #ececec",
        borderRadius: "4px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              {privateStatus ? <FaLock /> : <FaLockOpen />}
              &nbsp; {chatRoomName && chatRoomName}
              {!privateStatus && (
                <span style={{ cursor: "pointer" }} onClick={handleFavorite}>
                  {isFavorite ? (
                    <MdFavorite style={{ borderBottom: "10px" }} />
                  ) : (
                    <MdFavoriteBorder style={{ borderBottom: "10px" }} />
                  )}
                </span>
              )}
            </h2>
          </Col>
          <Col>
            <div>
              <InputGroup
                style={{ width: "100%", paddingTop: "8px" }}
                className="mb-3"
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">
                    <AiOutlineSearch />
                  </InputGroup.Text>
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p>
            <Image src="" /> &nbsp; user name
          </p>
        </div>

        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem " }}>
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
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem " }}>
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
