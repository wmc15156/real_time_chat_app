import {
  ADD_MESSAGES,
  CHANGE_MESSAGE_LOADING_STATUS,
  SET_CURRENT_CHAT_ROOM,
  SET_PRIVATE_CHAT_ROOM,
  SET_USERS_POSTS,
} from "../actions/type";

const initialChatRoomState = {
  currentRoom: null,
  privateChatRoom: false,
  messages: [],
  messageLoading: true,
};

export default function (state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
      };
    case SET_PRIVATE_CHAT_ROOM:
      return {
        ...state,
        privateChatRoom: action.payload,
      };
    case SET_USERS_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    case ADD_MESSAGES:
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      };
    case CHANGE_MESSAGE_LOADING_STATUS:
      return {
        ...state,
        messageLoading: false,
      };
    default:
      return state;
  }
}
