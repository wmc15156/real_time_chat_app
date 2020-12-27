import {CLEAR_USER, SET_USER, UPDATE_URL} from "../actions/type";

const initialState = {
    customerUser: null,
    isLoading: true,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                customerUser: action.payload,
                isLoading: false,
            }
        case CLEAR_USER:
            return {
                ...state,
                customerUser: null,
                isLoading: false,
            }
        case UPDATE_URL:
            return {
                ...state,
                customerUser: {...state.customerUser, photoURL: action.payload }
            }
        default:
            return state;
    }
}