import './settings_profile.css'
import udp from './assets/nav_icons/user.png'
import { useState } from 'react'

const SettingsProfile = () => {
    const [nameEdit, setNameEdit] = useState(false);
    const [companyEdit, setCompanyEdit] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);
    const [phoneEdit, setPhoneEdit] = useState(false);
    const [aboutEdit, setAboutEdit] = useState(false);
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
                            e.target.value = 'xyz'
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
                            e.target.value = 'xyz'
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
                            e.target.value = 'xyz'
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
                            e.target.value = '0158'
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
                        e.target.value = 'xyz'
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