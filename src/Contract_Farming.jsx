import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Contract_Farming.css'
import star from './assets/star.png'
import list_search from './assets/nav_icons/list_search.png'
import Contract_ViewDetails from './Contract_ViewDetails.jsx'
import Contract_ApplyForm from './Contract_ApplyForm.jsx'

let Contract_Farming = ({ tm }) => {
    const [contracts, setContracts] = useState([])
    const [selectedContract, setSelectedContract] = useState(null)
    const [popupType, setPopupType] = useState('')
    const [proposedPrice, setProposedPrice] = useState('')
    const [applicationMessage, setApplicationMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [ratingStars, setRatingStars] = useState(5)
    const [ratingComment, setRatingComment] = useState('')
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false)
    const setPage = useNavigate()
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/check-login', {
                    method: 'GET',
                    credentials: 'include',
                })
                await res.json()

                if (res.status === 401) {
                    setPage('/login_page', { replace: true })
                } else if (!res.ok) {
                    tm('Unable to verify your login session')
                }
            } catch (error) {
                console.error('Contract Farming login check error:', error)
                tm('Unable to connect to the server')
            }
        }

        checkLogin()
    }, [setPage, tm])

    useEffect(() => {
        const loadContracts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/contracts', { credentials: 'include' })
                const data = await response.json()
                if (!response.ok) throw new Error(data.message || 'Unable to load contracts')
                setContracts(data.contracts || [])
            } catch (error) {
                console.error('Contract list error:', error)
                tm(error.message || 'Unable to load contracts')
            }
        }

        loadContracts()
    }, [tm])

    const openApplyPopup = (contract) => {
        setSelectedContract(contract)
        setProposedPrice(String(contract.price))
        setApplicationMessage('')
        setPopupType('apply')
    }

    const openDetailsPopup = async (contract) => {
        try {
            const response = await fetch(`http://localhost:5000/api/contracts/${contract._id}`, { credentials: 'include' })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Unable to load contract details')
            setSelectedContract(data.contract)
            setPopupType('details')
        } catch (error) {
            console.error('Contract details error:', error)
            tm(error.message || 'Unable to load contract details')
        }
    }

    const submitRating = async () => {
        if (!selectedContract || isRatingSubmitting) return
        setIsRatingSubmitting(true)
        try {
            const response = await fetch(`http://localhost:5000/api/contracts/${selectedContract._id}/ratings`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars: ratingStars, comment: ratingComment })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Unable to submit rating')
            tm(data.message)
            setSelectedContract((current) => current ? { ...current, canRate: false, myRating: { stars: ratingStars, comment: ratingComment }, ratingCount: (current.ratingCount || 0) + 1 } : current)
            setRatingComment('')
        } catch (error) {
            console.error('Contract rating error:', error)
            tm(error.message || 'Unable to submit rating')
        } finally {
            setIsRatingSubmitting(false)
        }
    }

    const submitApplication = async (event) => {
        event.preventDefault()
        if (!selectedContract || isSubmitting) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`http://localhost:5000/api/contracts/${selectedContract._id}/applications`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposedPrice, message: applicationMessage })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Unable to send application')
            tm(data.message)
            setPopupType('')
            setSelectedContract(null)
        } catch (error) {
            console.error('Contract application error:', error)
            tm(error.message || 'Unable to send application')
        } finally {
            setIsSubmitting(false)
        }
    }

    const closePopup = () => {
        setPopupType('')
        setSelectedContract(null)
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredContracts = contracts.filter((contract) => {
        if (!normalizedSearchTerm) return true
        return [contract.title, contract.ownerName, contract.unit, contract.moreInfo]
            .some((value) => String(value || '').toLowerCase().includes(normalizedSearchTerm))
    })

    return (
        <>
            <div id='Contract_Farming_others_root'>
                <div id='Contract_Farming_others_top'>
                    <div id='cf_search_div'>
                        <input
                            type="search"
                            placeholder='Search List...'
                            id='cf_search_input'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <div id='cf_search_button_div'>
                            <img src={list_search} alt="list_search" height={30} width={30} />
                        </div>
                    </div>
                    <div id='cf_others_div'>
                        <button id='cf_my_list_button' onClick={() => { setPage('/main_page/contract_farming_my') }}>My List</button>
                        <div id='cf_sort'></div>
                    </div>
                </div>
                <div id='Contract_Farming_others_bottom'>
                    <div id='Contract_Farming_others_bottom_heading'><p>{`Available Contracts (${filteredContracts.length})`}</p></div>
                    <div id='Contract_Farming_others_bottom_cc'>
                        {
                            filteredContracts.map((contract) => (
                                <div className='CFC_div' key={contract._id}>
                                    <div className='CFC_info_div'>
                                        <h2>{contract.title}</h2>
                                        <h4>Owner: {contract.ownerName}</h4>
                                        <h4>Need: {contract.need} {contract.unit}</h4>
                                        <h4>Price: {contract.price} tk/{contract.unit}</h4>
                                        <h4>Delivery: {contract.delivery}</h4>
                                        <div className='rating_div'>
                                            <img src={star} alt="rating_star" className='rating_icon' />
                                            <span>
                                                {contract.ratingCount > 0
                                                    ? `${Number(contract.ratingAverage).toFixed(1)} (${contract.ratingCount})`
                                                    : 'No ratings yet'
                                                }
                                            </span>
                                        </div>
                                        <div className="CFM_contact_info">
                                            <p><strong>Phone:</strong> {contract.ownerPhone || "Not provided"}</p>
                                            <p><strong>Email:</strong> {contract.ownerEmail || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className='cf_button_div'>
                                        <button className='cf_more_info' onClick={() => openDetailsPopup(contract)}>View Details</button>
                                        <button className='cf_apply_button' onClick={() => openApplyPopup(contract)}>Place a Bid</button>
                                    </div>
                                </div>
                            ))
                        }
                        {filteredContracts.length === 0 && <p className='cf_no_results'>No matching contracts found.</p>}
                    </div>

                </div>
                {popupType && selectedContract && (
                    popupType === 'details'
                        ? <Contract_ViewDetails
                            contract={selectedContract}
                            onClose={closePopup}
                            onApply={openApplyPopup}
                            ratingStars={ratingStars}
                            ratingComment={ratingComment}
                            isRatingSubmitting={isRatingSubmitting}
                            onRatingStarsChange={setRatingStars}
                            onRatingCommentChange={setRatingComment}
                            onSubmitRating={submitRating}
                        />
                        : <Contract_ApplyForm
                            contract={selectedContract}
                            proposedPrice={proposedPrice}
                            applicationMessage={applicationMessage}
                            isSubmitting={isSubmitting}
                            onClose={closePopup}
                            onPriceChange={(event) => setProposedPrice(event.target.value)}
                            onMessageChange={(event) => setApplicationMessage(event.target.value)}
                            onSubmit={submitApplication}
                        />
                )}
                <div id='Contract_Farming_end'></div>
            </div>
        </>
    );
}

export default Contract_Farming