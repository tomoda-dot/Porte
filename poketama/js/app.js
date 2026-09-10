/**
 * Monster Breeder Championship - Application Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Game Engine State
    gameEngine.init();

    // Initialize UI Controller
    UIController.init();

    // Prompt Starter Monster Selection if box is empty
    if (!gameEngine.activeMonster || gameEngine.monsterBox.length === 0) {
        setTimeout(() => {
            const starterModal = document.getElementById('modal-starter');
            if (starterModal) starterModal.style.display = 'flex';
        }, 300);
    }
});
