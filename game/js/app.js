/**
 * PokéTama Main Application Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Game Engine State
    gameEngine.init();

    // Initialize UI Controller
    UIController.init();

    console.log('✨ PokéTama Odyssey initialized successfully!');
});
