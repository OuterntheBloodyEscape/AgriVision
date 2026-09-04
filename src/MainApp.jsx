import './MainApp.css'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import homeIcon_ia from './assets/nav_icons/home_inactive.png'
import homeIcon_a from './assets/nav_icons/home_active.png'
import ai_ia from './assets/nav_icons/robot_inactive.png'
import ai_a from './assets/nav_icons/robot_active.png'
import menu_ia from './assets/nav_icons/menu_dots_inactive.png'
import menu_a from './assets/nav_icons/menu_dots_active.png'
import map_ia from './assets/nav_icons/map_inactive.png'
import map_a from './assets/nav_icons/map_active.png'
import market_ia from './assets/nav_icons/online-shop-inactive.png'
import market_a from './assets/nav_icons/online-shop-active.png'
import moon_ia from './assets/nav_icons/moon_inactive.png'
import moon_a from './assets/nav_icons/moon_active.png'
import webIcon from './assets/webIcon.png'
import search_ia from './assets/nav_icons/search_inactive.png'
import AI_Disease_Detection from './AI_Disease_Detection.jsx'
import Contract_Farming from './Contract_Farming.jsx'
import Dashboard from './Dashboard.jsx'
import Contract_Farming_my from './Contract_Farming_my.jsx'
import Live_MarketPrices from './Live_MarketPrices.jsx'
import TopNav from './top_nav.jsx'
import Contract_addForm from './Contract_addForm.jsx'
import SettingsPage from './settings.jsx'

let MainApp = () => {
    const nev = useNavigate()
    const pathlocation = useLocation()
    let pathName = pathlocation.pathname
    const [menuActive, setMenu] = useState(false);
    const [nightMood, setNightMood] = useState(false);
    const [isSearchPage, setSearchPage] = useState(false);
    const [DefaultPopupPage, callDefaultPopupPage] = useState(0);
    const [isBigPicture, setBigPicture] = useState(false);
    const [bigPictureLink, setBigPictureLink] = useState('');
    const mainSubPageLink = ['/main_page/home', '/main_page/ai_disease_detection', '/main_page/map', '/main_page/contract_farming', '/main_page/live_market_prices']
    let onMenuClick = () => {
        setMenu((v) => (!v))
        // console.log(menuActive)
        document.getElementById("main_app_p1").style.width = ((!menuActive) ? ("120px") : ("60px"))
        let displayState = ((!menuActive) ? ("block") : ("none"))
        let displaySize = ((!menuActive) ? ("92px") : ("36px"))
        let it = document.getElementsByClassName("iconTxt")
        it[5].style.display = it[4].style.display = it[3].style.display = it[2].style.display = it[1].style.display = it[0].style.display = displayState
        let ic = document.getElementsByClassName("iconContainer")
        ic[5].style.width = ic[4].style.width = ic[3].style.width = ic[2].style.width = ic[1].style.width = ic[0].style.width = displaySize
    }

    const checkInMarket = () => {
        return (pathName == mainSubPageLink[3]) || (pathName == mainSubPageLink[4]) || (pathName == '/main_page/contract_farming_my')
    }
    return (
        <>
            <div id='main_app_root'>
                <div id='main_app_p1'>
                    <div id='menu_icon_container' onClick={onMenuClick} className={`iconContainer ${(menuActive) ? "active" : ""}`}>
                        <img src={(menuActive) ? (menu_a) : (menu_ia)} alt="menu_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Menu</p></div>
                        <div className={`hintTxtcontainer ${(!menuActive) ? "menu_hint" : ""}`}><p className='hintTxt'>Menu</p></div>
                    </div>
                    <div id='home_icon_container' onClick={() => { nev(mainSubPageLink[0]) }} className={`iconContainer ${(pathName == mainSubPageLink[0]) ? "active" : ""}`}>
                        <img src={(pathName == mainSubPageLink[0]) ? (homeIcon_a) : (homeIcon_ia)} alt="home_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Home</p></div>
                        <div className={`hintTxtcontainer ${(!menuActive) ? "home_hint" : ""}`}><p className='hintTxt'>Home</p></div>
                    </div>
                    <div id='ai_icon_container' onClick={() => { nev(mainSubPageLink[1]); }} className={`iconContainer ${(pathName == mainSubPageLink[1]) ? "active" : ""}`}>
                        <img src={(pathName == mainSubPageLink[1]) ? (ai_a) : (ai_ia)} alt="ai_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>AI</p></div>
                        <div className={`hintTxtcontainer ${(!menuActive) ? "ai_hint" : ""}`}><p className='hintTxt'>AI</p></div>
                    </div>
                    <div id='map_icon_container' onClick={() => { nev(mainSubPageLink[2]); }} className={`iconContainer ${(pathName == mainSubPageLink[2]) ? "active" : ""}`}>
                        <img src={(pathName == mainSubPageLink[2]) ? (map_a) : (map_ia)} alt="map_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Map</p></div>
                        <div className={`hintTxtcontainer ${(!menuActive) ? "map_hint" : ""}`}><p className='hintTxt'>Map</p></div>
                    </div>
                    <div id='market_icon_container' onClick={() => { nev(mainSubPageLink[4]); }} className={`iconContainer ${(checkInMarket()) ? "active" : ""}`}>
                        <img src={(checkInMarket()) ? (market_a) : (market_ia)} alt="market_icon" className='icon' draggable={false} />
                        <div className='iconTxtcontainer'><p className='iconTxt'>Market</p></div>
                        <div className={`hintTxtcontainer ${(!menuActive) ? "market_hint" : ""}`}><p className='hintTxt'>Market</p></div>
                    </div>
                    <div id='main_app_p1_bottom'>
                        <div id='moon_icon_container' onClick={() => { setNightMood((currentState) => (!currentState)) }} className={`iconContainer ${(nightMood) ? "active" : ""}`}>
                            <img src={(nightMood) ? (moon_a) : (moon_ia)} alt="moon_icon" className='icon' draggable={false} />
                            <div className='iconTxtcontainer'><p className='iconTxt'>Night</p></div>
                            <div className={`hintTxtcontainer ${(!menuActive) ? "night_hint" : ""}`}><p className='hintTxt'>Night Mood</p></div>
                        </div>
                    </div>
                </div>
                <div id='main_app_p2'>
                    <div id='main_app_p2_top'>
                        <a href='/MainPage' id='av_title_link'>
                            <div id='main_app_p2_top_p1'>
                                <img src={webIcon} alt='web_icon' id='webIcon' />
                                <h2>AgriVision</h2>
                            </div>
                        </a>
                        <div id='main_app_p2_top_p2'>
                            <div id='main_app_p2_top_p2_1'>
                                {(checkInMarket()) ? (
                                    <>
                                        <button className='P2_2_1_button' onClick={() => { nev(mainSubPageLink[4]) }}>Live Market Prices</button>
                                        <button className='P2_2_1_button' onClick={() => { nev(mainSubPageLink[3]) }}>Contract Farming</button>

                                    </>
                                ) : (<></>)}

                            </div>
                            <div id='main_app_p2_top_p2_2'>
                                <TopNav setSearchP={setSearchPage} setSettingsP={callDefaultPopupPage} />
                            </div>
                        </div>

                    </div>
                    <div id='main_app_p2_body'>
                        <Routes>
                            <Route path='/' element={<Navigate to={'/main_page/home'} replace />} />
                            <Route path='home' element={<Dashboard />} />
                            <Route path='ai_disease_detection' element={<AI_Disease_Detection ibp={setBigPicture} bpl={setBigPictureLink} />} />
                            <Route path='map' element={<></>} />
                            <Route path='contract_farming' element={<Contract_Farming />} />
                            <Route path='contract_farming_my' element={<Contract_Farming_my cdp={callDefaultPopupPage} />} />
                            <Route path='live_market_prices' element={<Live_MarketPrices />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <div className={`Search_page ${(isSearchPage) ? ("pageActive") : ("")}`} onClick={() => { setSearchPage(false) }}>
                <div id='search_container' onClick={(v) => v.stopPropagation()}>
                    <input type='search' placeholder='Search...' id='search_bar' />
                    <div id='search_button'>
                        <img src={search_ia} alt="search_icon" height={20} width={20} />
                    </div>
                </div>
            </div>
            <div className={`big_picture ${(isBigPicture) ? ("pageActive") : ("")}`} onClick={() => { setBigPicture(false) }}>
                <div id='big_picture_container' onClick={(v) => v.stopPropagation()}>
                    <img src={bigPictureLink} alt="big-picture" height={600} width={600} />
                </div>
            </div>
            <div className={`av_default_popup ${(DefaultPopupPage > 0) ? ("pageActive") : ("")}`}>
                <div id='popup_container'>
                    {
                        (() => {
                            switch (DefaultPopupPage) {
                                case 1:
                                    return (<SettingsPage cdp={callDefaultPopupPage} />)
                                case 2:
                                    return (<Contract_addForm cdp={callDefaultPopupPage} />)
                                default:
                                    return (<></>)
                            }
                        })()
                    }
                </div>
            </div>
        </>
    );
}
export default MainApp