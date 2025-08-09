console.log("Weather App script loaded");

// Global references for DOM elements
let searchForm, searchInput, recentSearchesContainer, clearRecentSearchesButton;

//Dom content loaded event to ensure all elements are available
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    // Assign elements to globals
    searchForm = document.getElementById("search-form");
    searchInput = document.getElementById("search-input");
    recentSearchesContainer = document.getElementById("recent-searches-list");
    clearRecentSearchesButton = document.getElementById("clear-recent-searches");

    console.log("Search Form:", !!searchForm);
    console.log("Search Input:", !!searchInput);
    console.log("Recent Searches Container:", !!recentSearchesContainer);
    console.log("Clear Recent Searches Button:", !!clearRecentSearchesButton);

    // Load and display recent searches from local storage
    loadRecentSearches();

    // Add event listener for search form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            console.log("searchInput value:", searchInput.value);
            addRecentSearch(city);
        }
    });

    // Initialize the weather app with default coordinates
    initializeWeatherApp(defaultCoordinates);
});
// Function to load and display recent searches from local storage
function loadRecentSearches() {
    // Clear container first
    recentSearchesContainer.innerHTML = "";
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches.forEach(city => {
        const searchItem = document.createElement("div");
        searchItem.classList.add("recent-search-item", "p-2", "border-b", "border-gray-200");
        searchItem.textContent = city;
        searchItem.addEventListener("click", () => {
            searchInput.value = city;
            searchForm.dispatchEvent(new Event("submit"));
        });
        recentSearchesContainer.appendChild(searchItem);
    });
}

// Default coordinates for the weather API
const defaultCoordinates = {
    latitude: 28.6139,
    longitude: 77.2090,
    cityname: "New Delhi"
}

// function to add recent searches
function addRecentSearch(city) {
    console.log("Adding recent search:", city);
    // Check if the city is already in recent searches
    const existingSearches = Array.from(recentSearchesContainer.children).map(item => item.textContent);
    console.log("Existing searches:", existingSearches);
    if (!existingSearches.includes(city)) {
        const searchItem = document.createElement("div");
        searchItem.classList.add("recent-search-item", "p-2", "border-b", "border-gray-200","bg-yellow-100");
        searchItem.textContent = city;
        recentSearchesContainer.appendChild(searchItem);
        searchItem.addEventListener("click", () => {
            searchInput.value = city;
            searchForm.dispatchEvent(new Event("submit"));
        });
    }
    console.log("Added recent search:", city);


    // Save recent searches to local storage
    saveRecentSearches(city);
    
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
