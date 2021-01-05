import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";

import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

class Favorited extends Component {
  state = {
    userRef: firebase.database().ref("users"),
    favoriteChatRooms: [],
    activeChatRoomId: "",
  };

  componentDidMount() {
    const currentUser = this.props.user;
    if (currentUser) {
      this.addListeners(currentUser.uid);
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener(this.props.user.uid);
    }
  }

  removeListener = (userId) => {
    this.state.userRef.child(`${userId}/favorite`).off();
  };

  addListeners = (userId) => {
    const { userRef, favoriteChatRooms } = this.state;
    userRef
      .child(userId)
      .child("favorite")
      .on("child_added", (DatasnapShot) => {
        const favoriteChatRoom = {
          id: DatasnapShot.key,
          ...DatasnapShot.val(),
        };
        this.setState({
          favoriteChatRooms: [
            ...this.state.favoriteChatRooms,
            favoriteChatRoom,
          ],
        });
      });

    userRef
      .child(userId)
      .child("favorite")
      .on("child_removed", (DatasnapShot) => {
        console.log("remove");
        const chatRoomToRemove = {
          id: DatasnapShot.key,
          ...DatasnapShot.val(),
        };
        const filterChatRooms = this.state.favoriteChatRooms.filter(
          (chatRoom) => chatRoom.id !== chatRoomToRemove.id
        );
        this.setState({
          favoriteChatRooms: filterChatRooms,
        });
      });
  };

  changeChatRoom = (chatRoom) => () => {
    this.props.dispatch(setCurrentChatRoom(chatRoom));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: chatRoom.id });
  };

  renderFavoratedChatRooms = (chatRooms) => {
    if (chatRooms.length > 0) {
      return chatRooms.map((chatRoom) => {
        return (
          <li
            key={chatRoom.id}
            onClick={this.changeChatRoom(chatRoom)}
            style={{
              backgroundColor:
                chatRoom.id === this.state.activeChatRoomId && "#ffffff45",
            }}
          >
            # {chatRoom.name}
          </li>
        );
      });
    }
  };

  render() {
    const { favoriteChatRooms } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaRegSmile style={{ marginRight: "3px" }} />
          FAVORITED({favoriteChatRooms.length ? favoriteChatRooms.length : 0})
        </span>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {this.renderFavoratedChatRooms(favoriteChatRooms)}
        </ul>
      </div>
    );
  }
}

const mapToStateProps = (state) => {
  return {
    user: state.user.customerUser,
  };
};

export default connect(mapToStateProps)(Favorited);
