import React from 'react';
import {Media} from "react-bootstrap";
import moment from 'moment';

const Message = ({ message, user }) => {

    console.log(message,"---- " ,message.user.name, "Message component")
    const timeFromNow = (timeStamp) => moment(timeStamp).fromNow();

    const isImage = (message) => {
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
    }

    const isMe = () => {
        return message.currentRoom.name === user.customerUser.displayName
    }

    return (
        <div>
            <Media style={{
                marginBottom: '10px',
            }}>
                <img
                    width={48}
                    height={48}
                    className="mr-3"
                    src={message.user.image}
                    style={{
                        display: 'inlineBlock',
                        margin: '10px 16px 0px 14px',
                        borderRadius: '50%',
                    }}
                />
                <Media.Body style={{
                    padding: '10px 0px 0px 10px',
                    backgroundColor: isMe
                        ? '#f1f3f5'
                        : '#f8f0fc',
                }}>
                    <h6 style={{ display: 'inline-block', fontWeight: 'bold' }}>{message.user.name}</h6>
                    <span style={{ color: 'gray', fontSize: '15px', marginLeft: '15px' }}>{timeFromNow(message.timeStamp)}</span>
                        {isImage(message) ?
                            <img style={{ maxWidth: '300px', borderRadius:'14px' }} src={message.image} alt="이미지" />
                            : <p> {message.content} </p>
                        }
                </Media.Body>
            </Media>

        </div>
    );
};

export default Message;
