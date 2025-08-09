console.log("Weather App script loaded");

// Global references for DOM elements
let searchForm,
    searchInput,
     recentSearchesListContainer,
     clearRecentSearchesButton,
     weatherInfoContainer,
     recentSearchesContainer,
     currentLocation
     ;

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

    console.log("Search Form:", !!searchForm);
    console.log("Search Input:", !!searchInput);
    console.log("Recent Searches List Container:", !!recentSearchesListContainer);
    console.log("Clear Recent Searches Button:", !!clearRecentSearchesButton);
    console.log("Weather Info Container:", !!weatherInfoContainer);
    console.log("Recent Searches Container:", !!recentSearchesContainer);
    console.log("Current Location Button:", !!currentLocation);

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
    // initializeWeatherApp(defaultCoordinates);
});

// Default coordinates for the weather API
let defaultCoordinates = {
    latitude: 28.6139,
    longitude: 77.2090,
    cityname: "New Delhi"
}

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
        // Show the recent searches container (parent)
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
        // Hide the recent searches container (parent) if no searches exist
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
    
