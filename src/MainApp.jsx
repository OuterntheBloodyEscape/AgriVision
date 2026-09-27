import './MainApp.css'
import { Routes, Route, useNavigate, useLocation, Navigate, replace } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import downArrow from './assets/nav_icons/down_arrow.png'
import webIcon from './assets/webIcon.png'
import AI_Disease_Detection from './AI_Disease_Detection.jsx'
import Contract_Farming from './Contract_Farming.jsx'
import Dashboard from './Dashboard.jsx'
import Contract_Farming_my from './Contract_Farming_my.jsx'
import Live_MarketPrices from './Live_MarketPrices.jsx'
import TopNav from './top_nav.jsx'
import SettingsPage from './settings.jsx'
import AI_Assistant from './AI_Assistant.jsx'
import SearchPage from './Search_page.jsx'
import Map_weather from './map_weather.jsx'

let MainApp = ({ tm }) => {
    const nev = useNavigate()
    const pathlocation = useLocation()
    let pathName = pathlocation.pathname
    const [menuActive, setMenu] = useState(false);
    const [nightMood, setNightMood] = useState(false);
    const [isSearchPage, setSearchPage] = useState(false);
    const [DefaultPopupPage, callDefaultPopupPage] = useState(0);
    const [isBigPicture, setBigPicture] = useState(false);
    const [bigPictureLink, setBigPictureLink] = useState('');
    const [isSubnavOpen, setSubnavOpen] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('night-mode', nightMood)
    }, [nightMood])

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getProfileInfo', {
                    credentials: 'include'
                })
                if (response.ok) {
                    const user = await response.json()
                    setNightMood(user.nightMood === true)
                } else if (response.status !== 401) {
                    tm('Unable to load theme preference')
                }
            } catch (error) {
                console.error('Unable to load theme preference', error)
                tm('Unable to load theme preference')
            }
        }

        loadTheme()
    }, [])

    const toggleNightMood = async () => {
        const nextNightMood = !nightMood
        setNightMood(nextNightMood)

        try {
            const response = await fetch('http://localhost:5000/api/updateTheme', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nightMood: nextNightMood })
            })
            if (!response.ok) {
                tm('Unable to save theme preference')
            }
        } catch (error) {
            console.error('Unable to save theme preference', error)
            tm('Unable to save theme preference')
        }
    }
    const mainSubPageLink = ['/main_page/home', '/main_page/ai_disease_detection', '/main_page/map', '/main_page/contract_farming', '/main_page/live_market_prices', '/main_page/ai_assistant']
    let onMenuClick = () => {
        setMenu((currentState) => !currentState)
    }

    const checkInMarket = () => {
        return (pathName == mainSubPageLink[3]) || (pathName == mainSubPageLink[4]) || (pathName == '/main_page/contract_farming_my')
    }
    const checkInAi = () => {
        return (pathName == mainSubPageLink[1]) || (pathName == mainSubPageLink[5])
    }
    const subnavItems = checkInMarket()
        ? [
            { label: 'Live Market Prices', path: mainSubPageLink[4] },
            { label: 'Contract Farming', path: mainSubPageLink[3] }
        ]
        : checkInAi()
            ? [
                { label: 'AI Disease Detection', path: mainSubPageLink[1] },
                { label: 'AI Assistant', path: mainSubPageLink[5] }
            ]
            : [];
    const selectedSubnavItem = subnavItems.find((item) => item.path == pathName);
    return (
        <>
            <div id='main_app_root' className={`${nightMood ? 'night-mode' : ''} ${menuActive ? 'menu-open' : ''} ${DefaultPopupPage > 0 ? 'popup-open' : ''}`}>
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
                    <div id='ai_icon_container' onClick={() => { nev(mainSubPageLink[1]); }} className={`iconContainer ${(checkInAi()) ? "active" : ""}`}>
                        <img src={(checkInAi()) ? (ai_a) : (ai_ia)} alt="ai_icon" className='icon' draggable={false} />
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
                        <div id='moon_icon_container' onClick={toggleNightMood} className={`iconContainer ${(nightMood) ? "active" : ""}`}>
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
                                {subnavItems.map((item) => (
                                    <button
                                        key={item.path}
                                        className={`P2_2_1_button ${item.path == pathName ? 'selectedSubnavButton' : ''}`}
                                        onClick={() => { nev(item.path) }}
                                        aria-pressed={item.path == pathName}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            {subnavItems.length > 0 && (
                                <div className='subnavMobile'>
                                    <button
                                        className='P2_2_1_button subnavMobileButton'
                                        onClick={() => { setSubnavOpen((currentState) => !currentState) }}
                                        aria-expanded={isSubnavOpen}
                                    >
                                        <span>{selectedSubnavItem?.label}</span>
                                        <img src={downArrow} alt='' className='subnavMobileArrow' draggable={false} />
                                    </button>
                                    {isSubnavOpen && (
                                        <div className='subnavMobileMenu'>
                                            {subnavItems.map((item) => (
                                                <button
                                                    key={item.path}
                                                    className={`P2_2_1_button ${item.path == pathName ? 'selectedSubnavButton' : ''}`}
                                                    onClick={() => { nev(item.path); setSubnavOpen(false) }}
                                                    aria-pressed={item.path == pathName}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div id='main_app_p2_top_p2_2'>
                                <TopNav setSearchP={setSearchPage} setSettingsP={callDefaultPopupPage} tm={tm} />
                            </div>
                        </div>

                    </div>
                    <div id='main_app_p2_body'>
                        <Routes>
                            <Route path='/' element={<Navigate to={'/main_page/home'} replace />} />
                            <Route path='home' element={<Dashboard />} />
                            <Route path='ai_disease_detection' element={<AI_Disease_Detection ibp={setBigPicture} bpl={setBigPictureLink} tm={tm} />} />
                            <Route path='ai_assistant' element={<AI_Assistant />} />
                            <Route path='map' element={<Map_weather />} />
                            <Route path='contract_farming' element={<Contract_Farming tm={tm} />} />
                            <Route path='contract_farming_my' element={<Contract_Farming_my tm={tm} />} />
                            <Route path='live_market_prices' element={<Live_MarketPrices />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <div className={`Search_page_container ${(isSearchPage) ? ("pageActive") : ("")}`} onClick={() => { setSearchPage(false) }}>
                <SearchPage ssp={setSearchPage} />
            </div>
            <div className={`big_picture ${(isBigPicture) ? ("pageActive") : ("")}`} onClick={() => { setBigPicture(false) }}>
                <div id='big_picture_container' onClick={(v) => v.stopPropagation()}>
                    <img src={bigPictureLink} alt="big-picture" height={600} width={600} />
                </div>
            </div>
            <div className={`av_default_popup ${(DefaultPopupPage > 0) ? ("pageActive") : ("")}`}>
                <div id='popup_container'>
                    {DefaultPopupPage === 1 && <SettingsPage cdp={callDefaultPopupPage} tm={tm} />}
                </div>
            </div>
        </>
    );
}
export default MainApp