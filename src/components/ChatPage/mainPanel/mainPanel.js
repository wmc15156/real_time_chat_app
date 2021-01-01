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
        searchTerm: '',
        searchResult: [],
        searchLoading: false
    }

    componentDidMount() {
        // this.addMessagesListener();
        const currentRoom = this.props.chatRoom.currentRoom;

        if(currentRoom) {
            this.addMessagesListener(currentRoom.id);
        }

    }

    addMessagesListener = (roomId) => {
        let messagesArray = [];
        this.state.messagesRef.child(roomId).on('child_added', (snapShot) => {
            messagesArray.push(snapShot.val());
            this.setState({
                messages: messagesArray,
                messageLoading: false,
            });
        });

    }

    renderMessages = (messages) => {
        return messages.map(message => <Message key={message.timeStamp} message={message} user={this.props.user}/>)
    }

    onChangeHandler = (e) => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true,
        }, () => {
            const chatMessage = [...this.state.messages];
            const regex = new RegExp(this.state.searchTerm, 'gi');

            const searchResults = chatMessage.reduce((acc, message) => {
               if(message.content && (message.content.match(regex) || message.user.name.match(regex))) {
                   acc.push(message);
               }
               return acc;
            },[]);

            this.setState({
                searchResult: searchResults,
                searchLoading: false,
            });

        })
    }


    render() {
        const { messages, searchResult } = this.state;
        return (
            <div>
                <MessageHeader onChangeHandler={this.onChangeHandler} value={this.state.searchTerm} />

                <div style={{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #868e96',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto',
                }} >
                    {searchResult.length ? this.renderMessages(searchResult) : this.renderMessages(messages)}
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
