import { SET_CURRENT_CHAT_ROOM } from "./type";

export function setCurrentChatRoom(room) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: room
    }
}