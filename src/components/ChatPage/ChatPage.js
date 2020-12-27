import React from 'react';
import SidePanel from "./sidePanel/sidePanel";
import MainPanel from "./mainPanel/mainPanel";

const ChatPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px' }}>
                <SidePanel />
            </div>
            <div style={{ width: '100%', margin: '30px 30px' }}>
                <MainPanel />
            </div>
        </div>
    );
};

export default ChatPage;


