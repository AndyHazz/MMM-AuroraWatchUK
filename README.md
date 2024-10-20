# MMM-AuroraWatchUK

![Alt text](/img/demo.png "A preview of the MMM-AuroraWatchUK module showing a yellow alert.")

Module for [MagicMirror²](https://github.com/MichMich/MagicMirror/), to show an alert banner based on aurora activity alerts provided by AuroraWatch UK https://aurorawatch.lancs.ac.uk/

The module configuration allows you to choose which level of alerts to show, based on the levels described here: https://aurorawatch.lancs.ac.uk/alerts/

If you add an OpenWeather API key (available from here: https://home.openweathermap.org/users/sign_up - a free account is all you need for current weather data), and provide your lat/long coordinates, you can have the alerts only show when it's dark and/or only when below a set % of cloud cover.

This is not an official AuroraWatch UK app and is not endorsed or supported by AuroraWatch UK.

## Installing

### Step 1 - Install the module
```javascript
cd ~/MagicMirror/modules
git clone https://github.com/AndyHazz/MMM-AuroraWatchUK.git
cd MMM-AuroraWatchUK
npm install
```

### Step 2 - Add module to `~MagicMirror/config/config.js`
Add this configuration into `config.js` file's
```json5
        {
            module: "MMM-AuroraWatchUK",
            position: "top_bar",
            config: {
                displayStatuses: ["green", "yellow", "amber", "red"], // Configurable statuses to display, see https://aurorawatch.lancs.ac.uk/alerts/ for descriptions
                showAlertMeaning: true, // set false to hide the longer description text
                weatherApiKey: "", // OpenWeathermap API key (optional, for clear skies and sunset check)
                // settings below only apply if you have an api key
                onlyDuringNight: false, // true = only show alerts between sunset and sunrise
                onlyDuringClearSkies: 100, // only show alerts if cloudiness % less than given value
                displayCloudCover: true, // include cloudcover text in the alert message
                latitude: 53.883553, // Default location (London)
                longitude: -1.260889, // Default location (London)
            }
        },
```

Once you're happy it's working, the recomended configuration would only show amber and red alerts, at night, when cloud cover is less than 20%

```json5
        {
            module: "MMM-AuroraWatchUK",
            position: "top_bar",
            config: {
                displayStatuses: ["amber", "red"],
                weatherApiKey: "",
                onlyDuringNight: true,
                onlyDuringClearSkies: 20,
                latitude: 53.883553,
                longitude: -1.260889,
            }
        },
```

## Updating
Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:
```
git pull
npm install
```
