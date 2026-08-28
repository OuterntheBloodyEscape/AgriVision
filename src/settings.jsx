import './settings.css'
import priv_img from './assets/nav_icons/previous.png'
import gair_img from './assets/nav_icons/gair.png'
import SettingsProfile from './settings_profile'

const SettingsPage = ({ cdp }) => {
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
                    <button className='set_nav_button'>Profile</button>
                    {/* <button className='set_nav_button'>Appearance</button> */}
                    <button className='set_nav_button'>Security</button>
                </div>
            </div>
            <div id='settings_body_right'>
                <SettingsProfile />
            </div>
        </div>
    </>)
}

export default SettingsPage