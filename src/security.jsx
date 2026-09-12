import { replace, useNavigate } from 'react-router-dom';
import './security.css'
import { useEffect, useState } from 'react';

const Security = ({ tm }) => {
    const nav = useNavigate()
    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:5000/api/auth/check-login', {
                method: 'GET',
                credentials: 'include',
            })
            const data = await res.json()

            if (res.status === 401) {
                nav('/login_page', { replace: true })
                tm(data.message)
            }
        })()
    }, [])
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confPass, setConfPass] = useState('')
    const [confPassOk, setConfPassOk] = useState(true)
    const [canSubmit, setCanSubmit] = useState(false)
    useEffect(() => {
        setConfPassOk(true)
        if (confPass.length > 0 && newPass.length > 0) {
            setConfPassOk(newPass == confPass)
        }
        setCanSubmit(oldPass.length >= 8 && confPass.length >= 8 && newPass.length >= 8)
    }, [oldPass, newPass, confPass])
    return (
        <>
            <div id='security_body'>
                <div id='security_heading'><p>{'Settings|Security'}</p></div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (canSubmit && confPassOk) {
                        (async () => {
                            const res = await fetch('http://localhost:5000/api/updatePass', {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    oldPass,
                                    newPass
                                })
                            })
                            const data = await res.json()
                            if (res.status === 401) {
                                nav('/login_page', { replace: true })
                            }
                            tm(data.message)
                        })()
                        setOldPass('')
                        setNewPass('')
                        setConfPass('')
                        e.target.reset()
                    }
                }}>
                    <div className='security_input_box'>
                        <label htmlFor='old_pass'>Old Password:</label>
                        <input id='old_pass' type='password' required minLength={8} maxLength={16}
                            onInput={(e) => { setOldPass(e.target.value) }}></input>
                    </div>
                    <div className='security_input_box'>
                        <label htmlFor='new_pass'>New Password:</label>
                        <input id='new_pass' type='password' required minLength={8} maxLength={16}
                            onInput={(e) => { setNewPass(e.target.value) }}></input>
                    </div>
                    <div className='security_input_box'>
                        <label htmlFor='conf_pass_id'>Confirm Password:</label>
                        <input id='conf_pass_id' className={`conf_pass ${(confPassOk) ? ('') : ('conf_pass_w')}`} type='password' required minLength={8} maxLength={16}
                            onInput={(e) => { setConfPass(e.target.value) }}></input>
                        <p className={`conf_pass_bottom_text ${(confPass.length == 0 || newPass.length == 0) ? ('') : (confPassOk) ? ('conf_pass_bottom_text_v') : ('conf_pass_bottom_text_w')}`}>{(newPass.length == 0) ? ('first enter new password') : (confPass.length == 0) ? ('confirm password must same as new password') : (confPassOk) ? ('confirm password verified') : ('confirm password not same as new password')}</p>
                    </div>
                    <div className='security_input_button_box'>
                        <button className={`security_input_button ${(canSubmit && confPassOk) ? ('security_input_button_a') : ('')}`}>Change Password</button>
                    </div>
                </form>
                <button id='Logout_input_button' onClick={async () => {
                    const res = await fetch("http://localhost:5000/api/auth/logout", {
                        method: "POST",
                        credentials: "include"
                    });
                    const data = await res.json()
                    nav('/login_page', { replace: true })
                    tm(data.message)
                }}>Logout</button>
            </div>
        </>
    );
}

export default Security