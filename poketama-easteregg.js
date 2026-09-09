/**
 * PokéTama Easter Egg Launcher for Porte TOP Page
 * Exclusive hidden trigger: Tap the TOP Page Mobile Header / Sidebar Title "ひとつぎ" 5 times!
 */
(function() {
    let tapCount = 0;
    let tapTimer = null;

    window.openPoketamaGame = function() {
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
            try {
                let ctx = new (window.AudioContext || window.webkitAudioContext)();
                let osc = ctx.createOscillator();
                let gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
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

    // Attach 5-tap trigger ONLY to TOP page mobile header title (.side-hd)
    window.initPoketamaMobileTrigger = function() {
        let mobileHitotsugiTarget = document.querySelector('.side-hd');
        if (mobileHitotsugiTarget) {
            mobileHitotsugiTarget.removeEventListener('click', triggerEgg);
            mobileHitotsugiTarget.addEventListener('click', triggerEgg);
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.initPoketamaMobileTrigger();
    });
})();
