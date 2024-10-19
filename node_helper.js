const NodeHelper = require("node_helper");
const axios = require("axios");
const xml2js = require("xml2js");

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-AuroraWatch helper started...");
        this.statusDescriptions = {}; // Initialize an object to store status descriptions
        this.fetchStatusDescriptions(); // Fetch the status descriptions when the module starts
    },

    fetchStatusDescriptions: async function () {
        try {
            const response = await axios.get("https://aurorawatch-api.lancs.ac.uk/0.2/status-descriptions.xml");
            const result = await xml2js.parseStringPromise(response.data);
            const statuses = result.status_list.status;

            // Populate the statusDescriptions object
            statuses.forEach((status) => {
                this.statusDescriptions[status.$.id] = {
                    color: status.color[0],
                    description: status.description[0],
                    meaning: status.meaning[0],
                };
            });
        } catch (error) {
            console.error("Error fetching AuroraWatch UK status descriptions:", error);
        }
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_STATUS") {
            this.getStatus(payload);
        }
    },

    getStatus: async function (url) {
        try {
            const response = await axios.get(url);
            const result = await xml2js.parseStringPromise(response.data);
            const status = result.current_status.site_status[0].$.status_id; // Extract the status ID
            this.sendSocketNotification("STATUS_RESULT", {
                status,
                details: this.statusDescriptions[status], // Send details directly
            });
        } catch (error) {
            console.error("Error fetching or parsing status:", error);
        }
    }
});
