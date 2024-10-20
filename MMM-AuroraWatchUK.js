Module.register("MMM-AuroraWatchUK", {

    // Default module config
    defaults: {
        apiUrl: "https://aurorawatch-api.lancs.ac.uk/0.2/status/current-status.xml",
        displayStatuses: ["green", "yellow", "amber", "red"],
        showAlertMeaning: true,
        onlyDuringNight: false,
        onlyDuringClearSkies: 100, // set to 100 to always show, recommended 20 to alert when cloud cover is 20% or less
        displayCloudCover: true,
        latitude: 51.5074,  // Default: London
        longitude: -0.1278, // Default: London
        weatherApiKey: "",  // Your OpenWeatherMap API key
    },

    // Start function
    start: function () {
        Log.info("Starting module: " + this.name);

        // Fetch weather and status data on start if we have an API key
        if (this.config.weatherApiKey) {
            this.getWeatherData();
        }

        this.getStatus();

        // Schedule regular status updates
        setInterval(() => {
            if (this.config.weatherApiKey) {
                this.getWeatherData();
            }
            this.getStatus();
        }, 300000); // Update every 5 mins
    },

    // Function to fetch weather data from OpenWeatherMap
    getWeatherData: function () {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.config.latitude}&lon=${this.config.longitude}&appid=${this.config.weatherApiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.weatherData = {
                    sunrise: data.sys.sunrise * 1000, // Convert from seconds to ms
                    sunset: data.sys.sunset * 1000,
                    cloudiness: data.clouds.all
                };
                this.getStatus(); // Re-render the module with the new weather data
            })
            .catch(error => Log.error("Error fetching weather data: " + error));
    },

    // Function to check if it's currently night time
    isNightTime: function () {
        const now = new Date().getTime();
        if (this.weatherData) {
            return now >= this.weatherData.sunset || now <= this.weatherData.sunrise;
        }
        return false;
    },

    // Function to check if the sky is clear enough
    isClearSky: function () {
        if (this.weatherData) {
            return this.weatherData.cloudiness <= this.config.onlyDuringClearSkies;
        }
        return false;
    },

    // Function to fetch aurora status and apply weather conditions
    getStatus: function () {
        //only do the weather and sunrise checks if we have an api key
        if (this.config.weatherApiKey) {
            // Ensure weather data is available before checking conditions
            if (!this.weatherData) {
                return; // Skip the status check until weather data is fetched
            }

            // Check if the sky is clear (if enabled in config)
            if (this.config.onlyDuringClearSkies && !this.isClearSky()) {
                Log.info("Not checking aurora status: Sky is not clear - " + this.weatherData.cloudiness + "% cloud cover. Hoping for " + this.config.onlyDuringClearSkies + "%");
                return;
            }

            // Check if it's night time (if enabled in config)
            if (this.config.onlyDuringNight && !this.isNightTime()) {
                Log.info("Not checking aurora status: It's not dark yet.");
                return;
            }
        }

        // Get and display Aurora status if all conditions are met
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

            let meaningText = "";
            if (this.config.showAlertMeaning == true) {
                meaningText = meaning._; // Access the actual meaning text
            }

            let cloudCoverText = "";
            if (this.config.onlyDuringClearSkies && this.config.weatherApiKey && this.config.displayCloudCover) {
                cloudCoverText = this.weatherData.cloudiness + "% cloud cover";
            }

            wrapper.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; background-color: black; padding: 10px;">
                    <img src="https://aurorawatch.lancs.ac.uk/img/logo_w_300.png" alt="AuroraWatch Logo" style="width: 150px; height: auto;">
                    <div style="flex-grow: 1; text-align: center; color: ${color};">
                        <span class="MMM-AuroraWatchUK-status"><strong>Status: ${this.currentStatus.status}</strong></span>
                        <span  class="MMM-AuroraWatchUK-description">(${descriptionText})</span>
                        <spanclass="MMM-AuroraWatchUK-meaning">${meaningText}</span>
                        <span class="MMM-AuroraWatchUK-cloudCover">(${cloudCoverText})</span>
                    </div>
                    <img src="https://aurorawatch.lancs.ac.uk/img/logo_w_300.png" alt="AuroraWatch Logo" style="width: 150px; height: auto;">
                </div>
            `;
            wrapper.className = "status-bar"; // Add a class for styling
        }

        return wrapper;
    }
});
