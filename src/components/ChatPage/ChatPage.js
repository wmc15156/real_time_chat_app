import React from 'react';
import SidePanel from "./sidePanel/sidePanel";
import MainPanel from "./mainPanel/mainPanel";
import {useSelector} from "react-redux";

const ChatPage = () => {
    const chatRoom = useSelector(state => state.chatRoom.currentRoom);
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px' }}>
                <SidePanel />
            </div>
            <div style={{ width: '100%', margin: '30px 30px' }}>
                <MainPanel key={ chatRoom && chatRoom.id }/>
            </div>
        </div>
    );
};

export default ChatPage;


