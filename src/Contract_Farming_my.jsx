import "./Contract_Farming_my.css";
import { useState, useEffect } from "react";

import list_search from "./assets/nav_icons/list_search.png";
import atl from "./assets/nav_icons/add-to-list.png";
import down_icon from "./assets/nav_icons/down_arrow.png";
import up_icon from "./assets/nav_icons/up_arrow.png";

import { useNavigate } from "react-router-dom";

import Contract_addForm from "./Contract_addForm.jsx";
import Contract_History from "./Contract_History.jsx";
import Contract_EditForm from "./Contract_EditForm.jsx";
import ContractBidsPopup from "./ContractBidsPopup.jsx";
import FarmerBidPopup from "./FarmerBidPopup.jsx";

const Contract_Farming_my = ({ tm }) => {
    const nav = useNavigate();

    /* ========================= */
    /* BOX STATES */
    /* ========================= */

    const [topBoxState, setTopBoxState] = useState(false);
    const [bidBoxState, setBidBoxState] = useState(false);
    const [historyBoxState, setHistoryBoxState] = useState(false);

    /* ========================= */
    /* POPUP STATES */
    /* ========================= */

    const [isAddPopupOpen, setAddPopupOpen] = useState(false);

    const [selectedContractBids, setSelectedContractBids] = useState(null);

    const [selectedFarmerBid, setSelectedFarmerBid] = useState(null);

    const [editingContract, setEditingContract] = useState(null);

    /* ========================= */
    /* CONTRACT DATA */
    /* ========================= */

    const [ownedContracts, setOwnedContracts] = useState([]);
    const [bidedContracts, setBidedContracts] = useState([]);
    const [historyContracts, setHistoryContracts] = useState([]);

    /* ========================= */
    /* LOAD MY CONTRACTS */
    /* ========================= */

    const loadMyContracts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/contracts/mine", {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load your contracts");
            }

            setOwnedContracts(data.owned || []);
            setBidedContracts(data.bided || []);
            setHistoryContracts(data.history || []);
        } catch (error) {
            console.error("My contracts error:", error);

            tm(error.message || "Unable to load your contracts");
        }
    };

    /* ========================= */
    /* LOGIN CHECK */
    /* ========================= */

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/check-login",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                await response.json();

                if (response.status === 401) {
                    nav("/login_page", {
                        replace: true,
                    });

                    return;
                }

                if (!response.ok) {
                    tm("Unable to verify your login session");
                }
            } catch (error) {
                console.error("My Contracts login check error:", error);

                tm("Unable to connect to the server");
            }
        };

        checkLogin();
    }, [nav, tm]);

    /* ========================= */
    /* LOAD CONTRACTS */
    /* ========================= */

    useEffect(() => {
        loadMyContracts();
    }, [tm]);

    /* ========================= */
    /* ACCEPT / REJECT BID */
    /* ========================= */

    const updateApplication = async (contractId, applicationId, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/applications/${applicationId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update application");
            }

            tm(data.message);

            await loadMyContracts();
        } catch (error) {
            console.error("Application update error:", error);

            tm(error.message || "Unable to update application");
        }
    };

    /* ========================= */
    /* OWNER ACCEPT */
    /* ========================= */

    const handleAcceptBid = async (contractId, applicationId) => {
        await updateApplication(contractId, applicationId, "accepted");

        setSelectedContractBids(null);
    };

    /* ========================= */
    /* OWNER REJECT */
    /* ========================= */

    const handleRejectBid = async (contractId, applicationId) => {
        await updateApplication(contractId, applicationId, "rejected");
    };

    /* ========================= */
    /* OWNER COUNTER OFFER */
    /* ========================= */

    const handleOwnerRebid = async (
        contractId,
        applicationId,
        price,
        message,
    ) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/applications/${applicationId}/update-bid`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposedPrice: Number(price),
                        message,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to send counter offer");
            }

            tm("Counter offer sent!");

            await loadMyContracts();

            /*
             * Update the popup with fresh contract data
             */
            setSelectedContractBids(data.contract || null);
        } catch (error) {
            console.error("Owner counter offer error:", error);

            tm(error.message || "Unable to send counter offer");
        }
    };

    /* ========================= */
    /* FARMER ACCEPT OWNER OFFER */
    /* ========================= */

    const farmerAcceptOffer = async (contractId, applicationId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/applications/${applicationId}/accept-offer`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to accept owner's offer");
            }

            tm(data.message || "Owner's offer accepted");

            await loadMyContracts();

            setSelectedFarmerBid(null);
        } catch (error) {
            console.error("Farmer accept offer error:", error);

            tm(error.message || "Unable to accept owner's offer");
        }
    };

    /* ========================= */
    /* FARMER UPDATE / COUNTER */
    /* ========================= */

    const handleUpdateBidSubmit = async (
        contractId,
        applicationId,
        price,
        message,
    ) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/applications/${applicationId}/update-bid`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposedPrice: Number(price),
                        message,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update your bid");
            }

            tm(data.message || "Bid updated successfully");

            await loadMyContracts();

            setSelectedFarmerBid(null);
        } catch (error) {
            console.error("Farmer bid update error:", error);

            tm(error.message || "Unable to update your bid");

            throw error;
        }
    };

    /* ========================= */
    /* CONTRACT STATUS */
    /* ========================= */

    const updateContractStatus = async (contractId, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update contract status");
            }

            tm(data.message);

            setOwnedContracts((current) =>
                current.map((contract) =>
                    contract._id === contractId
                        ? {
                            ...contract,
                            status,
                        }
                        : contract,
                ),
            );
        } catch (error) {
            console.error("Contract status error:", error);

            tm(error.message || "Unable to update contract status");
        }
    };

    /* ========================= */
    /* EDIT CONTRACT */
    /* ========================= */

    const updateContract = async (contractId, updatedData) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update contract");
            }

            setOwnedContracts((current) =>
                current.map((contract) =>
                    contract._id === contractId ? data.contract : contract,
                ),
            );

            setEditingContract(null);

            tm(data.message);
        } catch (error) {
            console.error("Contract update error:", error);

            tm(error.message || "Unable to update contract");
        }
    };

    /* ========================= */
    /* DELETE CONTRACT */
    /* ========================= */

    const deleteContract = async (contractId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this contract?",
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/contracts/${contractId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete contract");
            }

            setOwnedContracts((current) =>
                current.filter((contract) => contract._id !== contractId),
            );

            tm(data.message);
        } catch (error) {
            console.error("Contract delete error:", error);

            tm(error.message || "Unable to delete contract");
        }
    };

    /* ========================= */
    /* RENDER */
    /* ========================= */

    return (
        <>
            <div id="CFM_root">
                {/* ========================= */}
                {/* TOP BAR */}
                {/* ========================= */}

                <div id="CFM_top">
                    <div id="CFM_search_div">
                        <input
                            type="search"
                            placeholder="Search List..."
                            id="CFM_search_input"
                        />

                        <div id="CFM_search_button_div">
                            <img src={list_search} alt="list_search" height={30} width={30} />
                        </div>
                    </div>

                    <div id="CFM_others_div">
                        <button
                            id="CFM_history_button"
                            onClick={() => setHistoryBoxState(true)}
                        >
                            History
                        </button>

                        <div id="CFM_sort"></div>
                    </div>
                </div>

                {/* ========================= */}
                {/* CONTENT */}
                {/* ========================= */}

                <div id="Contract_Farming_my_bottom">
                    {/* ================================================= */}
                    {/* MY BIDED CONTRACTS */}
                    {/* ================================================= */}

                    <div id="Contract_Farming_myBidedContract">
                        <div className="Contract_Farming_my_heading">
                            <p
                                className={`Contract_Farming_my_heading_text ${bidBoxState ? "fold_Contract_Farming_my_fs" : ""
                                    }`}
                            >
                                My Bided Contracts
                            </p>

                            <div
                                className="Contract_Farming_my_fold_button"
                                onClick={() => setBidBoxState((p) => !p)}
                            >
                                <img
                                    src={bidBoxState ? down_icon : up_icon}
                                    alt="fold"
                                    height={30}
                                    width={30}
                                />
                            </div>
                        </div>

                        <div
                            className={`Contract_Farming_my_cc ${bidBoxState ? "fold_Contract_Farming_my_CC" : ""
                                }`}
                        >
                            {bidedContracts.length === 0 && <p>No active bids yet.</p>}

                            {bidedContracts.map((contract) => {
                                /*
                                 * Backend should return the farmer's
                                 * application as myApplication.
                                 */
                                const application = contract.myApplication;

                                return (
                                    <div className="Contract_Farming_my_card" key={contract._id}>
                                        <div className="Contract_Farming_my_card_info">
                                            <h2>{contract.title}</h2>

                                            <h4>Buyer: {contract.ownerName}</h4>

                                            <h4>
                                                Need: {contract.need} {contract.unit}
                                            </h4>

                                            <h4>
                                                Buyer's Price: {contract.price} tk/
                                                {contract.unit}
                                            </h4>

                                            <h4>
                                                Your Bid: {application?.proposedPrice} tk/
                                                {contract.unit}
                                            </h4>

                                            <h4>Delivery: {contract.delivery}</h4>

                                            <div className="CFM_contact_info">
                                                <h4>Delivery Contact</h4>

                                                <p>
                                                    <strong>Phone:</strong>{" "}
                                                    {contract.ownerPhone || "Not provided"}
                                                </p>

                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {contract.ownerEmail || "Not provided"}
                                                </p>
                                            </div>

                                            <p>
                                                Bid Status:{" "}
                                                <strong
                                                    className={`bid_status ${application?.status || "pending"
                                                        }`}
                                                >
                                                    {(application?.status || "pending").replaceAll(
                                                        "_",
                                                        " ",
                                                    )}
                                                </strong>
                                            </p>

                                            {/* ================================= */}
                                            {/* VIEW MY BID BUTTON */}
                                            {/* ================================= */}

                                            <div
                                                className="contract_card_actions_stack"
                                                style={{
                                                    marginTop: "15px",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn_stack btn_view_bids"
                                                    onClick={() =>
                                                        setSelectedFarmerBid({
                                                            contract,
                                                            application,
                                                        })
                                                    }
                                                >
                                                    View My Bid
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* MY ADDED CONTRACTS */}
                    {/* ================================================= */}

                    <div id="Contract_Farming_myAddedContract">
                        <div className="Contract_Farming_my_heading">
                            <p
                                className={`Contract_Farming_my_heading_text ${topBoxState ? "fold_Contract_Farming_my_fs" : ""
                                    }`}
                            >
                                My Added Contract
                            </p>

                            <div
                                className="Contract_Farming_my_fold_button"
                                onClick={() => setTopBoxState((p) => !p)}
                            >
                                <img
                                    src={topBoxState ? down_icon : up_icon}
                                    alt="fold"
                                    height={30}
                                    width={30}
                                />
                            </div>
                        </div>

                        <div
                            className={`Contract_Farming_my_cc ${topBoxState ? "fold_Contract_Farming_my_CC" : ""
                                }`}
                        >
                            {ownedContracts.length === 0 && <p>No added contracts yet.</p>}

                            {ownedContracts.map((contract) => (
                                <div className="Contract_Farming_my_card" key={contract._id}>
                                    <div className="Contract_Farming_my_card_info">
                                        <h2>{contract.title}</h2>

                                        <h4>
                                            Need: {contract.need} {contract.unit}
                                        </h4>

                                        <h4>
                                            Price: {contract.price} tk/
                                            {contract.unit}
                                        </h4>

                                        <h4>Delivery: {contract.delivery}</h4>

                                        <div className="CFM_contact_info">
                                            <h4>Delivery Contact</h4>
                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {contract.phone || "Not provided"}
                                            </p>
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {contract.email || "Not provided"}
                                            </p>
                                        </div>

                                        <p>
                                            State:{" "}
                                            {contract.status === "open"
                                                ? "Active"
                                                : contract.status === "closed"
                                                    ? "Paused"
                                                    : "Completed"}
                                        </p>

                                        {/* ================================= */}
                                        {/* OWNER ACTIONS */}
                                        {/* ================================= */}

                                        <div className="contract_card_actions">
                                            <button
                                                className="btn_view_bids"
                                                onClick={() => setSelectedContractBids(contract)}
                                            >
                                                View Bids ({contract.applications?.length || 0})
                                            </button>

                                            <div className="contract_card_actions_secondary">
                                                <button
                                                    className="btn_action btn_edit"
                                                    onClick={() => setEditingContract(contract)}
                                                    disabled={contract.status === "completed"}
                                                >
                                                    Edit
                                                </button>

                                                {contract.status !== "completed" && (
                                                    <button
                                                        className={`btn_action btn_status ${contract.status === "open" ? "pause" : "activate"
                                                            }`}
                                                        onClick={() =>
                                                            updateContractStatus(
                                                                contract._id,
                                                                contract.status === "open" ? "closed" : "open",
                                                            )
                                                        }
                                                    >
                                                        {contract.status === "open" ? "Pause" : "Activate"}
                                                    </button>
                                                )}

                                                <button
                                                    className="btn_action btn_delete"
                                                    onClick={() => deleteContract(contract._id)}
                                                    disabled={contract.status === "completed"}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div id="CFM_end"></div>

                {/* ================================================= */}
                {/* ADD CONTRACT BUTTON */}
                {/* ================================================= */}

                <div id="CFM_add_button" onClick={() => setAddPopupOpen(true)}>
                    <img src={atl} alt="list_add" height={40} width={40} />
                </div>

                {/* ================================================= */}
                {/* ADD CONTRACT POPUP */}
                {/* ================================================= */}

                {isAddPopupOpen && (
                    <div
                        className="cfm_add_overlay"
                        onClick={() => setAddPopupOpen(false)}
                    >
                        <div
                            id="popup_container"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <Contract_addForm
                                cdp={() => setAddPopupOpen(false)}
                                tm={tm}
                                onAdded={loadMyContracts}
                            />
                        </div>
                    </div>
                )}

                {/* ================================================= */}
                {/* HISTORY POPUP */}
                {/* ================================================= */}

                {historyBoxState && (
                    <Contract_History
                        historyContracts={historyContracts}
                        onClose={() => setHistoryBoxState(false)}
                    />
                )}

                {/* ================================================= */}
                {/* OWNER BIDS POPUP */}
                {/* ================================================= */}

                {selectedContractBids && (
                    <ContractBidsPopup
                        contract={selectedContractBids}
                        onClose={() => setSelectedContractBids(null)}
                        onAccept={handleAcceptBid}
                        onReject={handleRejectBid}
                        onRebid={handleOwnerRebid}
                    />
                )}

                {/* ================================================= */}
                {/* FARMER BID POPUP */}
                {/* ================================================= */}

                {selectedFarmerBid && (
                    <FarmerBidPopup
                        contract={selectedFarmerBid.contract}
                        application={selectedFarmerBid.application}
                        onClose={() => setSelectedFarmerBid(null)}
                        onAccept={farmerAcceptOffer}
                        onUpdateBid={handleUpdateBidSubmit}
                    />
                )}

                {/* ================================================= */}
                {/* EDIT CONTRACT POPUP */}
                {/* ================================================= */}

                {editingContract && (
                    <Contract_EditForm
                        contract={editingContract}
                        onClose={() => setEditingContract(null)}
                        onUpdate={updateContract}
                    />
                )}
            </div>
        </>
    );
};

export default Contract_Farming_my;
