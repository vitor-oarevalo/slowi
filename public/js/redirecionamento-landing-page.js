let featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach(card => {
    card.addEventListener("click", function() {
        window.location.href = "login.html";
    });
});