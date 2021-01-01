import {SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM} from "../actions/type";

const initialChatRoomState = {
    currentRoom: null,
    privateChatRoom: false,
}

export default function (state=initialChatRoomState, action) {
    switch (action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            }
        case SET_PRIVATE_CHAT_ROOM:
            console.log('payload', action.payload);
            return {
                ...state,
                privateChatRoom: action.payload,
            }
        default:
            return state;
    }
}
