import './top_nav.css'
import settings_ia from './assets/nav_icons/settings_inactive.png'
import search_ia from './assets/nav_icons/search_inactive.png'
import userP from './assets/nav_icons/user.png'
import { useState } from 'react'

const TopNav = ({ setSettingsP, setSearchP }) => {
    const [logoutCall, setLogoutCall] = useState(false);
    return (<>
        <div className='iconContainer2' onClick={() => { setSettingsP(1) }}>
            <img src={settings_ia} alt="settings_icon" draggable={false} className='icon2' />
        </div>
        <div className='iconContainer2' onClick={() => { setSearchP(true) }}>
            <img src={search_ia} alt="search_icon" draggable={false} className='icon2' />
        </div>
        <div id='profile_Container'>
            <div className='iconContainer2' onClick={() => { setLogoutCall((p) => (!p)) }}>
                <img src={userP} alt="user_icon" draggable={false} className='icon2' />
            </div>
            <div className={`profile_section ${(logoutCall) ? 'profile_section_show' : ''}`}>
                <button id='logout_button'>Logout</button>
            </div>
        </div>
    </>);
}

export default TopNav