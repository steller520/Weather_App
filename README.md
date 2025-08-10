# 🌤️ Weather Forecast Application

A modern, responsive weather forecast application built with JavaScript, HTML, and Tailwind CSS. Get real-time weather data, 5-day forecasts, and interactive maps for cities across India.

![Weather App](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)

## ✨ Features

### 🎯 Core Functionality
- **City Search**: Search weather for any Indian city
- **Current Location**: Get weather for your current GPS location
- **5-Day Forecast**: Extended weather predictions with detailed information
- **Interactive Map**: View location on map with markers and popups
- **Recent Searches**: Quick access to previously searched cities

### 🌡️ Temperature Controls
- **Global Temperature Toggle**: Switch between Celsius and Fahrenheit for all temperatures
- **Real-time Conversion**: Instant temperature updates across the entire application
- **Persistent Preference**: Temperature unit choice maintained across sessions

### 🎨 Visual Features
- **Dynamic Backgrounds**: Weather-based background themes (hot, cold, rain, snow, clear)
- **Custom Alerts**: Beautiful gradient alerts for extreme weather conditions
- **Weather Icons**: OpenWeatherMap icons for visual weather representation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 Weather Data
- **Current Conditions**: Temperature, humidity, wind speed, weather description
- **Location Details**: City name, country, coordinates
- **Forecast Details**: Date, temperature ranges, feels-like temperature, pressure
- **Weather Alerts**: Custom notifications for extreme temperatures (>40°C or <5°C)

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API requests
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/steller520/Weather_App.git
   cd Weather_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Copy `src/js/config.example.js` to `src/js/config.js`
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   CONFIG = {
       API_KEY: "your_actual_api_key_here"
   };
   ```

4. **Build Tailwind CSS**
   ```bash
   npm run build-css
   ```
   Or for development with auto-reload:
   ```bash
   npm run watch-css
   ```

5. **Launch the Application**
   - Open `index.html` in your web browser
   - Or use a local server (recommended):
   ```bash
   npx serve .
   ```

## 🎮 Usage Guide

### Basic Operations

1. **Search by City Name**
   - Enter any Indian city name in the search field
   - Press Enter or click "Get Weather"
   - View current weather and 5-day forecast

2. **Use Current Location**
   - Click the "Current Location" button
   - Allow location access when prompted
   - Weather data will load for your current position

3. **Access Recent Searches**
   - Click on the search input field
   - Select from previously searched cities
   - Click "Clear All" to remove search history

### Advanced Features

4. **Temperature Unit Conversion**
   - Click the thermometer button in the top-right header
   - All temperatures instantly convert between °C and °F
   - Preference is remembered for future searches

5. **Interactive Forecast**
   - Hover over forecast cards for quick details
   - Click any forecast card for detailed information
   - View expanded data including pressure, humidity, and wind speed

6. **Map Interaction**
   - View city location on the interactive map
   - Click map markers for location details
   - Map updates automatically when searching new cities

## 🛠️ Technical Architecture

### Project Structure
```
Weather_App/
├── index.html                 # Main HTML file
├── src/
│   ├── assets/
│   │   ├── favicon/          # App icons and favicons
│   │   └── images/           # Static images
│   ├── css/
│   │   ├── input.css         # Tailwind source file
│   │   └── output.css        # Compiled CSS
│   └── js/
│       ├── config.example.js # API configuration template
│       ├── config.js         # Your API configuration (not in git)
│       └── script.js         # Main application logic
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
└── README.md                 # Project documentation
```

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom components
- **API**: OpenWeatherMap REST API
- **Mapping**: Leaflet.js for interactive maps
- **Icons**: Font Awesome, OpenWeatherMap icons
- **Storage**: Browser Local Storage for recent searches

### Key JavaScript Modules
- **Weather Data Management**: API calls, data processing, error handling
- **UI Controllers**: DOM manipulation, event handling, responsive updates
- **Temperature System**: Global conversion, formatting, persistence
- **Map Integration**: Leaflet initialization, marker management, popups
- **Alert System**: Custom notifications, gradient styling, auto-dismiss

## 🎨 UI/UX Design

### Design Principles
- **Clean Interface**: Minimal, intuitive layout with clear visual hierarchy
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Color Psychology**: Weather-appropriate color schemes and gradients
- **Accessibility**: High contrast ratios, keyboard navigation, screen reader support

### Visual Themes
- **Hot Weather**: Orange to red gradients, desert-themed backgrounds
- **Cold Weather**: Blue gradients, winter landscape backgrounds
- **Rainy Weather**: Gray-blue themes, stormy backgrounds
- **Clear Weather**: Bright blues and whites, sunny landscape backgrounds

## 🔧 Configuration Options

### API Configuration
```javascript
CONFIG = {
    API_KEY: "your_openweathermap_api_key",
    BASE_URL: "https://api.openweathermap.org/data/2.5/"
};
```

### Customizable Features
- Temperature thresholds for alerts (currently 40°C hot, 5°C cold)
- Background image collections for different weather conditions
- Alert display duration (currently 5 seconds)
- Map zoom levels and initial coordinates

## 🚨 Error Handling

### Robust Error Management
- **API Failures**: Graceful handling with user-friendly messages
- **Network Issues**: Offline detection and retry mechanisms
- **Invalid Inputs**: Input validation with helpful error messages
- **Geolocation Errors**: Fallback options when location access denied

### Custom Alert System
- **Visual Alerts**: No intrusive JavaScript alert() popups
- **Contextual Messages**: Weather-specific alert styling and icons
- **Auto-dismiss**: Alerts automatically remove after 5 seconds
- **Stack Support**: Multiple alerts can display simultaneously

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome**: 60+ ✅
- **Firefox**: 55+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅

### Mobile Support
- **iOS Safari**: 12+ ✅
- **Android Chrome**: 60+ ✅
- **Responsive Breakpoints**: 320px - 2560px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Internshala License.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing comprehensive weather data API
- **Leaflet.js** for the excellent mapping library
- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for the beautiful icon collection
- **Unsplash** for high-quality background images

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/steller520/Weather_App/issues) page
2. Create a new issue with detailed description
3. Include browser version and error messages

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Initial release with all core features
- ✅ Global temperature conversion
- ✅ Dynamic weather backgrounds
- ✅ Interactive mapping integration
- ✅ Custom alert system
- ✅ Responsive design for all devices

---

**Built with ❤️ for accurate weather forecasting and delightful user experience**