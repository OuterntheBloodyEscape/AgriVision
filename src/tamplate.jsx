import './tamplate.css'
import { useState } from 'react'
import homeIcon_ia from './assets/nav_icons/home_inactive.png'
import homeIcon_a from './assets/nav_icons/home_active.png'
import ai_ia from './assets/nav_icons/robot_inactive.png'
import ai_a from './assets/nav_icons/robot_active.png'
import menu_ia from './assets/nav_icons/menu_dots_inactive.png'
import menu_a from './assets/nav_icons/menu_dots_active.png'
import map_ia from './assets/nav_icons/map_inactive.png'
import map_a from './assets/nav_icons/map_active.png'
import moon_ia from './assets/nav_icons/moon_inactive.png'
import moon_a from './assets/nav_icons/moon_active.png'
import webIcon from './assets/webIcon.png'
import settings_ia from './assets/nav_icons/settings_inactive.png'
import search_ia from './assets/nav_icons/search_inactive.png'
import userP from './assets/nav_icons/user.png'
import AI_Disease_Detection from './AI_Disease_Detection.jsx'

let MainApp = () => {
    const [mainPage, setMainPage] = useState(0);
    const [menuActive, setMenu] = useState(false);
    const [nightMood, setNightMood] = useState(false);
    let onMenuClick = () => {
        setMenu((currentState) => (!currentState))
        // console.log(menuActive)
        document.getElementById("main_app_p1").style.width = ((!menuActive) ? ("120px") : ("60px"))
        let displayState = ((!menuActive) ? ("block") : ("none"))
        let displaySize = ((!menuActive) ? ("92px") : ("36px"))
        let it = document.getElementsByClassName("iconTxt")
        it[4].style.display = it[3].style.display = it[2].style.display = it[1].style.display = it[0].style.display = displayState
        let ic = document.getElementsByClassName("iconContainer")
        ic[4].style.width = ic[3].style.width = ic[2].style.width = ic[1].style.width = ic[0].style.width = displaySize
    }
    return (
        <>
            <div id='main_app_root'>
                <div id='main_app_p1'>
                    <div id='menu_icon_container' onClick={onMenuClick} className={`iconContainer ${(menuActive) ? "active" : ""}`}>
                        <img src={(menuActive) ? (menu_a) : (menu_ia)} alt="menu_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Menu</p></div>
                        <div className='hintTxtcontainer'><p className='hintTxt'>Menu</p></div>
                    </div>
                    <div onClick={() => { setMainPage(0) }} className={`iconContainer ${(mainPage == 0) ? "active" : ""}`}>
                        <img src={(mainPage == 0) ? (homeIcon_a) : (homeIcon_ia)} alt="home_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Home</p></div>
                        <div className='hintTxtcontainer'><p className='hintTxt'>Home</p></div>
                    </div>
                    <div onClick={() => { setMainPage(1) }} className={`iconContainer ${(mainPage == 1) ? "active" : ""}`}>
                        <img src={(mainPage == 1) ? (ai_a) : (ai_ia)} alt="ai_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>AI</p></div>
                        <div className='hintTxtcontainer'><p className='hintTxt'>AI Activities</p></div>
                    </div>
                    <div onClick={() => { setMainPage(2) }} className={`iconContainer ${(mainPage == 2) ? "active" : ""}`}>
                        <img src={(mainPage == 2) ? (map_a) : (map_ia)} alt="map_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Map</p></div>
                        <div className='hintTxtcontainer'><p className='hintTxt'>Find your map area</p></div>
                    </div>
                    <div id='main_app_p1_bottom'>
                        <div id='moon_icon_container' onClick={() => { setNightMood((currentState) => (!currentState)) }} className={`iconContainer ${(nightMood) ? "active" : ""}`}>
                            <img src={(nightMood) ? (moon_a) : (moon_ia)} alt="moon_icon" className='icon' draggable={false} />
                            <div className='iconTxtcontainer'><p className='iconTxt'>Night</p></div>
                            <div className='hintTxtcontainer'><p className='hintTxt'>Night Mood</p></div>
                        </div>
                    </div>
                </div>
                <div id='main_app_p2'>
                    <dev id='main_app_p2_top'>
                        <div id='main_app_p2_top_p1'><img src={webIcon} alt='web_icon' id='webIcon' /><h2>AgriVision</h2></div>
                        <div id='main_app_p2_top_p2'>
                            <div className='iconContainer2'>
                                <img src={settings_ia} alt="settings_icon" draggable={false} className='icon2' />
                            </div>
                            <div className='iconContainer2'>
                                <img src={search_ia} alt="search_icon" draggable={false} className='icon2' />
                            </div>
                            <div className='iconContainer2'>
                                <img src={userP} alt="user_icon" draggable={false} className='icon2' />
                            </div>
                        </div>
                    </dev>
                    <div id='main_app_p2_body'>
                        {(mainPage == 1) ? (<AI_Disease_Detection />) : (<></>)}
                    </div>
                </div>
            </div>
        </>
    );
}
export default MainApp