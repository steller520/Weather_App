console.log("Weather App script loaded");

const YOUR_API_KEY = CONFIG.API_KEY;

// Global references for DOM elements
let searchForm,
searchInput,
recentSearchesListContainer,
clearRecentSearchesButton,
weatherInfoContainer,
recentSearchesContainer,
currentLocation,
globalTempToggle,
toggleText;

// Global variables for temperature conversion
let currentTempCelsius = null;
let forecastTemperatures = []; // Store forecast temperatures
let isTemperatureInCelsius = true;

//  location validation function
function validateLocation(cityName) {
    // Remove extra spaces and convert to lowercase for validation
    const cleanedCity = cityName.trim().toLowerCase();
    
    // Check if input is empty
    if (!cleanedCity) {
        customalert('❌ Please enter a city name!');
        return false;
    }
    
    // Check minimum length
    if (cleanedCity.length < 2) {
        customalert('❌ City name must be at least 2 characters long!');
        return false;
    }
    
    // Check for invalid characters (only letters, spaces, and hyphens allowed)
    const validCityPattern = /^[a-zA-Z\s\-'\.]+$/;
    if (!validCityPattern.test(cleanedCity)) {
        customalert('❌ City name can only contain letters, spaces, and hyphens!');
        return false;
    }
    
    // Check for excessive length
    if (cleanedCity.length > 50) {
        customalert('❌ City name is too long!');
        return false;
    }
    
    // List of common invalid inputs
    const invalidInputs = [
        'test', 'example', 'city', 'location', 'place', 'town',
        '123', 'abc', 'xyz', 'asdf', 'qwerty', 'hello', 'world',
        'sample', 'demo', 'testing', 'enter', 'input'
    ];
    
    if (invalidInputs.includes(cleanedCity)) {
        customalert('❌ Please enter a valid city name!');
        return false;
    }
    
    return true;
}

// Enhanced API error handling function
function handleAPIError(error, cityName) {
    console.error('API Error:', error);
    
    if (error.message.includes('404')) {
        customalert(`❌ City "${cityName}" not found! Please check spelling or try another Indian city.`);
    } else if (error.message.includes('401')) {
        customalert('🔑 API key error! Please check your configuration.');
    } else if (error.message.includes('429')) {
        customalert('⏰ Too many requests! Please wait a moment and try again.');
    } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        customalert('🌐 Network error! Please check your internet connection.');
    } else {
        customalert('❌ Something went wrong! Please try again later.');
    }
}

//Dom content loaded event to ensure all elements are available
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    // Assign elements to globals
    searchForm = document.getElementById("search-form");
    searchInput = document.getElementById("search-input");
    recentSearchesListContainer = document.getElementById("recent-searches-list");
    recentSearchesContainer = document.getElementById("recent-searches");
    clearRecentSearchesButton = document.getElementById("clear-recent-searches");
    currentLocation = document.getElementById("current-location-button");
    weatherInfoContainer = document.getElementById("weather-info");
    globalTempToggle = document.getElementById("global-temp-toggle");
    toggleText = document.getElementById("toggle-text");

    // Debugging information
    console.log("Search Form:", !!searchForm);
    console.log("Search Input:", !!searchInput);
    console.log("Recent Searches List Container:", !!recentSearchesListContainer);
    console.log("Clear Recent Searches Button:", !!clearRecentSearchesButton);
    console.log("Weather Info Container:", !!weatherInfoContainer);
    console.log("Recent Searches Container:", !!recentSearchesContainer);
    console.log("Current Location Button:", !!currentLocation);
    console.log("Global Temperature Toggle Button:", !!globalTempToggle);

    // update recent searches and display recent searches from local storage
    updateRecentSearches();

    //toggle show/hide recent searches
    toggleShowHideRecentSearches();

    // Clear recent searches
    clearRecentSearchesButton.addEventListener("click", () => {
        // Clear recent searches from local storage
        localStorage.removeItem("recentSearches");
        // Clear the search input field
        searchInput.value = "";
        // Update the recent searches UI and hide if empty
        updateRecentSearches();
    });

    //  form submission with validation
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const city = searchInput.value.trim();
        
        console.log("searchInput value:", searchInput.value);
        
        // validation before processing
        if (validateLocation(city)) {
            // Clear any previous error styling
            searchInput.classList.remove('border-red-500');
            searchInput.classList.add('border-green-500');
            
            // Add to recent searches and initialize weather
            addRecentSearch(city);
            initializeWeatherApp(city);
            
            // Clear input after successful validation
            searchInput.value = '';
            setTimeout(() => {
                searchInput.classList.remove('border-green-500');
            }, 2000);
        } else {
            // Add error styling for invalid input
            searchInput.classList.add('border-red-500');
            searchInput.focus();
            
            // Remove error styling after 3 seconds
            setTimeout(() => {
                searchInput.classList.remove('border-red-500');
            }, 3000);
        }
    });

    // Real-time input validation
    searchInput.addEventListener('input', function(e) {
        const input = e.target.value;
        const inputField = e.target;
        
        // Remove any previous styling
        inputField.classList.remove('border-red-500', 'border-green-500', 'border-yellow-500');
        
        if (input.length > 0) {
            // Basic real-time validation
            const validCityPattern = /^[a-zA-Z\s\-'\.]+$/;
            
            if (!validCityPattern.test(input)) {
                inputField.classList.add('border-red-500');
                inputField.title = 'Only letters, spaces, and hyphens allowed';
            } else if (input.length < 2) {
                inputField.classList.add('border-yellow-500');
                inputField.title = 'At least 2 characters required';
            } else if (input.length >= 2) {
                inputField.classList.add('border-green-500');
                inputField.title = 'Valid city name format';
            }
        } else {
            inputField.title = '';
        }
    });

    // Current Location Button
    currentLocation.addEventListener("click", () => {
        // Get current location coordinates
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                data = {
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                };
                (async () => {
                    data.city = await fetchCityName(data.location.latitude, data.location.longitude);
                    // Now you can use data.city here
                    console.log("Current Location City:", data.city);
                    // Optionally, call initializeWeatherApp(data.city);
                    initializeWeatherApp(data.city);
                })();
                // Log the current location coordinates
                console.log("Current Location Coordinates:", data);
                
            }, (error) => {
                console.error("Error getting current location:", error);
                customalert('❌ Unable to get your location. Please enable location services.');
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            customalert('❌ Geolocation is not supported by your browser.');
        }
    });

    // Add event listener for global temperature toggle
    globalTempToggle.addEventListener("click", () => {
        toggleGlobalTemperatureUnit();
    });

    // Initialize the map and weather to New Delhi by default
    // New Delhi coordinates: lat 28.6139, lon 77.2090
    initializeLeafletMap(28.6139, 77.2090, "New Delhi", true);
    initializeWeatherApp("New Delhi");
});

// function to add recent searches
function addRecentSearch(city) {
    console.log("Adding recent search:", city);
    // Check if the city is already in recent searches
    const existingSearches = Array.from(recentSearchesListContainer.children).map(item => item.textContent);
    console.log("Existing searches:", existingSearches);
    if (!existingSearches.includes(city)) {
        const searchItem = document.createElement("div");
        searchItem.classList.add("recent-search-item", "p-2", "border-b", "border-gray-200","bg-yellow-100");
        searchItem.textContent = city;
        recentSearchesListContainer.appendChild(searchItem);
        searchItem.addEventListener("click", () => {
            searchInput.value = city;
            searchForm.dispatchEvent(new Event("submit"));
        });
    }else {
        console.log("City already exists in recent searches:", city);
    }
    console.log("Added recent search:", city);
    // Clear the search input field
    searchInput.value = "";

    // Save recent searches to local storage
    saveRecentSearches(city);
    updateRecentSearches();
}

// Function to save recent searches to local storage
function saveRecentSearches(city) {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    console.log("Saved recent searches:", recentSearches);
}

// Function to update recent searches display
function updateRecentSearches() {
    // Clear existing items
    recentSearchesListContainer.innerHTML = "";

    // Get recent searches from local storage
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    console.log("Updating recent searches:", recentSearches);

    if (recentSearches.length > 0 ) {
        // Show the recent searches container 
        recentSearchesContainer.classList.remove("hidden");

        // Populate the recent searches container
        recentSearches.forEach(city => {
            const searchItem = document.createElement("div");
            searchItem.classList.add("recent-search-item", "p-2", "border-b", "border-gray-200");
            searchItem.textContent = city;
            searchItem.addEventListener("click", () => {
                searchInput.value = city;
                searchForm.dispatchEvent(new Event("submit"));
            });
            recentSearchesListContainer.appendChild(searchItem);
        });
    } else {
        // Hide the recent searches container if no searches exist
        recentSearchesContainer.classList.add("hidden");
    }
}

//toggle show/hide recent searches
function toggleShowHideRecentSearches() {
    // Show/hide recent searches dropdown logic (attach only once)
    recentSearchesContainer.addEventListener("click", () => {
        recentSearchesContainer.classList.add("hidden");
    });

    // Show recent searches when clicking on the search input
    searchInput.addEventListener("click", () => {
        if (recentSearchesListContainer.children.length > 0) {
            recentSearchesContainer.classList.remove("hidden");
        }
    });
    // Hide recent searches when clicking outside
    document.body.addEventListener("click", (event) => {
        if (!recentSearchesContainer.contains(event.target) && !searchInput.contains(event.target)) {
            recentSearchesContainer.classList.add("hidden");
        }
    });
}

// Function to initialize weather app with enhanced error handling
async function initializeWeatherApp(city) {
    if (city) {
        // Clear any existing alerts from previous searches
        const customAlertDiv = document.getElementById('custom-alert');
        if (customAlertDiv) {
            customAlertDiv.innerHTML = '';
            customAlertDiv.style.display = 'none';
        }
        
        // Show loading state
        weatherInfoContainer.innerHTML = "Loading weather data...";
        
        // Fetch weather data for the given city
        let weatherdata = await fetchWeatherData(city);
        
        // Check if data was successfully fetched
        if (!weatherdata) {
            weatherInfoContainer.innerHTML = "<p class='text-red-500'>Failed to load weather data. Please try again.</p>";
            return;
        }
        
        console.log("Weather data fetched:", weatherdata);
        displayWeatherData(weatherdata);
        
        let forecastData = await fetchFiveDayForecast(city);
        if (forecastData) {
            updateForecastUI(forecastData);
        }
        
        // If weatherdata is valid, update the map
        if (weatherdata && weatherdata.coord) {
            initializeLeafletMap(weatherdata.coord.lat, weatherdata.coord.lon, city, true);
        }
        
        // Custom alerts for extreme weather
        if (weatherdata && weatherdata.main && weatherdata.weather && weatherdata.weather[0]) {
            const temp = weatherdata.main.temp;
            const condition = weatherdata.weather[0].main.toLowerCase();
            console.log("Checking alerts - Temperature:", temp, "Condition:", condition);
            
            // Set dynamic background based on weather condition
            let backgroundCondition = 'default';
            let forecastCondition = 'default';
            
            // Determine background condition for body
            if (temp >= 40) {  // Set to 40°C for hot weather
                console.log("Triggering hot weather alert");
                customalert('🔥 Too Hot! Stay hydrated.');
                backgroundCondition = 'hot';
                forecastCondition = 'hot';
            } else if (temp <= 5) {  // Set to 5°C for cold weather
                console.log("Triggering cold weather alert");
                customalert('❄️ Too Cold! Dress warmly.');
                backgroundCondition = 'cold';
                forecastCondition = 'cold';
            }
            //other alerts
            if (condition.includes('rain')) { 
                console.log("Triggering rain alert");
                customalert('🌧️ Extreme Rain! Take precautions.');
                backgroundCondition = 'rain';
                forecastCondition = 'rain';
            } else if (condition.includes('snow')) {
                console.log("Triggering snow alert");
                customalert('🌨️ Snow Alert! Roads may be slippery.');
                backgroundCondition = 'snow';
                forecastCondition = 'snow';
            } else if (condition.includes('clear') || condition.includes('sunny')) {
                forecastCondition = 'clear';
            }
            
            // Apply the dynamic backgrounds
            setDynamicBackground(backgroundCondition);
            setForecastBackground(forecastCondition, city);
            
            // Always show a test alert for now
            console.log("Triggering test alert");
            customalert('🌟 Weather data loaded successfully!');
        }
    }
}

// Enhanced fetch weather data with proper error handling
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${YOUR_API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('404: City not found');
            } else if (response.status === 401) {
                throw new Error('401: Invalid API key');
            } else if (response.status === 429) {
                throw new Error('429: Rate limit exceeded');
            } else {
                throw new Error(`${response.status}: API request failed`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleAPIError(error, city);
        return null;
    }
}

// Display weather data on the UI
function displayWeatherData(data) {
    if (!data || !data.name) {
        weatherInfoContainer.innerHTML = "<p class='text-red-500'>No weather data available.</p>";
        return;
    }
    
    // Store the current temperature in Celsius for conversion
    currentTempCelsius = data.main?.temp || 0;
    
    // Update the weather info display with simplified structure
    weatherInfoContainer.innerHTML = `
        <p class="font-bold">Location:</p>
        <p class="location">${data.name || 'N/A'}, ${data.sys?.country || ''}</p>
        <p class="font-bold mt-2">Temperature:</p>
        <p id="temperature-display" class="temperature text-3xl font-bold text-purple-800">${formatTemperature(currentTempCelsius)}</p>
        <p class="font-bold mt-2">Condition:</p>
        <p class="condition">${data.weather?.[0]?.description || 'N/A'}</p>
    `;
}

// Global temperature conversion functions
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function formatTemperature(tempCelsius) {
    if (isTemperatureInCelsius) {
        return `${Math.round(tempCelsius)}°C`;
    } else {
        const fahrenheit = celsiusToFahrenheit(tempCelsius);
        return `${Math.round(fahrenheit)}°F`;
    }
}

// Toggle temperature unit
function toggleGlobalTemperatureUnit() {
    isTemperatureInCelsius = !isTemperatureInCelsius;
    
    // Update the toggle button text
    if (toggleText) {
        toggleText.textContent = isTemperatureInCelsius ? "°C" : "°F";
    }
    
    // Update all temperatures on the page
    updateAllTemperatures();
    
    console.log(`Switched to ${isTemperatureInCelsius ? 'Celsius' : 'Fahrenheit'}`);
}

// Update all temperature displays
function updateAllTemperatures() {
    // Update current weather temperature
    const currentTempDisplay = document.getElementById("temperature-display");
    if (currentTempDisplay && currentTempCelsius !== null) {
        currentTempDisplay.textContent = formatTemperature(currentTempCelsius);
    }
    
    // Update forecast temperatures
    updateForecastTemperatures();
    
    // Update any alert messages if needed
    updateAlertTemperatures();
}

// Update forecast temperatures
function updateForecastTemperatures() {
    const forecastItems = document.querySelectorAll('.forecast-item');
    forecastItems.forEach((item, index) => {
        const tempElement = item.querySelector('.temperature');
        if (tempElement && forecastTemperatures[index]) {
            tempElement.textContent = formatTemperature(forecastTemperatures[index]);
        }
    });
    
    // Update detailed forecast if visible
    const detailsDiv = document.getElementById('forecast-details');
    if (detailsDiv && detailsDiv.innerHTML) {
        // If details are showing, we need to update the detailed temperature display
        const detailTempElements = detailsDiv.querySelectorAll('p');
        detailTempElements.forEach(p => {
            if (p.textContent.includes('Temperature:') && forecastTemperatures.length > 0) {
                // Update detailed temperature display
                const tempMatch = p.textContent.match(/(\d+\.?\d*)°[CF]/);
                if (tempMatch) {
                    const tempCelsius = parseFloat(tempMatch[1]);
                    if (p.textContent.includes('°C') || p.textContent.includes('°F')) {
                        p.innerHTML = p.innerHTML.replace(/(\d+\.?\d*)°[CF]/, formatTemperature(tempCelsius));
                    }
                }
            }
        });
    }
}

// Update alert temperatures
function updateAlertTemperatures() {
    // Update any temperature-related alerts if they contain temperature values
    const alerts = document.querySelectorAll('.custom-alert');
    alerts.forEach(alert => {
        const text = alert.textContent;
        if (text.includes('°')) {
            // Update temperature in alert messages if needed
            // This is for future enhancement if alerts show temperature values
        }
    });
}

// Function to fetch city name from coordinates with error handling
async function fetchCityName(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${YOUR_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city name');
        }
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching city name:', error);
        customalert('❌ Unable to get location name from coordinates.');
        return 'Unknown Location';
    }
}

// Function to initialize the map
// Store map instance globally
let globalMap = null;
let currentMarker = null;

function initializeLeafletMap(latitude, longitude, cityName, isDefault = false) {
    console.log("Updating map for:", cityName, "Coords:", latitude, longitude);

    // Coerce to numbers and validate
    const latNum = Number(latitude);
    const lonNum = Number(longitude);
    if (
        typeof latNum !== 'number' || isNaN(latNum) ||
        typeof lonNum !== 'number' || isNaN(lonNum)
    ) {
        console.error("Invalid latitude or longitude for map:", latitude, longitude);
        return;
    }

    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.style.display = 'block';
    }

    // Reduced timeout for faster response
    setTimeout(() => {
        try {
            if (!globalMap) {
                // Create map for first time
                console.log("Creating new map");
                globalMap = L.map('map-container', {
                    center: [latNum, lonNum],
                    zoom: 10,
                    zoomControl: true,
                    attributionControl: true
                });
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(globalMap);
                // Force focus after creation
                globalMap.setView([latNum, lonNum], 12, { animate: true });
                console.log("Map created successfully");
            } else {
                // Update existing map
                console.log("Updating existing map to new location");
                globalMap.setView([latNum, lonNum], 12, {
                    animate: true,
                    duration: 0.5  // Faster animation
                });
            }

            // Remove old marker
            if (currentMarker) {
                globalMap.removeLayer(currentMarker);
            }

            // Add new marker
            currentMarker = L.marker([latNum, lonNum]).addTo(globalMap);

            const popupContent = isDefault 
                ? `<div class="text-center"><b>${cityName}</b><br><small style="color: #666;">Default Location</small><br>Lat: ${latNum.toFixed(4)}, Lng: ${lonNum.toFixed(4)}</div>`
                : `<div class="text-center"><b>${cityName}</b><br>Lat: ${latNum.toFixed(4)}, Lng: ${lonNum.toFixed(4)}</div>`;

            // Bind popup with default options (no offset, no custom width)
            currentMarker.bindPopup(popupContent, { autoPan: true }).openPopup();

            // Ensure popup is fully visible by panning to marker
            globalMap.panTo([latNum, lonNum], { animate: true });

            // Force size recalculation and refocus
            setTimeout(() => {
                if (globalMap) {
                    globalMap.invalidateSize();
                    globalMap.panTo([latNum, lonNum], { animate: true });
                    // Reopen popup to ensure it's visible after resize
                    if (currentMarker) {
                        currentMarker.openPopup();
                        // Use panInside if available to ensure popup is fully inside map viewport
                        if (currentMarker.getPopup && currentMarker.getPopup().getElement && globalMap.panInside) {
                            const popupEl = currentMarker.getPopup().getElement();
                            if (popupEl) {
                                globalMap.panInside(popupEl, { animate: true });
                            }
                        }
                    }
                }
            }, 50);

        } catch (error) {
            console.error("Error with map:", error);
            customalert('❌ Error loading map. Please try again.');
        }
    }, 50);
}

// Enhanced five-days-forecast with error handling
async function fetchFiveDayForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},IN&appid=${YOUR_API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('404: City not found');
            } else if (response.status === 401) {
                throw new Error('401: Invalid API key');
            } else if (response.status === 429) {
                throw new Error('429: Rate limit exceeded');
            } else {
                throw new Error(`${response.status}: API request failed`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleAPIError(error, city);
        return null;
    }
}

// Update the UI with the fetched forecast data
function updateForecastUI(forecastData) {
    const forecastContainer = document.getElementById('five-days-forecast');
    forecastContainer.innerHTML = '';
    
    // Clear previous forecast temperatures
    forecastTemperatures = [];

    if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
        forecastContainer.innerHTML = "<p class='text-red-500'>No forecast data available.</p>";
        return;
    }

    // Extract one forecast per day (first entry for each new day)
    const dailyForecasts = [];
    const usedDates = new Set();
    for (const entry of forecastData.list) {
        const date = new Date(entry.dt * 1000);
        const dayStr = date.toISOString().split('T')[0];
        if (!usedDates.has(dayStr)) {
            dailyForecasts.push(entry);
            usedDates.add(dayStr);
        }
        if (dailyForecasts.length === 5) break;
    }

    // Prepare a container for detailed info below the forecast if not present
    let detailsDiv = document.getElementById('forecast-details');
    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        detailsDiv.id = 'forecast-details';
        detailsDiv.className = 'w-full mt-4';
        forecastContainer.parentElement.appendChild(detailsDiv);
    }
    detailsDiv.innerHTML = '';

    // Helper to show/hide the forecast area
    function setForecastVisibility(show) {
        if (show) {
            forecastContainer.style.display = '';
        } else {
            forecastContainer.style.display = 'none';
        }
    }

    // Display each day's forecast
    dailyForecasts.forEach((day, idx) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = day.main.temp;
        const condition = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const humidity = day.main.humidity;
        const wind = day.wind.speed;
        const pressure = day.main.pressure;
        const feelsLike = day.main.feels_like;
        const minTemp = day.main.temp_min;
        const maxTemp = day.main.temp_max;

        // Store temperature for global conversion
        forecastTemperatures[idx] = temp;

        // Main forecast card with hover effect
        const card = document.createElement('div');
        card.className = "forecast-item border-2 border-blue-400 rounded-lg p-3 m-1 shadow-md flex flex-col items-center cursor-pointer relative group transition-transform duration-200 hover:scale-105";
        card.innerHTML = `
            <p class=\"font-bold\">${dayName}</p>
            <img src=\"${iconUrl}\" alt=\"${condition}\" class=\"w-12 h-12\" />
            <p class=\"temperature text-lg\">${formatTemperature(temp)}</p>
            <p class=\"condition text-sm capitalize\">${condition}</p>
            <div class=\"absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-100 border border-blue-400 text-xs rounded p-2 shadow-lg min-w-[120px] text-center\">
                <strong>Humidity:</strong> ${humidity}%<br>
                <strong>Wind:</strong> ${wind} m/s<br>
                <strong>Pressure:</strong> ${pressure} hPa
            </div>
        `;
        // On click, show full details below
        card.addEventListener('click', () => {
            detailsDiv.innerHTML = `
                <div class=\"border-2 border-purple-400 rounded-lg p-4 shadow-lg max-w-md mx-auto\">
                    <h4 class=\"text-xl font-bold mb-2\">${dayName} - Full Forecast</h4>
                    <img src=\"${iconUrl}\" alt=\"${condition}\" class=\"w-16 h-16 mx-auto\" />
                    <p><strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
                    <p><strong>Temperature:</strong> ${formatTemperature(temp)} (min: ${formatTemperature(minTemp)}, max: ${formatTemperature(maxTemp)})</p>
                    <p><strong>Feels Like:</strong> ${formatTemperature(feelsLike)}</p>
                    <p><strong>Condition:</strong> ${condition}</p>
                    <p><strong>Humidity:</strong> ${humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${wind} m/s</p>
                    <p><strong>Pressure:</strong> ${pressure} hPa</p>
                    <button id=\"close-forecast-details\" class=\"mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 transition\">Close</button>
                </div>
            `;
            setForecastVisibility(false);
            detailsDiv.scrollIntoView({ behavior: 'smooth' });
            // Add close button handler
            document.getElementById('close-forecast-details').onclick = () => {
                detailsDiv.innerHTML = '';
                setForecastVisibility(true);
            };
        });
        forecastContainer.appendChild(card);
    });
}

//Function to display custom alerts
function customalert(message) {
    console.log("customalert called with message:", message);
    
    const customAlertDiv = document.getElementById('custom-alert');
    if (!customAlertDiv) {
        console.error('Custom alert div not found');
        return;
    }

    // Better responsive behavior for different screen sizes - REMOVED PURPLE BORDER
    if (window.innerWidth <= 480) {
        // Mobile phones - fixed positioning at top
        customAlertDiv.className = "fixed top-16 left-2 right-2 z-50 max-h-32 overflow-y-auto scrollbar-hide p-2 bg-transparent rounded-lg";
    } else if (window.innerWidth <= 768) {
        // iPad Mini and tablets - relative positioning with limited height
        customAlertDiv.className = "mt-4 relative max-h-40 overflow-y-auto scrollbar-hide p-2 bg-transparent rounded-lg";
    } else {
        // Desktop - normal positioning
        customAlertDiv.className = "mt-4 relative max-h-none overflow-visible p-2 bg-transparent rounded-lg";
    }
    
    // Support both string and object input for flexibility
    let msg = message;
    let type = 'info';
    if (typeof message === 'object' && message !== null) {
        msg = message.text;
        type = message.type || 'info';
    }
    let alertText = '';
    let alertColor = 'bg-gradient-to-r from-purple-500 to-purple-600 '; // Default color
    switch (type) {
        case 'hot':
            alertText = '🔥 Too Hot! Stay hydrated.';
            alertColor = 'bg-gradient-to-r from-orange-400 to-red-500 border-red-200';
            break;
        case 'cold':
            alertText = '❄️ Too Cold! Dress warmly.';
            alertColor = 'bg-gradient-to-r from-blue-400 to-blue-600 border-blue-200';
            break;
        case 'rain':
            alertText = '🌧️ Extreme Rain! Take precautions.';
            alertColor = 'bg-gradient-to-r from-indigo-400 to-indigo-600 border-indigo-200';
            break;
        case 'snow':
            alertText = '🌨️ Snow Alert! Roads may be slippery.';
            alertColor = 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-200';
            break;
        default:
            alertText = msg;
            alertColor = 'bg-gradient-to-r from-green-400 to-green-600 border-green-200';
    }
    
    console.log("Alert text to display:", alertText);
    
    // Create alert with responsive sizing
    let alertBox = document.createElement('div');
    const isMobile = window.innerWidth <= 480;
    alertBox.className = `custom-alert ${alertColor} text-white ${isMobile ? 'px-3 py-2 text-sm' : 'px-6 py-4 text-lg'} rounded-lg shadow-lg font-semibold mb-2 border-2 transition-all duration-300`;
    alertBox.innerText = alertText;
    
    console.log("Custom alert div found:", !!customAlertDiv);
    
    if (customAlertDiv) {
        // Show the container
        customAlertDiv.style.display = 'block';
        customAlertDiv.appendChild(alertBox);
        console.log("Alert added to custom-alert div");
        console.log("Total alerts now:", customAlertDiv.children.length);
        
        // Only scroll to top on very small screens (mobile phones)
        if (window.innerWidth <= 480) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    } else {
        // fallback to body if not found
        console.log("Fallback: adding alert to body");
        alertBox.style.cssText = 'position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; z-index: 9999 !important;';
        document.body.appendChild(alertBox);
    }
    
    // Remove this specific alert after 5 seconds
    setTimeout(() => {
        if (alertBox.parentNode) {
            alertBox.remove();
            console.log("Alert removed after 5 seconds");
            
            // Check if any alerts remain in the container
            if (customAlertDiv && customAlertDiv.children.length === 0) {
                console.log("No alerts remaining, hiding container");
                customAlertDiv.style.display = 'none';
            }
            
            console.log("Remaining alerts:", customAlertDiv ? customAlertDiv.children.length : 0);
        }
    }, 5000);
}

//set dynamic background
function setDynamicBackground(weatherCondition) {
    const body = document.body;
    body.classList.remove('bg-hot', 'bg-cold', 'bg-rain', 'bg-snow');

    switch (weatherCondition) {
        case 'hot':
            body.classList.add('bg-hot');
            break;
        case 'cold':
            body.classList.add('bg-cold');
            break;
        case 'rain':
            body.classList.add('bg-rain');
            break;
        case 'snow':
            body.classList.add('bg-snow');
            break;
        default:
            body.classList.add('bg-default');
    }
}

//set dynamic forecast background images
function setForecastBackground(weatherCondition, cityName) {
    const forecastDiv = document.getElementById('forecast');
    if (!forecastDiv) return;
    
    // Weather condition background images from Unsplash
    const backgroundImages = {
        hot: [
            'https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1200&q=80', // Desert sunset
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Hot summer landscape
            'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80'  // Desert scene
        ],
        cold: [
            'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?auto=format&fit=crop&w=1200&q=80', // Snow mountain
            'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=1200&q=80', // Winter landscape
            'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80'  // Snowy trees
        ],
        rain: [
            'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80', // Rainy street
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80', // Rain drops
            'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80'  // Stormy clouds
        ],
        snow: [
            'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?auto=format&fit=crop&w=1200&q=80', // Heavy snow
            'https://images.unsplash.com/photo-1548777123-d6da85918529?auto=format&fit=crop&w=1200&q=80', // Snow covered landscape
            'https://images.unsplash.com/photo-1542662565-7e4b33d7671b?auto=format&fit=crop&w=1200&q=80'  // Blizzard scene
        ],
        clear: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Clear sky mountains
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', // Sunny landscape
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80'  // Blue sky clouds
        ],
        default: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Default mountain
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Nature scene
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'  // Forest landscape
        ]
    };
    
    // Get random image from the weather condition category
    const images = backgroundImages[weatherCondition] || backgroundImages.default;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    // Apply the background image with smooth transition
    forecastDiv.style.transition = 'background-image 0.8s ease-in-out';
    forecastDiv.style.backgroundImage = `url('${randomImage}')`;
    forecastDiv.style.backgroundSize = 'cover';
    forecastDiv.style.backgroundPosition = 'center';
    forecastDiv.style.backgroundRepeat = 'no-repeat';
    
    console.log(`Applied ${weatherCondition} background for ${cityName}:`, randomImage);
}
