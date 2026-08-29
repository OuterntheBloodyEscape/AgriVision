import './settings_profile.css'
import udp from './assets/nav_icons/user.png'
import { useEffect, useState } from 'react'

const SettingsProfile = () => {
    const [nameEdit, setNameEdit] = useState(false);
    const [companyEdit, setCompanyEdit] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);
    const [phoneEdit, setPhoneEdit] = useState(false);
    const [aboutEdit, setAboutEdit] = useState(false);
    const [User, setUser] = useState({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        about: ""
    })

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('av_token')
            const res = await fetch('http://localhost:5000/api/getProfileInfo', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token
                })
            })
            const cuser = await res.json()

            setUser(cuser)
            document.getElementById('sp_name').value = cuser.name
            document.getElementById('sp_company').value = cuser.companyName
            document.getElementById('sp_email').value = cuser.email
            document.getElementById('sp_phone').value = cuser.phone
            document.getElementById('sp_about').value = cuser.about
        })()
    }, [])

    return (<>
        <div id='sp_heading'><p>{'settings|Profile'}</p></div>
        <form>
            <div id='sp_img_entrys'>
                <img src={udp} alt="user_image" id='sp_image' />
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_name'>Name:</label>
                <div className='sp_input'>
                    <input type='text' id='sp_name' onInput={(e) => {
                        if (!nameEdit) {
                            e.target.value = User.name
                        }
                    }} />
                    <button className='sp_edit_button' onClick={(e) => {
                        e.preventDefault();
                        setNameEdit(true);
                    }}>Edit</button>
                </div>
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_company'>Company:</label>
                <div className='sp_input'>
                    <input type='text' id='sp_company' onInput={(e) => {
                        if (!companyEdit) {
                            e.target.value = User.companyName
                        }
                    }} />
                    <button className='sp_edit_button' onClick={(e) => {
                        e.preventDefault();
                        setCompanyEdit(true);
                    }}>Edit</button>
                </div>
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_email'>Email:</label>
                <div className='sp_input'>
                    <input type='email' id='sp_email' onInput={(e) => {
                        if (!emailEdit) {
                            e.target.value = User.email
                        }
                    }} />
                    <button className='sp_edit_button' onClick={(e) => {
                        e.preventDefault();
                        setEmailEdit(true);
                    }}>Edit</button>
                </div>

            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_phone'>phone:</label>
                <div className='sp_input'>
                    <input type='text' onInput={(e) => {
                        if (!phoneEdit) {
                            e.target.value = User.phone
                        } else {
                            e.target.value = e.target.value.replace(/\D/g, "")
                        }
                    }} id='sp_phone' />
                    <button className='sp_edit_button' onClick={(e) => {
                        e.preventDefault();
                        setPhoneEdit(true);
                    }}>Edit</button>
                </div>
            </div>
            <div className='sp_entry_box'>
                <div className='sp_input'>
                    <label htmlFor='sp_about'>About yourself:</label>
                    <button className='sp_edit_button' onClick={(e) => {
                        e.preventDefault();
                        setAboutEdit(true);
                    }}>Edit</button>
                </div>
                <textarea id="sp_about" maxLength={150} onInput={(e) => {
                    if (!aboutEdit) {
                        e.target.value = User.about
                    }
                }}></textarea>
            </div>
            <div className='sp_button_box'>
                <button id='sp_save_button'>Save</button>
            </div>
        </form>

    </>)
}

export default SettingsProfile