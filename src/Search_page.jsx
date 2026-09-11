import { useState } from 'react'
import './Search_page.css'
import search_ia from './assets/nav_icons/search_inactive.png'

const SearchPage = () => {

    const [searchText, setSearchText] = useState('');
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
                        <h3>No Item search yet</h3>
                    </div>
                ) : (<></>)
            }
        </div>
    </>)
}

export default SearchPage