import './settings_profile.css'
import udp from './assets/nav_icons/user.png'
import { useEffect, useState } from 'react'
import edit from './assets/nav_icons/edit.png'
import edit_active from './assets/nav_icons/edit_active.png'
import { useNavigate } from 'react-router-dom'

const SettingsProfile = ({ tm }) => {

    const nav = useNavigate()

    const [nameEdit, setNameEdit] = useState(false)
    const [companyEdit, setCompanyEdit] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [phoneEdit, setPhoneEdit] = useState(false)
    const [aboutEdit, setAboutEdit] = useState(false)

    const [edited, setEdited] = useState(false)

    const [User, setUser] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        about: '',
        profileImage: ''
    })

    const [tUser, setTUser] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        about: '',
        profileImage: ''
    })

    const [profileImage, setProfileImage] = useState(null)
    const [profileImagePreview, setProfileImagePreview] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {

        const getProfile = async () => {

            try {

                const res = await fetch(
                    'http://localhost:5000/api/getProfileInfo',
                    {
                        method: 'GET',
                        credentials: 'include'
                    }
                )

                const cuser = await res.json()

                if (res.status === 401) {

                    nav('/login_page', {
                        replace: true
                    })

                    tm(cuser.message)

                    return
                }

                setUser(cuser)
                setTUser(cuser)

                setProfileImagePreview(
                    cuser.profileImage || ''
                )

            } catch (error) {

                console.error(error)

                tm('Unable to load profile information')

            }

        }

        getProfile()

    }, [nav, tm])

    useEffect(() => {

        setEdited(
            JSON.stringify(User) !== JSON.stringify(tUser) ||
            profileImage !== null
        )

    }, [User, tUser, profileImage])

    const saveProfile = async () => {

        if (saving) return

        setSaving(true)

        try {

            const formData = new FormData()

            formData.append('name', User.name || '')
            formData.append('companyName', User.companyName || '')
            formData.append('email', User.email || '')
            formData.append('phone', User.phone || '')
            formData.append('about', User.about || '')

            if (profileImage) {
                formData.append('image', profileImage)
            }

            const res = await fetch(
                'http://localhost:5000/api/updateProfileInfo',
                {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                }
            )

            const data = await res.json()

            if (res.status === 401) {
                nav('/login_page', {
                    replace: true
                })
                return
            }

            tm(data.message)

            if (res.ok) {

                const newProfileImage =
                    data.profileImage ||
                    User.profileImage ||
                    ''

                const updatedUser = {
                    ...User,
                    profileImage: newProfileImage
                }

                setUser(updatedUser)
                setTUser(updatedUser)

                setProfileImage(null)

                setProfileImagePreview(
                    newProfileImage
                )
            }

        } catch (error) {

            console.error(error)

            tm('Unable to update profile')

        } finally {

            setSaving(false)

        }
    }

    const handleProfileImage = (e) => {

        const file = e.target.files[0]

        if (!file) {
            return
        }


        if (!file.type.startsWith('image/')) {

            tm('Please select an image')

            return
        }


        setProfileImage(file)


        const preview = URL.createObjectURL(file)

        setProfileImagePreview(preview)

    }

    const cancelChanges = (e) => {

        e.preventDefault()

        setUser(tUser)

        setProfileImage(null)

        setProfileImagePreview(
            tUser.profileImage || ''
        )

    }


    return (
        <>
            <div id='sp_heading'>
                <p>
                    {'Settings|Profile'}
                </p>
            </div>
            <form onSubmit={(e) => {

                e.preventDefault()

                if (!saving && edited) {
                    saveProfile()
                }
            }}>

                <div id='sp_img_entrys'>

                    <label htmlFor='sp_profile_image'>

                        <img
                            src={
                                profileImagePreview || udp
                            }
                            alt='user_image'
                            id='sp_image'
                        />

                    </label>


                    <input
                        type='file'
                        id='sp_profile_image'
                        accept='image/*'
                        style={{
                            display: 'none'
                        }}
                        onChange={handleProfileImage}
                    />

                </div>

                <div className='sp_entry_box'>

                    <label htmlFor='sp_name'>
                        Name:
                    </label>


                    <div className='sp_input'>

                        <input
                            type='text'
                            id='sp_name'

                            value={
                                User.name || ''
                            }

                            readOnly={
                                !nameEdit
                            }

                            onChange={(e) => {

                                setUser({
                                    ...User,
                                    name: e.target.value
                                })

                            }}
                        />


                        <div
                            className={`sp_edit_button ${nameEdit
                                ? 'sp_edit_button_active'
                                : ''
                                }`}

                            onClick={(e) => {

                                e.preventDefault()

                                setNameEdit(
                                    (p) => !p
                                )

                            }}
                        >

                            <img
                                src={
                                    nameEdit
                                        ? edit_active
                                        : edit
                                }
                                alt='edit_icon'
                                className='sp_edit_icon'
                            />

                        </div>

                    </div>

                </div>

                <div className='sp_entry_box'>

                    <label htmlFor='sp_company'>
                        Company:
                    </label>


                    <div className='sp_input'>

                        <input
                            type='text'
                            id='sp_company'

                            value={
                                User.companyName || ''
                            }

                            readOnly={
                                !companyEdit
                            }

                            onChange={(e) => {

                                setUser({
                                    ...User,
                                    companyName:
                                        e.target.value
                                })

                            }}
                        />


                        <div
                            className={`sp_edit_button ${companyEdit
                                ? 'sp_edit_button_active'
                                : ''
                                }`}

                            onClick={(e) => {

                                e.preventDefault()

                                setCompanyEdit(
                                    (p) => !p
                                )

                            }}
                        >

                            <img
                                src={
                                    companyEdit
                                        ? edit_active
                                        : edit
                                }
                                alt='edit_icon'
                                className='sp_edit_icon'
                            />

                        </div>

                    </div>

                </div>

                <div className='sp_entry_box'>

                    <label htmlFor='sp_email'>
                        Email:
                    </label>


                    <div className='sp_input'>

                        <input
                            type='email'
                            id='sp_email'

                            value={
                                User.email || ''
                            }

                            readOnly={
                                !emailEdit
                            }

                            onChange={(e) => {

                                setUser({
                                    ...User,
                                    email: e.target.value
                                })

                            }}
                        />


                        <div
                            className={`sp_edit_button ${emailEdit
                                ? 'sp_edit_button_active'
                                : ''
                                }`}

                            onClick={(e) => {

                                e.preventDefault()

                                setEmailEdit(
                                    (p) => !p
                                )

                            }}
                        >

                            <img
                                src={
                                    emailEdit
                                        ? edit_active
                                        : edit
                                }
                                alt='edit_icon'
                                className='sp_edit_icon'
                            />

                        </div>

                    </div>

                </div>

                <div className='sp_entry_box'>

                    <label htmlFor='sp_phone'>
                        phone:
                    </label>


                    <div className='sp_input'>

                        <input
                            type='text'
                            id='sp_phone'

                            value={
                                User.phone || ''
                            }

                            readOnly={
                                !phoneEdit
                            }

                            onChange={(e) => {

                                const value =
                                    e.target.value.replace(/\D/g, '')

                                setUser({
                                    ...User,
                                    phone: value
                                })

                            }}
                        />


                        <div
                            className={`sp_edit_button ${phoneEdit
                                ? 'sp_edit_button_active'
                                : ''
                                }`}

                            onClick={(e) => {

                                e.preventDefault()

                                setPhoneEdit(
                                    (p) => !p
                                )

                            }}
                        >

                            <img
                                src={
                                    phoneEdit
                                        ? edit_active
                                        : edit
                                }
                                alt='edit_icon'
                                className='sp_edit_icon'
                            />

                        </div>

                    </div>

                </div>

                <div className='sp_entry_box'>

                    <div className='sp_input'>

                        <label htmlFor='sp_about'>
                            About yourself:
                        </label>


                        <div
                            className={`sp_edit_button ${aboutEdit
                                ? 'sp_edit_button_active'
                                : ''
                                }`}

                            onClick={(e) => {

                                e.preventDefault()

                                setAboutEdit(
                                    (p) => !p
                                )

                            }}
                        >

                            <img
                                src={
                                    aboutEdit
                                        ? edit_active
                                        : edit
                                }
                                alt='edit_icon'
                                className='sp_edit_icon'
                            />

                        </div>

                    </div>


                    <textarea
                        id='sp_about'
                        maxLength={150}

                        value={
                            User.about || ''
                        }

                        readOnly={
                            !aboutEdit
                        }

                        onChange={(e) => {

                            setUser({
                                ...User,
                                about: e.target.value
                            })

                        }}
                    />

                </div>

                <div className='sp_button_box'>

                    <button
                        type='submit'
                        disabled={saving || !edited}
                        className={`sp_save_button ${edited && !saving
                            ? 'sp_save_button_active'
                            : ''
                            }`}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>


                    <button
                        id='sp_cancel_button'
                        onClick={cancelChanges}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </>
    )
}

export default SettingsProfile
