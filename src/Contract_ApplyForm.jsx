import './Contract_ApplyForm.css'
import remove_page from './assets/nav_icons/delete.png'

const Contract_ApplyForm = ({
    contract,
    proposedPrice,
    applicationMessage,
    isSubmitting,
    onClose,
    onPriceChange,
    onMessageChange,
    onSubmit
}) => {

    const totalOffer =
        Number(proposedPrice || 0) * Number(contract.need || 0)

    return (
        <div className='contract_action_overlay' onClick={onClose}>

            <div
                className='contract_action_popup'
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    className='contract_action_close'
                    onClick={onClose}
                    aria-label='Close popup'
                >
                    <img src={remove_page} alt='' />
                </button>

                <form
                    onSubmit={onSubmit}
                    className='contract_apply_form'
                >

                    <h2>Place a Bid</h2>

                    <h3>{contract.title}</h3>

                    <div className='contract_bid_info'>

                        <div>
                            <strong>Owner:</strong>
                            <span>
                                {contract.ownerName}
                            </span>
                        </div>

                        <div>
                            <strong>Required:</strong>
                            <span>
                                {contract.need} {contract.unit}
                            </span>
                        </div>

                        <div>
                            <strong>Owner's Price:</strong>
                            <span>
                                {contract.price} tk/{contract.unit}
                            </span>
                        </div>

                    </div>

                    <label htmlFor='proposed_price'>
                        Your Bid Price
                    </label>

                    <div className='bid_price_input_div'>

                        <input
                            id='proposed_price'
                            type='number'
                            min='0'
                            step='0.01'
                            required
                            value={proposedPrice}
                            onChange={onPriceChange}
                            placeholder='Enter your price'
                        />

                        <span>
                            tk/{contract.unit}
                        </span>

                    </div>

                    <div className='bid_total_price'>
                        <strong>Total Offer:</strong>

                        <span>
                            {totalOffer.toLocaleString()} tk
                        </span>
                    </div>

                    <label htmlFor='application_message'>
                        Message
                    </label>

                    <textarea
                        id='application_message'
                        maxLength='500'
                        value={applicationMessage}
                        onChange={onMessageChange}
                        placeholder='Explain your offer...'
                    />

                    <button
                        className='cf_apply_button'
                        type='submit'
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Placing Bid...'
                            : 'Place Bid'}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default Contract_ApplyForm