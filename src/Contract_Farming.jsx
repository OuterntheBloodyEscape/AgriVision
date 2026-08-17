import { useState } from 'react'
import './Contract_Farming.css'
import list_search from './assets/nav_icons/list_search.png'
import rating from './assets/star.png'

let Contract_Farming = () => {
    const [Card_Titel, setCardTitle] = useState(["Need Tomato", "Mango Required", "Alu Needed", "Rice Required", "Cucumber Needed", "Banana Needed", "Banana Needed", "Banana Needed", "Banana Needed", "Banana Needed", "Rice Required", "Rice Required", "Rice Required", "Rice Required"]);
    const [Companys, setCompanys] = useState(["ABC", "XYZ", "potato", "AgroMart", "Fresh BD", "AgroMart", "AgroMart", "AgroMart", "AgroMart", "AgroMart", "ABC", "ABC", "ABC", "ABC"]);
    const [amount, setAmount] = useState(["100", "50", "1000", "2000", "200", "120", "200", "200", "200", "200", "1000", "1000", "1000", "1000"]);
    const [price, setPrice] = useState(["50", "70", "30", '60', '30', '120', '60', '60', '60', '60', '90', '80', '80', '72']);
    const [Card_rating, setRating] = useState(["4.8", "4.5", "4.7", "3.9", "4.2", "4.5", "4.2", "4.2", "4.2", "4.2", "4.7", "4.2", "4.5", "3.7"]);

    return (
        <>
            <div id='Contract_Farming_others_root'>
                <div id='Contract_Farming_others_top'>
                    <div id='search_div'>
                        <input type="search" placeholder='Search List...' id='cf_search_input' />
                        <div id='list_search_div'>
                            <img src={list_search} alt="list_search" height={30} width={30} />
                        </div>
                    </div>
                    <div id='cf_others_div'>
                        <button id='My_list_button'>My List</button>
                        <div id='cf_sort'></div>
                    </div>
                </div>
                <div id='Contract_Farming_others_bottom'>
                    <div id='Contract_Farming_others_bottom_heading'><p>Available Contracts</p></div>
                    <div id='Contract_Farming_others_bottom_cc'>
                        {
                            Card_Titel.map((c, i) => (
                                <div className='CFC_div'>
                                    <div className='CFC_info_div'>
                                        <h2>{c}</h2>
                                        <h4>{`Company: ${Companys[i]}`}</h4>
                                        <h4>{`Need: ${amount[i]}kg`}</h4>
                                        <h4>{`Price: ${price[i]}৳/kg`}</h4>
                                        <h4>{`Delivery: December 2026`}</h4>
                                        <div className='rating_div'>
                                            <img src={rating} alt="rating" className='rating_icon' />
                                            <p>{`${Card_rating[i]}/5`}</p>
                                        </div>
                                    </div>
                                    <div className='cf_button_div'>
                                        <button className='cf_more_info'>View Details</button>
                                        <button className='cf_apply_button'>Apply for Contract</button>
                                    </div>
                                </div>))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contract_Farming