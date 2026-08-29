import './settings_profile.css'
import udp from './assets/nav_icons/user.png'
import { useEffect, useState } from 'react'
import edit from './assets/nav_icons/edit.png'
import edit_active from './assets/nav_icons/edit_active.png'

const SettingsProfile = () => {
    const [nameEdit, setNameEdit] = useState(false)
    const [companyEdit, setCompanyEdit] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [phoneEdit, setPhoneEdit] = useState(false)
    const [aboutEdit, setAboutEdit] = useState(false)
    const [edited, setEdited] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('av_token'))
    const [User, setUser] = useState({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        about: ""
    })
    const [tUser, setTUser] = useState({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        about: ""
    })

    useEffect(() => {
        (async () => {
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
            setTUser(cuser)
            document.getElementById('sp_name').value = cuser.name
            document.getElementById('sp_company').value = cuser.companyName
            document.getElementById('sp_email').value = cuser.email
            document.getElementById('sp_phone').value = cuser.phone
            document.getElementById('sp_about').value = cuser.about
        })()
    }, [])

    useEffect(() => {
        setEdited(JSON.stringify(User) !== JSON.stringify(tUser))
    }, [User])

    return (<>
        <div id='sp_heading'><p>{'settings|Profile'}</p></div>
        <form onSubmit={(e) => {
            e.preventDefault();
            if (edited) {
                (async () => {
                    const res = await fetch('http://localhost:5000/api/updateProfileInfo', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token,
                            name: User.name,
                            companyName: User.companyName,
                            email: User.email,
                            phone: User.phone,
                            about: User.about
                        })
                    })
                    const data = res.json();
                })()
                setEdited(false)
            }
        }}>
            <div id='sp_img_entrys'>
                <img src={udp} alt="user_image" id='sp_image' />
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_name'>Name:</label>
                <div className='sp_input'>
                    <input type='text' id='sp_name' onInput={(e) => {
                        if (!nameEdit) {
                            e.target.value = User.name
                        } else {
                            setUser({ ...User, name: e.target.value })
                        }
                    }} />
                    <div className={`sp_edit_button ${(nameEdit) ? 'sp_edit_button_active' : ''}`} onClick={(e) => {
                        e.preventDefault();
                        setNameEdit((p) => (!p));
                    }}>
                        <img src={(nameEdit) ? edit_active : edit} alt="edit_icon" className='sp_edit_icon' />
                    </div>
                </div>
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_company'>Company:</label>
                <div className='sp_input'>
                    <input type='text' id='sp_company' onInput={(e) => {
                        if (!companyEdit) {
                            e.target.value = User.companyName
                        } else {
                            setUser({ ...User, companyName: e.target.value })
                        }
                    }} />
                    <div className={`sp_edit_button ${(companyEdit) ? 'sp_edit_button_active' : ''}`} onClick={(e) => {
                        e.preventDefault();
                        setCompanyEdit((p) => (!p));
                    }}>
                        <img src={(companyEdit) ? edit_active : edit} alt="edit_icon" className='sp_edit_icon' />
                    </div>
                </div>
            </div>
            <div className='sp_entry_box'>
                <label htmlFor='sp_email'>Email:</label>
                <div className='sp_input'>
                    <input type='email' id='sp_email' onInput={(e) => {
                        if (!emailEdit) {
                            e.target.value = User.email
                        } else {
                            setUser({ ...User, email: e.target.value })
                        }
                    }} />
                    <div className={`sp_edit_button ${(emailEdit) ? 'sp_edit_button_active' : ''}`} onClick={(e) => {
                        e.preventDefault();
                        setEmailEdit((p) => (!p));
                    }}>
                        <img src={(emailEdit) ? edit_active : edit} alt="edit_icon" className='sp_edit_icon' />
                    </div>
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
                            setUser({ ...User, phone: e.target.value })
                        }
                    }} id='sp_phone' />
                    <div className={`sp_edit_button ${(phoneEdit) ? 'sp_edit_button_active' : ''}`} onClick={(e) => {
                        e.preventDefault();
                        setPhoneEdit((p) => (!p));
                    }}>
                        <img src={(phoneEdit) ? edit_active : edit} alt="edit_icon" className='sp_edit_icon' />
                    </div>
                </div>
            </div>
            <div className='sp_entry_box'>
                <div className='sp_input'>
                    <label htmlFor='sp_about'>About yourself:</label>
                    <div className={`sp_edit_button ${(aboutEdit) ? 'sp_edit_button_active' : ''}`} onClick={(e) => {
                        e.preventDefault();
                        setAboutEdit((p) => (!p));
                    }}>
                        <img src={(aboutEdit) ? edit_active : edit} alt="edit_icon" className='sp_edit_icon' />
                    </div>
                </div>
                <textarea id="sp_about" maxLength={150} onInput={(e) => {
                    if (!aboutEdit) {
                        e.target.value = User.about
                    } else {
                        setUser({ ...User, about: e.target.value })
                    }
                }}></textarea>
            </div>
            <div className='sp_button_box'>
                <button type='submit' className={`sp_save_button ${(edited) ? 'sp_save_button_active' : ''}`}>Save</button>
                <button id='sp_cancel_button' onClick={(e) => {
                    e.preventDefault()
                }}>Cancel</button>
            </div>
        </form>

    </>)
}

export default SettingsProfile