import React, { useRef, useState } from 'react';
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from '../../firebase';
import md5 from 'md5';


const Register = () => {

    const { watch, errors, register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [existError, setExistError] = useState(false);
    const password = useRef();
    password.current = watch("password");
    watch('email');

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const createdUser = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            console.log(createdUser);
            setLoading(false);
            setExistError(false);
            await createdUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            });

            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL,
            })

        } catch (err) {
            if(err.code === 'auth/email-already-in-use') {
                setExistError(true);
            }
            setLoading(false);
            console.log(err);
        }
    }

    return (
        <div className='auth-wrapper'>
            <div className='register-header'>
                <h2>Register</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: {
                        value: /^\S+@\S+$/i
                        }
                    })}

                />
                {errors.email && errors.email.type === 'required' && <div>필수값입니다. 입력해주세요.</div>}
                {errors.email && errors.email.type === 'pattern' && <div>이메일 형식이 아닙니다.</div>}
                <label>name</label>
                <input
                    name="name"
                    ref={register({ required: true, maxLength: 10})}
                />
                {errors.name && errors.name.type === 'required' && <div>필수값입니다. 입력해주세요.</div>}
                {errors.name && errors.name.type === 'maxLength' && <div>10자리 이하로 작성해주세요.</div>}
                <label>password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/})}

                />
                {errors.password && errors.password.type === 'required' && <div>필수값입니다. 입력해주세요.</div>}
                {errors.password && errors.password.type === 'pattern' && <div>특수문자, 영문, 숫자조합 8자리이상으로 해주세요.</div>}
                <label>passwordConfirm</label>
                <input
                    name="passwordConfirm"
                    type='password'
                    ref={register({
                        required: true,
                        validate: (value) => {
                            return value === password.current
                        }
                    })}

                />
                {errors.passwordConfirm && errors.passwordConfirm.type === 'required' && <div>필수값입니다. 입력해주세요.</div>}
                {errors.passwordConfirm && errors.passwordConfirm.type === 'validate' && <div>비밀번호가 일치하지 않습니다.</div>}
                {existError && <div>이미 회원가입 된 유저입니다.</div>}
                <input type="submit" disabled={loading} />
                <NavLink className='register-link' to='/login'>이미 아이디가 있다면...</NavLink>
            </form>
        </div>
    );
};

export default Register;
