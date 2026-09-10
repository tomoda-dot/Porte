/**
 * PokéTama Story RPG - Story Dialogue & Typewriter Text Engine
 */

const PROF_DIALOGUES = [
    "おお！よく来たのう！私はこの世界のポケタマ研究者、タマキ博士じゃ！",
    "ポケタマとは、自然豊かなこの世界に生きる不思議で愛くるしい生き物たちのことじゃよ。",
    "君には今日から、ポケタマトレーナーとして素晴らしい冒険の旅に出てほしいのじゃ！",
    "君の旅には２つの大きな目的（目標）がある！しっかり心して聞くのじゃぞ！",
    "１つ目は、各地のジムを勝ち抜き【🏆 ポケタマリーグ優勝】を果たしトップトレーナーになること！",
    "２つ目は、世界中に存在する【📖 全100種類のポケタマ】を発見して図鑑を完成させることじゃ！",
    "さあ！旅の第一歩として、この３匹の可愛いポケタマから最初のパートナーを選ぶのじゃ！"
];

const StoryModule = {
    currentLineIndex: 0,
    typewriterTimer: null,
    isTyping: false,
    currentTextTarget: '',

    init() {
        this.currentLineIndex = 0;
        this.renderLine();
    },

    renderLine() {
        const textContainer = document.getElementById('prof-dialogue-text');
        const btnNext = document.getElementById('btn-dialogue-next');
        if (!textContainer) return;

        const fullText = PROF_DIALOGUES[this.currentLineIndex];
        this.currentTextTarget = fullText;
        this.isTyping = true;

        if (btnNext) btnNext.innerText = '次へ ➔';

        textContainer.innerHTML = '';
        let charIndex = 0;

        if (this.typewriterTimer) clearInterval(this.typewriterTimer);
        this.typewriterTimer = setInterval(() => {
            if (charIndex < fullText.length) {
                textContainer.innerHTML = fullText.substring(0, charIndex + 1) + '<span class="typewriter-cursor"></span>';
                charIndex++;
            } else {
                clearInterval(this.typewriterTimer);
                this.isTyping = false;
                textContainer.innerHTML = fullText;
            }
        }, 28);
    },

    advanceDialogue() {
        if (this.isTyping) {
            // Instantly complete current line
            if (this.typewriterTimer) clearInterval(this.typewriterTimer);
            this.isTyping = false;
            const textContainer = document.getElementById('prof-dialogue-text');
            if (textContainer) textContainer.innerHTML = this.currentTextTarget;
            return;
        }

        this.currentLineIndex++;
        if (this.currentLineIndex < PROF_DIALOGUES.length) {
            this.renderLine();
        } else {
            // Prologue Complete! Transition to Starter Select
            if (window.UIController) {
                window.UIController.switchView('starter-select');
            }
        }
    }
};

window.StoryModule = StoryModule;
