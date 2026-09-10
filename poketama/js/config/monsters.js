/**
 * PokéTama Story RPG - Animal SVG Illustration Engine & 100 PokéTama Dex Database
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff65a3', bg: 'rgba(255, 101, 163, 0.2)', icon: '🔥', weak: 'water', strong: 'grass' },
    water: { name: '水', color: '#40c4ff', bg: 'rgba(64, 196, 255, 0.2)', icon: '💧', weak: 'grass', strong: 'fire' },
    grass: { name: '草', color: '#52e077', bg: 'rgba(82, 224, 119, 0.2)', icon: '🌿', weak: 'fire', strong: 'water' },
    cyber: { name: '電脳', color: '#e056fd', bg: 'rgba(224, 86, 253, 0.2)', icon: '🔮', weak: 'grass', strong: 'water' },
    normal: { name: 'ノーマル', color: '#ffd15c', bg: 'rgba(255, 209, 92, 0.2)', icon: '⭐', weak: 'none', strong: 'none' }
};

const STAGES = {
    baby: 'たね',
    child: 'ひよこ',
    adult: 'おとな',
    ultimate: 'でんせつ'
};

const MOVES_DATABASE = {
    tackle: { id: 'tackle', name: 'たい当たり', type: 'normal', power: 35, maxPp: 35, desc: '元気に体当たり' },
    scratch: { id: 'scratch', name: 'ひっかく', type: 'normal', power: 40, maxPp: 30, desc: '鋭い爪で攻撃' },
    
    ember: { id: 'ember', name: 'きつねび', type: 'fire', power: 42, maxPp: 25, desc: 'キツネのきらめく火の玉' },
    flame_tail: { id: 'flame_tail', name: '火炎テイル', type: 'fire', power: 65, maxPp: 15, desc: '燃えるシッポで叩く' },
    inferno_burst: { id: 'inferno_burst', name: '爆炎ラッシュ', type: 'fire', power: 95, maxPp: 5, desc: '紅蓮の爆炎攻撃' },

    water_splash: { id: 'water_splash', name: '水玉ショット', type: 'water', power: 40, maxPp: 25, desc: 'パシャパシャ水玉を発射' },
    bubble_hop: { id: 'bubble_hop', name: 'バブルステップ', type: 'water', power: 65, maxPp: 15, desc: '泡と一緒にジャンプ攻撃' },
    ocean_wave: { id: 'ocean_wave', name: '大波スプラッシュ', type: 'water', power: 95, maxPp: 5, desc: '大波で洗い流す' },

    leaf_breeze: { id: 'leaf_breeze', name: 'はっぱウィンド', type: 'grass', power: 42, maxPp: 25, desc: '葉っぱの風を巻き起こす' },
    acorn_bomb: { id: 'acorn_bomb', name: 'どんぐり爆弾', type: 'grass', power: 68, maxPp: 15, desc: '硬いどんぐりを投擲' },
    forest_storm: { id: 'forest_storm', name: '大森林の乱舞', type: 'grass', power: 100, maxPp: 5, desc: '大自然のエネルギー砲' }
};

// --- ANIMAL STARTER MONSTERS DATABASE ---
const MONSTERS_DATABASE = {
    // #001 FIRE FOX: フラン
    fire_1: {
        dexNo: 1, id: 'fire_1', name: 'フラン', species: 'ほのお狐ポケタマ', element: 'fire', stage: 'baby',
        baseHp: 45, baseAtk: 55, baseDef: 42, baseSpd: 62,
        moves: ['tackle', 'ember'], nextEvo: 'fire_2', evoLevel: 14,
        desc: 'もふもふの大きなシッポを持つ火狐のポケタマ。甘えん坊で跳ね回る。'
    },
    fire_2: {
        dexNo: 2, id: 'fire_2', name: 'フレアフォックス', species: 'きつねポケタマ', element: 'fire', stage: 'child',
        baseHp: 68, baseAtk: 80, baseDef: 64, baseSpd: 85,
        moves: ['scratch', 'ember', 'flame_tail'], nextEvo: 'fire_3', evoLevel: 30,
        desc: '燃え盛る尻尾と俊敏な身のこなしで仲間を守る炎の狐。'
    },
    fire_3: {
        dexNo: 3, id: 'fire_3', name: 'インフェルノス', species: '神狐ポケタマ', element: 'fire', stage: 'adult',
        baseHp: 92, baseAtk: 110, baseDef: 86, baseSpd: 108,
        moves: ['scratch', 'flame_tail', 'inferno_burst'], nextEvo: null,
        desc: '究極の火焔を操る伝説の神狐。リーグの王者と称される。'
    },

    // #004 WATER RABBIT: マリン
    water_1: {
        dexNo: 4, id: 'water_1', name: 'マリン', species: 'みずウサギポケタマ', element: 'water', stage: 'baby',
        baseHp: 50, baseAtk: 44, baseDef: 58, baseSpd: 46,
        moves: ['tackle', 'water_splash'], nextEvo: 'water_2', evoLevel: 14,
        desc: 'たれ耳と水玉模様が愛くるしい水ウサギのポケタマ。耳を振って水玉を飛ばす。'
    },
    water_2: {
        dexNo: 5, id: 'water_2', name: 'アクアラビ', species: 'うさぎポケタマ', element: 'water', stage: 'child',
        baseHp: 72, baseAtk: 66, baseDef: 82, baseSpd: 66,
        moves: ['tackle', 'water_splash', 'bubble_hop'], nextEvo: 'water_3', evoLevel: 30,
        desc: '綺麗な青い毛並みと強い脚力を持つ水跳びウサギ。'
    },
    water_3: {
        dexNo: 6, id: 'water_3', name: 'オーシャンラビ', species: '海王ウサギポケタマ', element: 'water', stage: 'adult',
        baseHp: 96, baseAtk: 92, baseDef: 112, baseSpd: 88,
        moves: ['tackle', 'bubble_hop', 'ocean_wave'], nextEvo: null,
        desc: '津波を跳ね返す大海原の護り神。優しく力強い。'
    },

    // #007 GRASS SQUIRREL: フォリス
    grass_1: {
        dexNo: 7, id: 'grass_1', name: 'フォリス', species: 'くさリスポケタマ', element: 'grass', stage: 'baby',
        baseHp: 46, baseAtk: 48, baseDef: 46, baseSpd: 58,
        moves: ['tackle', 'leaf_breeze'], nextEvo: 'grass_2', evoLevel: 14,
        desc: 'どんぐりを大事そうに抱える森のリスポケタマ。つぶらな瞳がキュート。'
    },
    grass_2: {
        dexNo: 8, id: 'grass_2', name: 'リスリーフ', species: 'もりリスポケタマ', element: 'grass', stage: 'child',
        baseHp: 66, baseAtk: 72, baseDef: 66, baseSpd: 82,
        moves: ['tackle', 'leaf_breeze', 'acorn_bomb'], nextEvo: 'grass_3', evoLevel: 30,
        desc: '大きな緑のシッポで空を滑空するすばしっこいリス。'
    },
    grass_3: {
        dexNo: 9, id: 'grass_3', name: 'フォレストリス', species: '大樹リスポケタマ', element: 'grass', stage: 'adult',
        baseHp: 88, baseAtk: 96, baseDef: 88, baseSpd: 110,
        moves: ['tackle', 'acorn_bomb', 'forest_storm'], nextEvo: null,
        desc: '森の精霊と心を通わせる大自然の守護者。'
    }
};

// Generate Full 100 PokéTama Dex Entries
const ALL_100_POKETAMA_LIST = [];
(function generate100Dex() {
    const prefixes = ['ポッポ', 'コロ', 'ピカ', 'モフ', 'ピョン', 'ニャン', 'パオ', 'ルナ', 'ソル', 'ガル', 'ボルト', 'アクア', 'フレア', 'リーフ'];
    const animals = ['トリ', 'クマ', 'ネコ', 'イヌ', 'ペンギン', 'ハムスター', 'シカ', 'ゾウ', 'ハリネズミ', 'イルカ', 'カメ', 'フクロウ'];
    const elements = ['fire', 'water', 'grass', 'cyber', 'normal'];

    for (let i = 1; i <= 100; i++) {
        if (i <= 9) {
            const keys = ['fire_1', 'fire_2', 'fire_3', 'water_1', 'water_2', 'water_3', 'grass_1', 'grass_2', 'grass_3'];
            ALL_100_POKETAMA_LIST.push(MONSTERS_DATABASE[keys[i-1]]);
        } else {
            const pref = prefixes[(i * 3) % prefixes.length];
            const anim = animals[(i * 7) % animals.length];
            const elem = elements[i % elements.length];
            const id = `poke_${i}`;
            const name = `${pref}${anim}`;
            
            const mon = {
                dexNo: i,
                id,
                name,
                species: `${ELEMENT_TYPES[elem].name}${anim}ポケタマ`,
                element: elem,
                stage: i > 70 ? 'adult' : (i > 35 ? 'child' : 'baby'),
                baseHp: 40 + (i % 30),
                baseAtk: 40 + ((i * 2) % 40),
                baseDef: 35 + ((i * 3) % 45),
                baseSpd: 40 + ((i * 4) % 50),
                moves: ['tackle', 'scratch'],
                nextEvo: null
            };
            MONSTERS_DATABASE[id] = mon;
            ALL_100_POKETAMA_LIST.push(mon);
        }
    }
})();

// --- PROFESSOR TAMAKI SVG ILLUSTRATION ---
function renderProfSVG() {
    return `
    <svg viewBox="0 0 100 100" width="100%" height="100%" class="prof-avatar-svg prof-avatar-active">
        <!-- Lab Coat Shadow -->
        <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.3)" />
        
        <!-- Lab Coat Body -->
        <path d="M 25,50 L 75,50 L 82,90 L 18,90 Z" fill="#ffffff" stroke="#1d162b" stroke-width="3" />
        <path d="M 40,50 L 40,90 M 60,50 L 60,90" stroke="#dcdcdc" stroke-width="2" />
        <path d="M 45,50 L 50,65 L 55,50" fill="#ff65a3" />

        <!-- Head & Hair -->
        <circle cx="50" cy="38" r="22" fill="#ffe0bd" stroke="#1d162b" stroke-width="3" />
        
        <!-- White Wise Professor Hair -->
        <path d="M 26,35 C 24,20 40,14 50,14 C 60,14 76,20 74,35 C 78,30 82,45 74,48 C 68,52 65,42 50,42 C 35,42 32,52 26,48 C 18,45 22,30 26,35 Z" fill="#f0f4f8" stroke="#1d162b" stroke-width="2.5" />

        <!-- Glasses & Eyes -->
        <circle cx="41" cy="37" r="7" fill="rgba(255,255,255,0.7)" stroke="#1d162b" stroke-width="2" />
        <circle cx="59" cy="37" r="7" fill="rgba(255,255,255,0.7)" stroke="#1d162b" stroke-width="2" />
        <line x1="48" y1="37" x2="52" y2="37" stroke="#1d162b" stroke-width="2" />
        <circle cx="41" cy="37" r="2" fill="#1d162b" />
        <circle cx="59" cy="37" r="2" fill="#1d162b" />

        <!-- Friendly Smile & Cheeks -->
        <path d="M 44,46 Q 50,51 56,46" fill="none" stroke="#1d162b" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="34" cy="42" r="3" fill="rgba(255,100,120,0.4)" />
        <circle cx="66" cy="42" r="3" fill="rgba(255,100,120,0.4)" />
    </svg>`;
}

// --- CUTE ANIMAL-STYLE VECTOR SVG GENERATOR ---
function renderMonsterSVG(id, options = {}) {
    const emotion = options.emotion || 'happy';
    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element] || ELEMENT_TYPES.normal;

    const mainC = elem.color;
    const accentC = '#ffffff';

    if (monster.element === 'fire') { // フラン (炎キツネ)
        return `
        <svg viewBox="0 0 100 100" width="100%" height="100%" class="monster-svg">
            <ellipse cx="50" cy="88" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
            <!-- Fluffy Flame Tail -->
            <path d="M 68,60 C 95,45 92,20 78,30 C 65,40 70,68 62,70 Z" fill="#ff9a3c" stroke="#1f142e" stroke-width="3" />
            <path d="M 74,52 C 90,40 88,25 78,32 Z" fill="#ffe066" />
            <!-- Fox Body -->
            <ellipse cx="50" cy="66" rx="22" ry="18" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <ellipse cx="50" cy="68" rx="14" ry="12" fill="#ffffff" />
            <!-- Fox Head & Ears -->
            <polygon points="30,35 18,12 40,25" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <polygon points="28,30 22,18 36,25" fill="#ff9a3c" />
            <polygon points="70,35 82,12 60,25" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <polygon points="72,30 78,18 64,25" fill="#ff9a3c" />
            <circle cx="50" cy="42" r="23" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <path d="M 38,48 L 50,60 L 62,48 Z" fill="#ffffff" />
            <!-- Cute Face & Blush -->
            <circle cx="41" cy="40" r="4" fill="#1f142e" />
            <circle cx="40" cy="38" r="1.5" fill="#ffffff" />
            <circle cx="59" cy="40" r="4" fill="#1f142e" />
            <circle cx="58" cy="38" r="1.5" fill="#ffffff" />
            <ellipse cx="34" cy="45" rx="4" ry="2.5" fill="rgba(255,80,120,0.6)" />
            <ellipse cx="66" cy="45" rx="4" ry="2.5" fill="rgba(255,80,120,0.6)" />
            <polygon points="48,44 52,44 50,47" fill="#1f142e" />
            <path d="M 46,48 Q 50,52 54,48" fill="none" stroke="#1f142e" stroke-width="2" stroke-linecap="round" />
        </svg>`;
    } else if (monster.element === 'water') { // マリン (水ウサギ)
        return `
        <svg viewBox="0 0 100 100" width="100%" height="100%" class="monster-svg">
            <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
            <!-- Floppy Bunny Ears -->
            <path d="M 32,32 C 15,30 10,65 24,65 C 32,65 36,45 36,35 Z" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <path d="M 28,36 C 18,36 15,58 24,58 Z" fill="#a6edff" />
            <path d="M 68,32 C 85,30 90,65 76,65 C 68,65 64,45 64,35 Z" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <path d="M 72,36 C 82,36 85,58 76,58 Z" fill="#a6edff" />
            <!-- Body & Head -->
            <circle cx="50" cy="68" r="20" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <ellipse cx="50" cy="70" rx="13" ry="12" fill="#ffffff" />
            <circle cx="50" cy="42" r="22" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <!-- Eyes & Cheeks -->
            <circle cx="41" cy="40" r="4.5" fill="#1f142e" />
            <circle cx="40" cy="38" r="1.8" fill="#ffffff" />
            <circle cx="59" cy="40" r="4.5" fill="#1f142e" />
            <circle cx="58" cy="38" r="1.8" fill="#ffffff" />
            <ellipse cx="33" cy="46" rx="4" ry="2.5" fill="rgba(255,100,150,0.6)" />
            <ellipse cx="67" cy="46" rx="4" ry="2.5" fill="rgba(255,100,150,0.6)" />
            <path d="M 47,46 Q 50,49 53,46" fill="none" stroke="#1f142e" stroke-width="2" stroke-linecap="round" />
        </svg>`;
    } else { // フォリス (草リス)
        return `
        <svg viewBox="0 0 100 100" width="100%" height="100%" class="monster-svg">
            <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
            <!-- Big Fluffy Squirrel Tail -->
            <path d="M 64,68 C 96,68 100,20 75,18 C 55,16 60,48 56,58 Z" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <path d="M 68,60 C 88,60 90,26 75,24 Z" fill="#d6ff99" />
            <!-- Squirrel Body & Ears -->
            <ellipse cx="50" cy="68" rx="20" ry="18" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <ellipse cx="50" cy="70" rx="12" ry="12" fill="#ffffff" />
            <circle cx="34" cy="24" r="8" fill="${mainC}" stroke="#1f142e" stroke-width="3" />
            <circle cx="66" cy="24" r="8" fill="${mainC}" stroke="#1f142e" stroke-width="3" />
            <circle cx="50" cy="42" r="22" fill="${mainC}" stroke="#1f142e" stroke-width="3.5" />
            <!-- Acorn in Paws -->
            <ellipse cx="50" cy="64" rx="6" ry="7" fill="#8d6e63" stroke="#1f142e" stroke-width="2" />
            <path d="M 43,59 Q 50,55 57,59" fill="#5d4037" stroke="#1f142e" stroke-width="1.5" />
            <!-- Eyes & Cheeks -->
            <circle cx="40" cy="40" r="4.5" fill="#1f142e" />
            <circle cx="39" cy="38" r="1.8" fill="#ffffff" />
            <circle cx="60" cy="40" r="4.5" fill="#1f142e" />
            <circle cx="59" cy="38" r="1.8" fill="#ffffff" />
            <ellipse cx="32" cy="46" rx="4" ry="2.5" fill="rgba(255,100,150,0.6)" />
            <ellipse cx="68" cy="46" rx="4" ry="2.5" fill="rgba(255,100,150,0.6)" />
        </svg>`;
    }
}
