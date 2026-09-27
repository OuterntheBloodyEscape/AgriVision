import './Contract_ViewDetails.css'
import remove_page from './assets/nav_icons/delete.png'

const Contract_ViewDetails = ({ contract, onClose, onApply, ratingStars, ratingComment, isRatingSubmitting, onRatingStarsChange, onRatingCommentChange, onSubmitRating }) => {
    return (
        <div className='contract_action_overlay' onClick={onClose}>
            <div className='contract_action_popup' onClick={(event) => event.stopPropagation()}>
                <button className='contract_action_close' onClick={onClose} aria-label='Close popup'>
                    <img src={remove_page} alt='' />
                </button>
                <h2>{contract.title}</h2>
                <p>{contract.moreInfo}</p>
                <div className='contract_action_details'>
                    <strong>Owner:</strong> {contract.ownerName}
                    <strong>Need:</strong> {contract.need}{contract.unit}
                    <strong>Price:</strong> {contract.price}tk/{contract.unit}
                    <strong>Delivery:</strong> {contract.delivery}
                    <strong>Rating:</strong> {contract.ratingCount ? `${contract.ratingAverage.toFixed(1)}/5 (${contract.ratingCount})` : 'No ratings yet'}
                </div>
                {contract.canRate && (
                    <div className='contract_rating_form'>
                        <h3>Rate the contract owner</h3>
                        <select value={ratingStars} onChange={(event) => onRatingStarsChange(Number(event.target.value))}>
                            <option value='5'>5 stars</option>
                            <option value='4'>4 stars</option>
                            <option value='3'>3 stars</option>
                            <option value='2'>2 stars</option>
                            <option value='1'>1 star</option>
                        </select>
                        <textarea value={ratingComment} maxLength='500' onChange={(event) => onRatingCommentChange(event.target.value)} placeholder='Share your experience...' />
                        <button className='cf_apply_button' onClick={onSubmitRating} disabled={isRatingSubmitting}>
                            {isRatingSubmitting ? 'Saving...' : 'Submit Rating'}
                        </button>
                    </div>
                )}
                <button className='cf_apply_button' onClick={() => onApply(contract)}>Place a Bid</button>
            </div>
        </div>
    )
}

export default Contract_ViewDetails
