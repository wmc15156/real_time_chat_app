import { combineReducers } from "redux";
import user from './userReducer';
import chatRoom from "./chatRoom";


const rootReducer = combineReducers({
    user,
    chatRoom,
});

export default rootReducer;