document.addEventListener('DOMContentLoaded', function() {
    const exploreCards = document.querySelectorAll('.explore-card');
    
    exploreCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('.explore-category').textContent;
            // You can add navigation or other functionality here
            console.log(`Selected category: ${category}`);
        });
    });
}); 