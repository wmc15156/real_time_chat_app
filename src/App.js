import React, {useEffect} from 'react';
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import Register from "./components/RegisterPage/Register";
import firebase from "./firebase";
import { clearUser, setUser } from "./redux/actions/user_action";



function App() {
    let history = useHistory();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.user.isLoading);
    useEffect(() => {
        console.log('hhh');
        firebase.auth().onAuthStateChanged((user) => {
            //로그인
            console.log(user);
            if (user) {
                console.log('login', user);
                history.push('/');
                dispatch(setUser(user));
            } else {
                console.log('gogo')
                dispatch(clearUser())
                history.push('/login');
            }
        })
    }, [])
    if(isLoading) {
        return <div>Loading...</div>
    }
    else {
        return (
            <Switch>
                <Route exact path="/" component={ChatPage}/>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/register" component={Register}/>
            </Switch>
        );
    }
}

export default App;
