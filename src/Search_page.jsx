import { useEffect, useState } from 'react'
import './Search_page.css'
import search_ia from './assets/nav_icons/search_inactive.png'
import { useNavigate } from 'react-router-dom'

const SearchPage = ({ ssp }) => {
    const nav = useNavigate();
    const mainSubPageLink = ['/main_page/home', '/main_page/ai_disease_detection', '/main_page/ai_assistant', '/main_page/map', '/main_page/contract_farming', '/main_page/live_market_prices']
    const mainSubPageName = ['Home', 'Ai Disease Detection', 'Ai Assistant', 'Map', 'Contract Farming', 'Live Market Prices']
    const searchPageName = ['home', 'ai disease detection', 'ai assistant', 'map', 'contract farming', 'live market prices']
    const [searchText, setSearchText] = useState('');
    const [searchList, addSearchList] = useState([]);

    useEffect(() => {
        let list = [];
        for (let i = 0; i < searchPageName.length; i++) {
            if (searchPageName[i].includes(searchText.toLowerCase())) {
                list.push({
                    name: mainSubPageName[i],
                    link: mainSubPageLink[i]
                })
            }
        }
        addSearchList(list);
    }, [searchText])

    return (<>
        <div id='search_input_container' onClick={(v) => v.stopPropagation()}>
            <input type='search' placeholder='Search...' id='search_bar' onInput={(e) => { setSearchText(e.target.value) }} />
            <div id='search_button'>
                <img src={search_ia} alt="search_icon" height={20} width={20} />
            </div>
        </div>
        <div id='search_foundItem_container' onClick={(v) => v.stopPropagation()}>
            {
                (searchText.length == 0) ? (
                    <div id='no_item_box'>
                        <h3>No item search yet</h3>
                    </div>

                ) : ((searchList.length == 0) ? (
                    <div id='no_item_box'>
                        <h3>No item found</h3>
                    </div>
                ) : ((searchList.map((v, i) => (
                    <div id='search_item_box' key={i} onClick={() => { nav(v.link); ssp(false) }}>
                        <h4 id='search_item_box_text'>{v.name}</h4>
                    </div>
                )))))
            }

        </div>
    </>)
}

export default SearchPage