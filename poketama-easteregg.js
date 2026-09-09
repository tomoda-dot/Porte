/**
 * PokéTama Easter Egg Launcher for Porte
 * Tap header/logo 5 times or type 'poketama' to unlock the secret game!
 */
(function() {
    let tapCount = 0;
    let tapTimer = null;

    window.openPoketamaGame = function() {
        // Show Easter Egg Modal with iframe for seamless mobile/tablet play inside Porte!
        let modal = document.getElementById('poketama-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'poketama-modal-overlay';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(8, 9, 16, 0.95);
                backdrop-filter: blur(12px);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            `;
            modal.innerHTML = `
                <div style="position: absolute; top: 12px; right: 16px; z-index: 1000000; display: flex; gap: 10px;">
                    <a href="poketama/index.html" target="_blank" style="background: rgba(0,240,255,0.2); border: 1px solid #00f0ff; color: #fff; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 13px; font-weight: 700;">↗ 別タブで開く</a>
                    <button id="btn-close-poketama-modal" style="background: rgba(255,0,85,0.8); border: none; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer;">✕ 閉じる</button>
                </div>
                <iframe id="poketama-iframe" src="poketama/index.html" style="width: 100%; height: 100%; border: none; background: transparent;" allow="autoplay"></iframe>
            `;
            document.body.appendChild(modal);

            document.getElementById('btn-close-poketama-modal').onclick = function() {
                modal.style.display = 'none';
            };
        } else {
            modal.style.display = 'flex';
        }
    };

    function triggerEgg() {
        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);

        if (tapCount >= 5) {
            tapCount = 0;
            // Play secret fanfare sound if possible and open game!
            try {
                let ctx = new (window.AudioContext || window.webkitAudioContext)();
                let osc = ctx.createOscillator();
                let gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } catch(e) {}

            alert('🥚 隠し要素解放！\n育成＆バトルゲーム「ポケタマ (PokéTama)」を起動します！');
            window.openPoketamaGame();
        } else {
            tapTimer = setTimeout(function() {
                tapCount = 0;
            }, 1800);
        }
    }

    // Attach listeners on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Secret click/tap on side-hd, login-logo, or app title
        let targets = document.querySelectorAll('.side-hd, .login-logo, .hd-title, .app-header, header .hd-name');
        targets.forEach(function(el) {
            el.addEventListener('click', triggerEgg);
        });

        // 2. Secret keyboard sequence: 'poketama'
        let keys = '';
        window.addEventListener('keydown', function(e) {
            keys += e.key.toLowerCase();
            if (keys.length > 20) keys = keys.substring(keys.length - 20);
            if (keys.endsWith('poketama')) {
                keys = '';
                window.openPoketamaGame();
            }
        });
    });
})();
