import { SET_CURRENT_CHAT_ROOM } from "../actions/type";

const initialChatRoomState = {
    currentRoom: null,
}

export default function (state=initialChatRoomState, action) {
    switch (action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            }
        default:
            return state;
    }
}