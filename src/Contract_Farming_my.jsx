import './Contract_Farming_my.css'
import { useState } from 'react'
import list_search from './assets/nav_icons/list_search.png'
import rating from './assets/star.png'
import atl from './assets/nav_icons/add-to-list.png'
import down_icon from './assets/nav_icons/down_arrow.png'
import up_icon from './assets/nav_icons/up_arrow.png'


const Contract_Farming_my = ({ cdp }) => {

    const [topBoxState, setTopBoxState] = useState(false);
    const [bottomBoxState, setBottomBoxState] = useState(false);


    return (
        <>
            <div id='CFM_root'>
                <div id='CFM_top'>
                    <div id='CFM_search_div'>
                        <input type="search" placeholder='Search List...' id='CFM_search_input' />
                        <div id='CFM_search_button_div' >
                            <img src={list_search} alt="list_search" height={30} width={30} />
                        </div>
                    </div>
                    <div id='CFM_others_div'>
                        <div id='CFM_sort'></div>
                    </div>
                </div>
                <div id='Contract_Farming_my_bottom'>
                    <div id='Contract_Farming_myContract'>
                        <div className='Contract_Farming_my_heading'>
                            <p className={`Contract_Farming_my_heading_text ${(topBoxState) ? 'fold_Contract_Farming_my_fs' : ''}`}>My Contract</p>
                            <div className='Contract_Farming_my_fold_button' onClick={() => { setTopBoxState((p) => (!p)) }}>
                                <img src={((topBoxState) ? down_icon : up_icon)} alt='down_icon' height={30} width={30}></img>
                            </div>
                        </div>
                        <div className={`Contract_Farming_my_cc ${(topBoxState) ? 'fold_Contract_Farming_my_CC' : ''}`}>
                            <div className='Contract_Farming_my_card'>
                                <div className='Contract_Farming_my_card_info'>
                                    <h2>{`Mango Required`}</h2>
                                    <h4>{`Company: ABC`}</h4>
                                    <h4>{`Need: 100kg`}</h4>
                                    <h4>{`Price: 120৳/kg`}</h4>
                                    <h4>{`Delivery: December 2026`}</h4>
                                    <div className='rating_div'>
                                        <img src={rating} alt="rating" className='rating_icon' />
                                        <p>{`4/5`}</p>
                                    </div>
                                </div>
                                <div className='Contract_Farming_my_card_button_div'>
                                    <button className='Contract_Farming_my_card_button'>View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='Contract_Farming_myAddedContract'>
                        <div className='Contract_Farming_my_heading'>
                            <p className={`Contract_Farming_my_heading_text ${(bottomBoxState) ? 'fold_Contract_Farming_my_fs' : ''}`}>My Added Contract</p>
                            <div className='Contract_Farming_my_fold_button' onClick={() => { setBottomBoxState((p) => (!p)) }}>
                                <img src={((bottomBoxState) ? down_icon : up_icon)} alt='up_icon' height={30} width={30}></img>
                            </div>
                        </div>
                        <div className={`Contract_Farming_my_cc ${(bottomBoxState) ? 'fold_Contract_Farming_my_CC' : ''}`}>
                            <div className='Contract_Farming_my_card'>
                                <div className='Contract_Farming_my_card_info'>
                                    <h2>{`Mango Required`}</h2>
                                    <h4>{`Company: ABC`}</h4>
                                    <h4>{`Need: 100kg`}</h4>
                                    <h4>{`Price: 120৳/kg`}</h4>
                                    <h4>{`Delivery: December 2026`}</h4>
                                    <div className='rating_div'>
                                        <img src={rating} alt="rating" className='rating_icon' />
                                        <p>{`4/5`}</p>
                                    </div>
                                </div>
                                <div className='Contract_Farming_my_card_button_div'>
                                    <button className='Contract_Farming_my_card_button'>Edit Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='CFM_end'></div>
                <div id='CFM_add_button' onClick={() => { cdp(2) }}>
                    <img src={atl} alt="list_add" height={40} width={40} />
                </div>
            </div>
        </>
    );
}

export default Contract_Farming_my