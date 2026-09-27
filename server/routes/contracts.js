import express from "express";
import jwt from "jsonwebtoken";
import Contract from "../models/contract.js";
import User from "../models/user.js";

const router = express.Router();

/* =========================================================
   AUTH
========================================================= */

const requireUser = async (req, res, next) => {
    try {
        const token = req.cookies.av_token;

        if (!token) {
            return res.status(401).json({
                message: "Please log in first",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded.userId)
            .select('name Company_name email phone')

        if (!user) {
            return res.status(401).json({
                message: "Please log in first",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Please log in first",
        });
    }
};

/* =========================================================
   GET ALL OPEN CONTRACTS
========================================================= */

router.get("/", requireUser, async (req, res) => {
    try {
        const contracts = await Contract.find({ status: "open" })
            .sort({ createdAt: -1 })
            .lean();

        const formattedContracts = contracts.map((contract) => {
            const ratings = contract.ratings || [];

            const ratingTotal = ratings.reduce(
                (total, rating) => total + rating.stars,
                0,
            );

            return {
                ...contract,

                ownerPhone: contract.phone || '',
                ownerEmail: contract.email || '',
                ratingAverage: ratings.length ? ratingTotal / ratings.length : 0,

                ratingCount: ratings.length,
            };
        });

        return res.json({
            contracts: formattedContracts,
        });
    } catch (error) {
        console.error("Contract list error:", error);

        return res.status(500).json({
            message: "Unable to load contracts",
        });
    }
});

/* =========================================================
   CREATE CONTRACT
========================================================= */

router.post("/", requireUser, async (req, res) => {
    try {
        const { title, need, unit, price, delivery, moreInfo, phone,
            email } = req.body;

        if (!title || !need || !unit || !price || !delivery || !moreInfo) {
            return res.status(400).json({
                message: "All contract fields are required",
            });
        }

        const contract = await Contract.create({
            ownerId: req.user._id,
            ownerName: req.user.name,
            title,
            need: Number(need),
            unit,
            price: Number(price),
            delivery,
            moreInfo,
            phone,
            email
        });

        return res.status(201).json({
            message: "Contract added successfully",
            contract,
        });
    } catch (error) {
        console.error("Contract creation error:", error);

        return res.status(500).json({
            message: "Unable to add contract",
        });
    }
});

/* =========================================================
   MY CONTRACTS
========================================================= */

router.get('/mine', requireUser, async (req, res) => {
    try {
        const [owned, appliedContracts] = await Promise.all([
            Contract.find({
                ownerId: req.user._id
            })
                .sort({ createdAt: -1 })
                .lean(),

            Contract.find({
                'applications.applicantId': req.user._id
            })
                .sort({ createdAt: -1 })
                .lean()
        ])

        const applied = await Promise.all(
            appliedContracts.map(async (contract) => {
                const applications = contract.applications || []

                const myApplication = applications.find(
                    (application) =>
                        String(application.applicantId) ===
                        String(req.user._id)
                )

                const owner = await User.findById(contract.ownerId)
                    .select('name email phone')
                    .lean()

                return {
                    ...contract,
                    ownerName: owner?.name || contract.ownerName,
                    ownerEmail: contract.email || '',
                    ownerPhone: contract.phone || '',
                    myApplication
                }
            })
        )

        const bided = applied.filter(
            (contract) => contract.status !== 'completed'
        )

        const history = applied.filter(
            (contract) => contract.status === 'completed'
        )

        return res.json({
            owned,
            bided,
            history
        })

    } catch (error) {
        console.error('My contracts error:', error)

        return res.status(500).json({
            message: 'Unable to load your contracts'
        })
    }
})

/* =========================================================
   CONTRACT DETAILS
========================================================= */

router.get("/:id", requireUser, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).lean();

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        const applications = contract.applications || [];

        const ratings = contract.ratings || [];

        const myApplication = applications.find(
            (application) => String(application.applicantId) === String(req.user._id),
        );

        const myRating = ratings.find(
            (rating) => String(rating.raterId) === String(req.user._id),
        );

        const ratingTotal = ratings.reduce(
            (total, rating) => total + rating.stars,
            0,
        );

        return res.json({
            contract: {
                ...contract,

                applications,
                ratings,

                ratingAverage: ratings.length ? ratingTotal / ratings.length : 0,

                ratingCount: ratings.length,

                canRate: myApplication?.status === "accepted" && !myRating,

                myRating: myRating || null,
            },
        });
    } catch (error) {
        console.error("Contract details error:", error);

        return res.status(500).json({
            message: "Unable to load contract details",
        });
    }
});

/* =========================================================
   EDIT CONTRACT
========================================================= */

router.patch("/:id", requireUser, async (req, res) => {
    try {
        const { title, need, unit, price, delivery, moreInfo } = req.body;

        if (!title || !need || !unit || !price || !delivery || !moreInfo) {
            return res.status(400).json({
                message: "All contract fields are required",
            });
        }

        const contract = await Contract.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        if (contract.status === "completed") {
            return res.status(400).json({
                message: "Completed contracts cannot be edited",
            });
        }

        contract.title = title;
        contract.need = Number(need);
        contract.unit = unit;
        contract.price = Number(price);
        contract.delivery = delivery;
        contract.moreInfo = moreInfo;

        await contract.save();

        return res.json({
            message: "Contract updated successfully",
            contract,
        });
    } catch (error) {
        console.error("Contract update error:", error);

        return res.status(500).json({
            message: "Unable to update contract",
        });
    }
});

/* =========================================================
   DELETE CONTRACT
========================================================= */

router.delete("/:id", requireUser, async (req, res) => {
    try {
        const contract = await Contract.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        if (contract.status === "completed") {
            return res.status(400).json({
                message: "Completed contracts cannot be deleted",
            });
        }

        await Contract.deleteOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        return res.json({
            message: "Contract deleted successfully",
        });
    } catch (error) {
        console.error("Contract delete error:", error);

        return res.status(500).json({
            message: "Unable to delete contract",
        });
    }
});

/* =========================================================
   RATINGS
========================================================= */

router.post("/:id/ratings", requireUser, async (req, res) => {
    try {
        const stars = Number(req.body.stars);

        const comment = String(req.body.comment || "").slice(0, 500);

        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5 stars",
            });
        }

        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        const application = contract.applications.find(
            (item) => String(item.applicantId) === String(req.user._id),
        );

        if (application?.status !== "accepted") {
            return res.status(403).json({
                message: "Only an accepted applicant can rate this contract owner",
            });
        }

        if (
            contract.ratings.some(
                (rating) => String(rating.raterId) === String(req.user._id),
            )
        ) {
            return res.status(409).json({
                message: "You have already rated this contract owner",
            });
        }

        contract.ratings.push({
            raterId: req.user._id,
            raterName: req.user.name,
            stars,
            comment,
        });

        await contract.save();

        return res.status(201).json({
            message: "Rating submitted successfully",
        });
    } catch (error) {
        console.error("Contract rating error:", error);

        return res.status(500).json({
            message: "Unable to submit rating",
        });
    }
});

/* =========================================================
   PAUSE / ACTIVATE CONTRACT
========================================================= */

router.patch("/:id/status", requireUser, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["open", "closed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid contract status",
            });
        }

        const contract = await Contract.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerId: req.user._id,
            },
            { status },
            {
                returnDocument: "after",
            },
        ).lean();

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        return res.json({
            message: status === "open" ? "Contract activated" : "Contract paused",
            contract,
        });
    } catch (error) {
        console.error("Contract status error:", error);

        return res.status(500).json({
            message: "Unable to update contract status",
        });
    }
});

/* =========================================================
   CREATE INITIAL BID
========================================================= */

router.post("/:id/applications", requireUser, async (req, res) => {
    try {
        const { proposedPrice, message = "" } = req.body;

        const price = Number(proposedPrice);

        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({
                message: "Enter a valid bid price",
            });
        }

        if (String(message).length > 500) {
            return res.status(400).json({
                message: "Message is too long",
            });
        }

        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                message: "Contract not found",
            });
        }

        if (contract.status !== "open") {
            return res.status(400).json({
                message: "This contract is no longer available",
            });
        }

        if (String(contract.ownerId) === String(req.user._id)) {
            return res.status(400).json({
                message: "You cannot bid on your own contract",
            });
        }

        /*
         * Don't allow another active bid
         * from the same farmer.
         */
        const existingBid = contract.applications.find(
            (application) =>
                String(application.applicantId) === String(req.user._id) &&
                ["pending", "owner_countered", "farmer_accepted"].includes(
                    application.status,
                ),
        );

        if (existingBid) {
            return res.status(409).json({
                message: "You already have an active bid",
            });
        }

        contract.applications.push({
            applicantId: req.user._id,

            applicantName: req.user.name,

            proposedPrice: price,

            message: String(message).slice(0, 500),

            status: "pending",
        });

        await contract.save();

        return res.status(201).json({
            message: "Bid placed successfully",
        });
    } catch (error) {
        console.error("Bid creation error:", error);

        return res.status(500).json({
            message: "Unable to place bid",
        });
    }
});

/* =========================================================
   UPDATE BID / COUNTER OFFER
========================================================= */

router.patch(
    "/:id/applications/:applicationId/update-bid",
    requireUser,
    async (req, res) => {
        try {
            const { proposedPrice, message = "" } = req.body;

            const price = Number(proposedPrice);

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    message: "Invalid proposed price",
                });
            }

            if (String(message).length > 500) {
                return res.status(400).json({
                    message: "Message must be 500 characters or less",
                });
            }

            const contract = await Contract.findById(req.params.id);

            if (!contract) {
                return res.status(404).json({
                    message: "Contract not found",
                });
            }

            if (contract.status !== "open") {
                return res.status(400).json({
                    message: "Contract is not open",
                });
            }

            const application = contract.applications.id(req.params.applicationId);

            if (!application) {
                return res.status(404).json({
                    message: "Application not found",
                });
            }

            const userId = String(req.user._id);

            const ownerId = String(contract.ownerId);

            const applicantId = String(application.applicantId);

            /* -----------------------------------------
                     OWNER SENDS COUNTER OFFER
                  ----------------------------------------- */

            if (userId === ownerId) {
                if (application.status !== "pending") {
                    return res.status(400).json({
                        message: "Only a pending bid can receive a counter offer",
                    });
                }

                application.proposedPrice = price;

                application.message = String(message).slice(0, 500);

                application.status = "owner_countered";

                await contract.save();

                return res.json({
                    message: "Counter offer sent",
                    application,
                });
            }

            /* -----------------------------------------
                     FARMER SENDS NEW COUNTER
                  ----------------------------------------- */

            if (userId === applicantId) {
                if (!["pending", "owner_countered"].includes(application.status)) {
                    return res.status(400).json({
                        message: "This bid cannot be changed now",
                    });
                }

                application.proposedPrice = price;

                application.message = String(message).slice(0, 500);

                /*
                 * Farmer's new offer goes back
                 * to pending so owner can respond.
                 */
                application.status = "pending";

                await contract.save();

                return res.json({
                    message: "Bid updated successfully",
                    application,
                });
            }

            return res.status(403).json({
                message: "You cannot modify this bid",
            });
        } catch (error) {
            console.error("Update bid error:", error);

            return res.status(500).json({
                message: "Unable to update bid",
            });
        }
    },
);

/* =========================================================
   FARMER ACCEPTS OWNER COUNTER OFFER
========================================================= */

router.patch(
    "/:id/applications/:applicationId/accept-offer",
    requireUser,
    async (req, res) => {
        try {
            const contract = await Contract.findById(req.params.id);

            if (!contract) {
                return res.status(404).json({
                    message: "Contract not found",
                });
            }

            if (contract.status !== "open") {
                return res.status(400).json({
                    message: "Contract is not open",
                });
            }

            const application = contract.applications.id(req.params.applicationId);

            if (!application) {
                return res.status(404).json({
                    message: "Application not found",
                });
            }

            /*
             * Only the farmer who owns this
             * application can accept it.
             */
            if (String(application.applicantId) !== String(req.user._id)) {
                return res.status(403).json({
                    message: "You cannot accept this offer",
                });
            }

            if (application.status !== "owner_countered") {
                return res.status(400).json({
                    message: "There is no owner counter offer to accept",
                });
            }

            /*
             * Farmer accepts the offer.
             *
             * Deal is NOT completed yet.
             * Owner must finalize.
             */
            application.status = "farmer_accepted";

            await contract.save();

            return res.json({
                message: "Owner's offer accepted. Waiting for final confirmation.",
                application,
            });
        } catch (error) {
            console.error("Accept offer error:", error);

            return res.status(500).json({
                message: "Unable to accept offer",
            });
        }
    },
);

/* =========================================================
   OWNER ACCEPT / FINALIZE / REJECT
========================================================= */

router.patch(
    "/:id/applications/:applicationId",
    requireUser,
    async (req, res) => {
        try {
            const { status } = req.body;

            if (!["accepted", "rejected"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid application status",
                });
            }

            const contract = await Contract.findOne({
                _id: req.params.id,
                ownerId: req.user._id,
            });

            if (!contract) {
                return res.status(404).json({
                    message: "Contract not found",
                });
            }

            if (contract.status !== "open") {
                return res.status(400).json({
                    message: "This contract is already closed",
                });
            }

            const application = contract.applications.id(req.params.applicationId);

            if (!application) {
                return res.status(404).json({
                    message: "Bid not found",
                });
            }

            /* -----------------------------------------
                     FINALIZE DEAL
                  ----------------------------------------- */

            if (status === "accepted") {
                /*
                 * Owner can finalize:
                 *
                 * 1. Direct pending bid
                 * 2. Farmer accepted owner counter
                 */
                if (!["pending", "farmer_accepted"].includes(application.status)) {
                    return res.status(400).json({
                        message: "This bid cannot be finalized now",
                    });
                }

                application.status = "accepted";

                /*
                 * Contract is completed.
                 */
                contract.status = "completed";

                /*
                 * Reject all other active bids.
                 */
                contract.applications.forEach((item) => {
                    if (
                        String(item._id) !== String(application._id) &&
                        ["pending", "owner_countered", "farmer_accepted"].includes(
                            item.status,
                        )
                    ) {
                        item.status = "rejected";
                    }
                });

                await contract.save();

                return res.json({
                    message: "Deal finalized successfully",
                    contract,
                });
            }

            /* -----------------------------------------
                     REJECT BID
                  ----------------------------------------- */

            if (
                !["pending", "owner_countered", "farmer_accepted"].includes(
                    application.status,
                )
            ) {
                return res.status(400).json({
                    message: "This bid cannot be rejected now",
                });
            }

            application.status = "rejected";

            await contract.save();

            return res.json({
                message: "Bid rejected successfully",
                contract,
            });
        } catch (error) {
            console.error("Bid status error:", error);

            return res.status(500).json({
                message: "Unable to update bid",
            });
        }
    },
);

export default router;
