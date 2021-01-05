import React, { useState, useRef } from "react";
import { Col, Form, ProgressBar, Row } from "react-bootstrap";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { GrEmoji } from "react-icons/all";
import mime from "mime-types";

import firebase from "../../../firebase";
import { useSelector } from "react-redux";

const MessageForm = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const chatRoom = useSelector((state) => state.chatRoom);
  const user = useSelector((state) => state.user.customerUser);
  const privateChatRoomState = useSelector(
    (state) => state.chatRoom && state.chatRoom.privateChatRoom
  );
  const inputOpenImageRef = useRef();
  const firebaseStorageRef = firebase.storage().ref();
  const typingRef = firebase.database().ref("typing");
  const messageRef = firebase.database().ref("message");

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      typingRef
        .child(chatRoom.currentRoom.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef.child(chatRoom.currentRoom.id).child(user.uid).remove();
    }
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl) {
      message["image"] = fileUrl;
    } else {
      message["content"] = text;
    }
    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setError((prev) => prev.concat("텍스트를 먼저 작성해주세요."));
    }

    setLoading(true);

    // request database

    try {
      await messageRef
        .child(chatRoom.currentRoom.id)
        .push()
        .set(createMessage());

      // typingRef.child(chatRoom.id).child(user.uid).remove();

      setText(""); //reset input field to empty
      setError([]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError((prev) => prev.concat(err));
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    inputOpenImageRef.current.click();
  };

  const getFilePath = () => {
    if (privateChatRoomState) {
      return `messages/private/${chatRoom.currentRoom.id}`;
    }
    return `messages/public`;
  };

  const handleImageUpload = (e) => {
    const uploadFile = e.target.files[0];
    if (!uploadFile) return;
    const filePath = `${getFilePath()}/${uploadFile.name}`;
    const metaData = { contentType: mime.lookup(uploadFile.name) };
    setLoading(true);
    try {
      let uploadTask = firebaseStorageRef.child(filePath).put(uploadFile);

      uploadTask.on(
        "state_change",
        (uploadTaskSnapShot) => {
          let percentage = Math.round(
            (uploadTaskSnapShot.bytesTransferred /
              uploadTaskSnapShot.totalBytes) *
              100
          );
          setUploadPercentage(percentage);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        },
        () => {
          // storage에 저장 된 후 저장된 url get
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(chatRoom.currentRoom.id, "test");
            messageRef
              .child(chatRoom.currentRoom.id)
              .push()
              .set(createMessage(downloadURL));
            setLoading(false);
          });
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSubmit(e);
    }
    // console.log(text);
    // if (text) {
    //   typingRef
    //     .child(chatRoom.currentRoom.id)
    //     .child(user.uid)
    //     .set(user.displayName);
    // } else if (text.length < 3) {
    //   console.log("herererererererer");
    //   console.log(";remove", text, 123);
    //   typingRef.child(chatRoom.currentRoom.id).child(user.uid).remove();
    // }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            onKeyDown={handleOnKeyDown}
            value={text}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>
      {!(uploadPercentage === 0 || uploadPercentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${uploadPercentage}%`}
          now={uploadPercentage}
        />
      )}

      <Row style={{ marginTop: "20px" }}>
        <Col style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="message-form-button"
          >
            SEND
          </button>
        </Col>
        <Col style={{ display: "flex", justifyContent: "center" }}>
          <button
            disabled={loading}
            onClick={handleImageClick}
            className="message-form-button"
          >
            Upload
          </button>
        </Col>
      </Row>

      {/*<span style={{ visibility:"hidden" }} >*/}
      {/*   <Picker onSelect={addEmoji} />*/}
      {/*</span>*/}
      <input
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default MessageForm;
