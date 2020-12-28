import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';

import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from '../../../firebase';
import Message from "./Message";


class MainPanel extends Component {

    state = {
        messagesRef: firebase.database().ref('message'),
        messages: [],
        messageLoading: true,
    }

    componentDidMount() {
        // this.addMessagesListener();
        const currentRoom = this.props.chatRoom.currentRoom;

        console.log('componentDidMount', this.props.chatRoom);
        if(currentRoom) {
            console.log('start', currentRoom.id)
            this.addMessagesListener(currentRoom.id);
        }

    }

    addMessagesListener = (roomId) => {
        console.log(333);
        let messagesArray = [];
        this.state.messagesRef.child(roomId).on('child_added', (snapShot) => {
            console.log('add-child')
            messagesArray.push(snapShot.val());
            this.setState({
                messages: messagesArray,
                messageLoading: false,
            });
        });

    }

    renderMessages = (messages) => {
        console.log(messages, "message");
        return messages.map(message => <Message key={message.timeStamp} message={message} user={this.props.user}/>)
    }


    render() {
        const { messages } = this.state;
        return (
            <div>
                <MessageHeader />

                <div style={{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #868e96',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto',
                }} >
                    {this.renderMessages(messages)}
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
    }
}

export default connect(mapStateToProps)(MainPanel);
