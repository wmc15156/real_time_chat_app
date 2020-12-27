import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from '../../firebase';



const Login = () => {
    console.log('here');
    const { watch, errors, register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [existError, setExistError] = useState(false);
    watch('email');

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log(data);
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            setLoading(false);
            setExistError(false);

        } catch (err) {
            if(err.code === 'auth/wrong-password') {
                setExistError(true);
            }
            setLoading(false);
            console.log(err);
        }
    }

    return (
        <div className='auth-wrapper'>
            <div className='register-header'>
                <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true })}
                    placeholder="이메일 형식으로 입력해주세요."
                />
                {errors.email && errors.email.types === 'required' && <div>이메일을 입력해주세요.</div>}

                <label>password</label>
                <input
                    name="password"
                    type="password"
                    ref={register()}
                />
                {existError && <div>이메일 또는 비밀번호를 확인해주세요.</div>}
                <input type="submit" value="로그인" disabled={loading}  />
                <NavLink className='register-link' to='/register'>아직 회원가입을 하지 않았다면...</NavLink>
            </form>
        </div>
    );
};

export default Login;


