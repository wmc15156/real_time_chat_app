import { CLEAR_USER, SET_USER, UPDATE_URL } from "./type";

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}

export function updatePhotoURL(url) {
  return {
    type: UPDATE_URL,
    payload: url,
  };
}
