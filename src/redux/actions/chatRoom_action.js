import {
  ADD_MESSAGES,
  CHANGE_MESSAGE_LOADING_STATUS,
  REMOVE_CHAT_ROOM,
  SET_CURRENT_CHAT_ROOM,
  SET_PRIVATE_CHAT_ROOM,
  SET_USERS_POSTS,
} from "./type";

export function setCurrentChatRoom(room) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: room,
  };
}

export function setPrivateChatRoom(payload) {
  return {
    type: SET_PRIVATE_CHAT_ROOM,
    payload,
  };
}

export const setUsersPosts = (payload) => {
  return {
    type: SET_USERS_POSTS,
    payload,
  };
};

export const addMessage = (payload) => {
  return {
    type: ADD_MESSAGES,
    payload,
  };
};

export const changeMessageLoading = () => {
  return {
    type: CHANGE_MESSAGE_LOADING_STATUS,
  };
};

export const removeChatRoom = (room) => {
  return {
    type: REMOVE_CHAT_ROOM,
    payload: room,
  };
};
