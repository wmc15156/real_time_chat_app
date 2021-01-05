import React, { Component, createRef, useRef } from "react";
import { connect } from "react-redux";

import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from "../../../firebase";
import Message from "./Message";
import {
  addMessage,
  setUsersPosts,
} from "../../../redux/actions/chatRoom_action";
import Skeleton from "../../../commons/components/Skeleton";

class MainPanel extends Component {
  messageEnd = createRef();

  state = {
    messagesRef: firebase.database().ref("message"),
    messages: [],
    messageLoading: true,
    searchTerm: "",
    searchResult: [],
    searchLoading: false,
    typingRef: firebase.database().ref("typing"),
    typingUsers: [],
    listenerLists: [],
  };

  componentDidMount() {
    // this.addMessagesListener();
    const currentRoom = this.props.chatRoom.currentRoom;

    if (currentRoom) {
      this.addMessagesListener(currentRoom.id);
      this.addTypingListener(currentRoom.id);
    }

    setTimeout(() => {
      if (this.state.messages.length === 0) {
        this.setState({
          messageLoading: false,
        });
      }
    }, 1000);
  }

  componentDidUpdate = () => {
    if (this.messageEnd) {
      this.messageEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  componentWillUnmount() {
    this.state.messagesRef.off();
    this.removeListener(this.state.listenerLists);
  }

  removeListener = (listenerLists) => {
    listenerLists.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.listenerEvent);
    });
  };

  addTypingListener = (chatRoomId) => {
    let typingUsers = [];
    this.state.typingRef.child(chatRoomId).on("child_added", (DatasnapShot) => {
      // 나에게는 내가 치는 타이핑이 보여지면 안됨.
      if (DatasnapShot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: DatasnapShot.key,
          name: DatasnapShot.val(),
        });

        this.setState({ typingUsers });
      }
      this.addListenerLists(chatRoomId, this.state.typingRef, "child_added");
    });

    // 타이핑을 지울때 해당 내용을 state에서 삭제
    this.state.typingRef
      .child(chatRoomId)
      .on("child_removed", (DatasnapShot) => {
        const index = this.state.typingUsers.findIndex(
          (user) => user.id === DatasnapShot.key
        );

        if (index !== -1) {
          typingUsers = typingUsers.filter(
            (user) => user.id !== DatasnapShot.key
          );
          this.setState({ typingUsers });
        }
        this.addListenerLists(
          chatRoomId,
          this.state.typingRef,
          "child_removed"
        );
      });
  };

  addListenerLists = (id, ref, listenerEvent) => {
    const index = this.state.listenerLists.findIndex((listener) => {
      return (
        listener.id === id &&
        listener.ref === ref &&
        listener.listenerLists === listenerEvent
      );
    });

    if (index !== -1) {
      const newListener = { id, ref, listenerEvent };
      this.setState({
        listenerLists: this.state.listenerLists.concat(newListener),
      });
    }
  };

  addMessagesListener = (roomId) => {
    let messagesArray = [];
    this.state.messagesRef.child(roomId).on("child_added", (snapShot) => {
      messagesArray.push(snapShot.val());
      this.setState({
        messages: messagesArray,
        messageLoading: false,
      });
      this.userPostsCount(messagesArray);
      this.props.dispatch(addMessage(messagesArray));
    });
  };

  userPostsCount = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (!message.user.name) {
        return acc;
      }

      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUsersPosts(userPosts));
  };

  renderMessages = (messages) => {
    return messages.map((message) => (
      <Message
        key={message.timeStamp}
        message={message}
        user={this.props.user}
      />
    ));
  };

  onChangeHandler = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => {
        const chatMessage = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");

        const searchResults = chatMessage.reduce((acc, message) => {
          if (
            message.content &&
            (message.content.match(regex) || message.user.name.match(regex))
          ) {
            acc.push(message);
          }
          return acc;
        }, []);

        this.setState({
          searchResult: searchResults,
          searchLoading: false,
        });
      }
    );
  };

  renderTyping = (typingUser) => {
    if (typingUser.length > 0) {
      return (
        <div style={{ fontSize: "5px" }}>
          {typingUser[0].name}님이 입력하고 있습니다.........
        </div>
      );
    }
  };

  messageSkeleton = (messageLoading) => {
    if (messageLoading) {
      return (
        <>
          {/*{[*/}
          {/*  ...Array(10).map((v, i) => {*/}
          {/*    return <Skeleton key={i} />;*/}
          {/*  }),*/}
          {/*]}*/}
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          {[...new Array(10).map((v, i) => <Skeleton key={i} />)]}
        </>
      );
    }
  };

  clearRenderMessage = () => {
    setTimeout(() => {
      if (this.props.chatRoom.messages.length > 0) {
      }
    }, 1000);
    return <div></div>;
  };

  render() {
    const { messages, searchResult, typingUsers, messageLoading } = this.state;
    return (
      <div>
        <MessageHeader
          onChangeHandler={this.onChangeHandler}
          value={this.state.searchTerm}
        />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #868e96",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {this.messageSkeleton(messageLoading)}
          {searchResult.length
            ? this.renderMessages(searchResult)
            : this.renderMessages(messages)}

          {this.renderTyping(typingUsers)}
          <div ref={(node) => (this.messageEnd = node)} />
        </div>
        <MessageForm />
      </div>
    );
  }
}

MainPanel.propTypes = {};

const mapStateToProps = (state) => {
  return {
    user: state.user.customerUser,
    chatRoom: state.chatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
