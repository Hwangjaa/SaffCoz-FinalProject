function showDetails(card) {
    const description = card.querySelector('.product-description');
    description.style.transform = 'translateY(0)';
}

function hideDetails(card) {
    const description = card.querySelector('.product-description');
    description.style.transform = 'translateY(100%)';
}