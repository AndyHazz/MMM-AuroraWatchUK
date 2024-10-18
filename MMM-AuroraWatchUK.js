Module.register("MMM-AuroraWatchUK", {
    // Default module config.
    defaults: {
        updateInterval: 300000, // 5 minutes
        apiUrl: "https://aurorawatch-api.lancs.ac.uk/0.2/status/current-status.xml",
        displayStatuses: ["green", "yellow", "amber", "red"], // Configurable statuses to display
    },

    // Store the current status
    currentStatus: null,

    start: function () {
        // Schedule updates
        this.getStatus();
        setInterval(() => {
            this.getStatus();
        }, this.config.updateInterval);
    },

    getStatus: function () {
        this.sendSocketNotification("GET_STATUS", this.config.apiUrl);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "STATUS_RESULT") {
            this.currentStatus = payload; // Payload now includes status and details
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
    
        // Check if the current status is in the display statuses
        if (this.currentStatus && this.config.displayStatuses.includes(this.currentStatus.status.toLowerCase())) {
            const { details } = this.currentStatus; // Access details directly
            const { color, description, meaning } = details; // Destructure the properties
    
            // Access the text from the description and meaning
            const descriptionText = description._; // Access the actual description text
            const meaningText = meaning._; // Access the actual meaning text
    
            // Create the content with logos aligned to the edges
            wrapper.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; background-color: black; padding: 10px;">
                    <img src="https://aurorawatch.lancs.ac.uk/img/logo_w_300.png" alt="AuroraWatch Logo" style="width: 150px; height: auto;">
                    <div style="flex-grow: 1; text-align: center; color: ${color};">
                        <strong>Status: ${this.currentStatus.status}</strong>
                        <span>(${descriptionText})</span><br>
                        <span>${meaningText}</span>
                    </div>
                    <img src="https://aurorawatch.lancs.ac.uk/img/logo_w_300.png" alt="AuroraWatch Logo" style="width: 150px; height: auto;">
                </div>
            `;
            wrapper.className = "status-bar"; // Add a class for styling
            wrapper.style.color = "white"; // Set text color to white for readability
        }
    
        return wrapper;
    }
    
    
});
