import React, { Component } from "react";
import { FaRegSmile, FaPlus } from "react-icons/fa";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import styled from "styled-components";

import firebase from "../../../firebase";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

const StyledBadge = styled(Badge)`
  margin-left: 10px;
`;

class ChatRoom extends Component {
  state = {
    show: false,
    name: "",
    desc: "",
    chatRoomsRef: firebase.database().ref("chatRooms"),
    messagesRef: firebase.database().ref("message"),
    chatRooms: [],
    firstChatRoom: "", // 새로고침시 선택될 chatting방
    firstLoad: true,
    activeChatRoomId: "",
    notifications: [],
  };

  componentDidMount() {
    this.addChatRoomsListener();
  }

  componentWillUnmount() {
    this.state.chatRoomsRef.off();
    this.state.chatRooms.forEach((chatRoom) => {
      this.state.messagesRef.child(chatRoom.id).off();
    });
  }

  handleNotification = (
    chatRoomId,
    currentChatRoomId,
    notifications,
    DataSnapshot
  ) => {
    let index = notifications.findIndex((notification) => {
      return notification.id === chatRoomId;
    });
    let lastTotal = 0;

    if (index === -1) {
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.numChildren(),
        lastKnownTotal: DataSnapshot.numChildren(),
        count: 0,
      });
    } else {
      //
      if (chatRoomId !== currentChatRoomId) {
        lastTotal = notifications[index].lastKnownTotal;

        if (DataSnapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      }

      notifications[index].total = DataSnapshot.numChildren();
    }

    this.setState({ notifications });
  };

  addNotificationListener = (chatRoomId) => {
    this.state.messagesRef.child(chatRoomId).on("value", (DataSnapshot) => {
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId,
          this.props.chatRoom.id,
          this.state.notifications,
          DataSnapshot
        );
      }
    });
  };

  addChatRoomsListener = () => {
    let chatRoomLists = [];
    this.state.chatRoomsRef.on("child_added", (data) => {
      // 항목 목록을 검색하거나 항목 목록에 대한 추가를 수신 대기합니다.
      chatRoomLists.push(data.val());

      this.setState(
        {
          chatRooms: chatRoomLists,
        },
        () => {
          if (this.state.firstLoad && this.state.chatRooms.length) {
            this.props.dispatch(setCurrentChatRoom(this.state.chatRooms[0]));
            this.setState({ activeChatRoomId: this.state.chatRooms[0].id });
          }
          this.setState({
            firstLoad: false,
          });
          this.addNotificationListener(data.key);
        }
      );
    });
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleDescChange = (e) => {
    this.setState({
      desc: e.target.value,
    });
  };

  onSubmit = (e) => {
    const { name, desc } = this.state;
    e.preventDefault();
    if (this.isFormValid(name, desc)) {
      this.addChatRoom();
    }
  };

  isFormValid = (name, desc) => {
    return !!(name && desc);
  };

  addChatRoom = async () => {
    const key = this.state.chatRoomsRef.push().key; // auto ID(유니크키) 데이터베이스 값을 넣을떄마 키값을 만든다음 가져옴
    const { name, desc } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: desc,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await this.state.chatRoomsRef.child(key).update(newChatRoom);
      this.setState({
        name: "",
        desc: "",
        show: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  setCurrentChatRoom = (room) => {
    this.props.dispatch(setPrivateChatRoom(false));
    this.props.dispatch(setCurrentChatRoom(room));
    this.setState({ activeChatRoomId: room.id }, () => {
      this.clearNotification();
    });
  };

  clearNotification = () => {
    let index = this.state.notifications.findIndex((notification) => {
      return notification.id === this.props.chatRoom.id;
    });

    if (index !== -1) {
      let updateNotifications = [...this.state.notifications];
      // 선택된 채팅방의 토탈정보를 lastKnownTotal에 업데이트  결론: lastKnownTotal === total => 0
      updateNotifications[index].lastKnownTotal = this.state.notifications[
        index
      ].total;
      updateNotifications[index].count = 0;
      this.setState({ notifications: updateNotifications });
    }
  };

  getNotification = (room) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  renderChatRooms = (rooms) => {
    return rooms.map((room) => (
      <div
        onClick={() => {
          this.setCurrentChatRoom(room);
        }}
        style={{
          cursor: "pointer",
          marginTop: "0.5rem",
          backgroundColor:
            room.id === this.state.activeChatRoomId && "#ffffff45",
        }}
        key={room.id}
      >
        # &nbsp;&nbsp; {room.name}
        <StyledBadge variant="danger">
          {this.getNotification(room)}
        </StyledBadge>{" "}
      </div>
    ));
  };

  render() {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaRegSmile size="1.3rem" />
          <div style={{ margin: "0 28px" }}>CHAT ROOMS</div>
          <FaPlus
            size="1.3rem"
            onClick={this.handleShow}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div>{this.renderChatRooms(this.state.chatRooms)}</div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>방만들기</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>방 이름 </Form.Label>
                <Form.Control
                  value={this.state.name}
                  onChange={this.handleNameChange}
                  type="text"
                  placeholder="방 이름을 입력해주세요."
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.desc}
                  onChange={this.handleDescChange}
                  placeholder="방에 대한 설명을 적어주세요."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onSubmit}>
              생성하기
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapToStateProps = (state) => {
  return {
    user: state.user.customerUser,
    chatRoom: state.chatRoom.currentRoom,
  };
};

export default connect(mapToStateProps)(ChatRoom);
