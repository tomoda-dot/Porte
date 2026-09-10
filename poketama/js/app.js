/**
 * app.js
 * PokéTama Story RPG Main Application Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Game Engine (Load Save Data)
    window.gameEngine.init();

    // 2. Initialize UI Controller
    window.UIController.init();

    // 3. Check save state: Has the user completed Prof. Tamaki's intro?
    if (window.gameEngine.hasSeenIntro) {
        // Resume saved journey directly at Main Dashboard
        window.UIController.switchView('main-dashboard');
        window.UIController.updatePartyList();
        window.UIController.updateProgressBanner();
    } else {
        // Start fresh: Begin Prof. Tamaki prologue dialogue sequence
        window.UIController.switchView('prof-intro');
        window.StoryModule.init();
    }
});
