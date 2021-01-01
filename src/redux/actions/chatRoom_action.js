import {SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM} from "./type";

export function setCurrentChatRoom(room) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: room
    }
}

export function setPrivateChatRoom(payload) {
    console.log('here');
    return {
        type: SET_PRIVATE_CHAT_ROOM,
        payload,
    }
}