import React, {Component} from 'react';
import styled, {css} from 'styled-components';
import { FaRegSmile } from 'react-icons/fa';
import { connect } from 'react-redux';

import firebase from '../../../firebase';
import {setCurrentChatRoom, setPrivateChatRoom} from "../../../redux/actions/chatRoom_action";


const IconParentBoxStyled = styled.span`
  display: flex;
  align-items: center;
  margin-top: 30px;
`;

const SmileIcon = styled(FaRegSmile)`
  margin-right: 3px;
`;

const DirectMessageLists = styled.ul`
  list-style: none;
  padding: 0;
`;

const DirectMessageListStyled = styled.li`
  cursor: pointer;      
  ${props => props.isTrue && css`
    background-color: #ffffff45;
  `}
`;

class DirectMessages extends Component {
    state = {
        useRef: firebase.database().ref('users'),
        users: [],
        activeRoom: "",
    }

    componentDidMount() {
        if(this.props.user.uid) {
            this.addUserListener(this.props.user.uid)
        }
    }

    addUserListener = (user) => {
        const { useRef } = this.state;
        useRef.on('child_added', (DataSnapshot) => {
            let usersArray = [];
            if(user !== DataSnapshot.key) {
                let data = DataSnapshot.val();

                data['uid'] = DataSnapshot.key;
                data['status'] = 'offline';
                usersArray.push(data);
                this.setState({
                    users: this.state.users.concat(usersArray)
                });
            }
        })

    }

    getChatRoomId = (userId) => {
        const currentUser = this.props.user.uid;
        return userId > currentUser
            ? `${userId}/${currentUser}`
            : `${currentUser}/${userId}`
    }

    activeChatRoom = (userId) => {
        this.setState({
            activeRoom: userId,
        });
    }

    changeChatRoom = (user) => () => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name,
        }
        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.activeChatRoom(user.uid);
    }



    renderDirectMessages = (users) => {
        return users.map(user => (
            <DirectMessageListStyled
                key={user.uid}
                isTrue={this.state.activeRoom === user.uid}
                onClick={this.changeChatRoom(user)}># {user.name}
            </DirectMessageListStyled>
        ))
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <IconParentBoxStyled>
                    <SmileIcon /> DirectMessages(1)
                </IconParentBoxStyled>

                <DirectMessageLists>
                    {this.renderDirectMessages(users)}
                </DirectMessageLists>
            </div>

        )

    }
}

const mapStateToProps = (state) => {
    console.log('map');
    return {
        user: state.user.customerUser,
    }
}

export default connect(mapStateToProps)(DirectMessages)