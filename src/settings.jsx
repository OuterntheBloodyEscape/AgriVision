import './settings.css'
import priv_img from './assets/nav_icons/previous.png'
import gair_img from './assets/nav_icons/gair.png'
import SettingsProfile from './settings_profile'
import Security from './security'
import { useState } from 'react'

const SettingsPage = ({ cdp, tm }) => {
    const [settingsPage, setSettingsPage] = useState(0);
    return (<>
        <div id='settings_body'>
            <div id='settings_body_left'>
                <div id='set_back' >
                    <div id='set_back_button' onClick={() => { cdp(0) }}>
                        <img src={priv_img} alt="back_page" className='set_nav_img' />
                    </div>
                    <div id='settings_page_icon_div'>
                        <img src={gair_img} alt="gair_icon" className='set_nav_img' />
                    </div>
                </div>
                <div id='set_nav'>
                    <button className={`set_nav_button ${(settingsPage == 0) ? ('set_nav_button_active') : ('')}`} onClick={() => { setSettingsPage(0) }}>Profile</button>
                    <button className={`set_nav_button ${(settingsPage == 1) ? ('set_nav_button_active') : ('')}`} onClick={() => { setSettingsPage(1) }}>Security</button>
                </div>
            </div>
            <div id='settings_body_right'>
                {
                    (() => {
                        switch (settingsPage) {
                            case 0:
                                return <SettingsProfile tm={tm} />
                                break;
                            case 1:
                                return <Security tm={tm} />
                                break;
                        }
                    })()
                }

            </div>
        </div >
    </>)
}

export default SettingsPage