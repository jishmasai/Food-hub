document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    const resultsContainer = document.querySelector('.search-results-container');

    // Load explore content but keep it hidden initially
    let exploreContainer;
    fetch('explore.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const exploreSection = doc.querySelector('.explore-section');
            
            // Create a container for explore content
            exploreContainer = document.createElement('div');
            exploreContainer.id = 'explore-container';
            exploreContainer.innerHTML = exploreSection.outerHTML;
            exploreContainer.style.display = 'none'; // Hide initially
            
            // Insert after results container
            resultsContainer.insertAdjacentElement('afterend', exploreContainer);
            
            // Load explore styles
            if (!document.querySelector('link[href="explore.css"]')) {
                const linkElem = document.createElement('link');
                linkElem.rel = 'stylesheet';
                linkElem.href = 'explore.css';
                document.head.appendChild(linkElem);
            }
        });

    // Hamburger menu functionality
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });

    function toggleView(showResults, showExplore) {
        resultsContainer.style.display = showResults ? 'block' : 'none';
        if (exploreContainer) {
            exploreContainer.style.display = showExplore ? 'block' : 'none';
        }
    }

    function handleSearch() {
        const searchTerm = searchBar.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            // Show only results container when empty
            toggleView(true, false);
            resultsList.innerHTML = '';
            return;
        }

        const results = searchRestaurants(searchTerm);
        
        // Keywords that should trigger the explore section
        const foodKeywords = [
            'biryani', 'biriyani', 'mandhi', 'madhi', 'burger', 'pizza', 
            'pasta', 'chinese', 'indian', 'italian', 'asian', 'dessert', 
            'healthy', 'seafood', 'mexican', 'bbq', 'vegan', 'mediterranean', 
            'drinks', 'street food', 'breakfast', 'comfort food', 'international'
        ];
        const shouldShowExplore = foodKeywords.some(keyword => searchTerm.includes(keyword));

        if (results.length === 0) {
            // Show no results message and explore section if searching for food
            toggleView(true, shouldShowExplore);
            resultsList.innerHTML = '<p class="no-results">No restaurants found.</p>';
        } else {
            // Show results and explore section if searching for food
            toggleView(true, shouldShowExplore);
            displayResults(results);
        }
    }

    // Search event listeners
    searchButton.addEventListener('click', handleSearch);
    searchBar.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Initial state: show only results container
    toggleView(true, false);

    // Sample restaurant data (in real application, this would come from a backend API)
    const restaurants = [
        {
            id: 1,
            name: "Burger Palace",
            image: "burger-palace.jpg",
            rating: 4.5,
            priceRange: "$$",
            distance: "1.2 miles",
            menu: [
                { item: "Classic Burger", price: 12.99 },
                { item: "Cheeseburger", price: 14.99 },
                { item: "Veggie Burger", price: 13.99 }
            ]
        },
        {
            id: 2,
            name: "Pizza Heaven",
            image: "pizza-heaven.jpg",
            rating: 4.8,
            priceRange: "$$$",
            distance: "0.8 miles",
            menu: [
                { item: "Margherita Pizza", price: 16.99 },
                { item: "Pepperoni Pizza", price: 18.99 },
                { item: "Vegetarian Pizza", price: 17.99 }
            ]
        }
        // Add more restaurant data as needed
    ];

    // Search functionality
    const resultsList = document.getElementById('results-list');
    const sortBy = document.getElementById('sort-by');

    function searchRestaurants(searchTerm) {
        return restaurants.filter(restaurant => {
            const hasMatchingFood = restaurant.menu.some(menuItem => 
                menuItem.item.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const hasMatchingName = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
            return hasMatchingFood || hasMatchingName;
        });
    }

    function displayResults(results) {
        resultsList.innerHTML = '';
        
        if (results.length === 0) {
            resultsList.innerHTML = '<p class="no-results">No restaurants found matching your search.</p>';
            return;
        }

        results.forEach(restaurant => {
            const restaurantCard = document.createElement('div');
            restaurantCard.className = 'restaurant-card';
            
            const matchingMenuItems = restaurant.menu.filter(item => 
                item.item.toLowerCase().includes(searchBar.value.toLowerCase())
            );

            restaurantCard.innerHTML = `
                <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 ? '½' : ''}
                        </div>
                        <span>${restaurant.rating}</span>
                    </div>
                    <div class="restaurant-distance">${restaurant.distance}</div>
                    <div class="price-range">${restaurant.priceRange}</div>
                    <div class="matching-items">
                        ${matchingMenuItems.map(item => `
                            <div class="food-item">
                                <span>${item.item}</span>
                                <span class="food-price">$${item.price.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            resultsList.appendChild(restaurantCard);
        });
    }

    sortBy.addEventListener('change', () => {
        const results = searchRestaurants(searchBar.value.trim());
        const sortedResults = [...results].sort((a, b) => {
            switch (sortBy.value) {
                case 'rating':
                    return b.rating - a.rating;
                case 'price-low':
                    return a.menu[0].price - b.menu[0].price;
                case 'price-high':
                    return b.menu[0].price - a.menu[0].price;
                default:
                    return 0;
            }
        });
        displayResults(sortedResults);
    });
}); 