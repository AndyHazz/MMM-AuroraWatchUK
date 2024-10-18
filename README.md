# MMM-AuroraWatchUK

Module for [MagicMirror²](https://github.com/MichMich/MagicMirror/), to show an alert banner based on aurora activity alerts provided by AuroraWatch UK https://aurorawatch.lancs.ac.uk/

This is not an official AuroraWatch UK app and is not endorsed or supported by AuroraWatch UK.

![Alt text](/img/demo.png "A preview of the MMM-AuroraWatchUK module showing a yellow alert.")

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
            }
        },
```
## Updating
Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:
```
git pull
npm install
```
