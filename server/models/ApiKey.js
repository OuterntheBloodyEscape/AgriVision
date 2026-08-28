const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
    name: String,
    key: String
});

module.exports = mongoose.model("ApiKey", apiKeySchema);