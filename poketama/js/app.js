/**
 * Pokemon-Style 2D RPG - Application Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Game Engine State
    gameEngine.init();

    // 2. Initialize 2D Canvas Map Engine
    MapEngine.init('map-canvas');

    // 3. Initialize UI Controller
    UIController.init();

    // 4. Prompt Starter Pokemon Select Modal if Party is Empty
    if (!gameEngine.party || gameEngine.party.length === 0) {
        setTimeout(() => {
            const starterModal = document.getElementById('modal-starter');
            if (starterModal) starterModal.style.display = 'flex';
        }, 400);
    }
});
