import './top_nav.css'
import settings_ia from './assets/nav_icons/settings_inactive.png'
import search_ia from './assets/nav_icons/search_inactive.png'
import userP from './assets/nav_icons/user.png'
import { useEffect, useState } from 'react'

const TopNav = ({ setSettingsP, setSearchP, tm }) => {
    const [uname, setUName] = useState('')
    const [uphoto, setUphoto] = useState('')
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/getProfileInfo', {
                    method: 'GET',
                    credentials: 'include',
                })
                if (!res.ok) {
                    tm('Unable to load profile information')
                    return
                }
                const cuser = await res.json()
                setUName(cuser.name || '')
                setUphoto(cuser.profileImage || '')
            } catch (error) {
                console.error('Unable to load profile information', error)
                tm('Unable to load profile information')
            }
        }

        fetchProfile()
    }, [tm])

    return (<>
        <div className='iconContainer2' onClick={() => { setSettingsP(1) }}>
            <img src={settings_ia} alt="settings_icon" draggable={false} className='icon2' />
        </div>
        <div className='iconContainer2' onClick={() => { setSearchP(true) }}>
            <img src={search_ia} alt="search_icon" draggable={false} className='icon2' />
        </div>
        <div id='profile_Container'>
            <div className='iconContainer2'>
                <img src={(uphoto == '') ? (userP) : (uphoto)} alt="user_icon" draggable={false} className='icon2' />
            </div>
            <div className='profile_section'>
                <p id='uname_text'>{uname.substring(0, (uname.length > 12) ? (12) : (uname.length))}</p>
            </div>
        </div>
    </>);
}

export default TopNav