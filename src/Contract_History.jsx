import './Contract_History.css'
import remove_page from './assets/nav_icons/delete.png'

const Contract_History = ({ historyContracts, onClose }) => {
    return (
        <div
            className='cfh_overlay'
            onClick={onClose}
        >
            <div
                className='cfh_popup'
                onClick={(event) => event.stopPropagation()}
            >

                <div className='cfh_heading'>
                    <p>Contract History</p>

                    <button
                        className='cfh_close'
                        onClick={onClose}
                        aria-label='Close history'
                    >
                        <img src={remove_page} alt='' />
                    </button>
                </div>

                <div className='cfh_content'>

                    {historyContracts.length === 0 && (
                        <p className='cfh_empty'>
                            No finished contracts yet.
                        </p>
                    )}

                    {historyContracts.map((contract) => {
                        const application = contract.myApplication

                        return (
                            <div
                                className='cfh_card'
                                key={contract._id}
                            >
                                <div className='cfh_card_info'>
                                    <h2>{contract.title}</h2>

                                    <h4>
                                        Buyer: {contract.ownerName}
                                    </h4>

                                    <h4>
                                        Need: {contract.need} {contract.unit}
                                    </h4>

                                    <h4>
                                        Buyer's Price: {contract.price}tk/{contract.unit}
                                    </h4>

                                    <h4>
                                        Your Bid: {application?.proposedPrice}tk/{contract.unit}
                                    </h4>

                                    <h4>
                                        Delivery: {contract.delivery}
                                    </h4>

                                    <p>
                                        Bid status:{' '}
                                        <strong>{application?.status}</strong>
                                    </p>

                                    <p>
                                        Contract status:{' '}
                                        <strong>Finished</strong>
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

export default Contract_History