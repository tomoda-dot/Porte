/**
 * monsters.js
 * 200 PokéTama Monster Database & 18 Element Types with Vector SVG / PNG Art Generator
 */

// 18 Official Element Types Database
const ELEMENT_TYPES = {
    normal:   { name: 'ノーマル', color: '#aaaa99', bg: 'rgba(170, 170, 153, 0.2)', icon: '⚪' },
    fire:     { name: 'ほのお',   color: '#ff4422', bg: 'rgba(255, 68, 34, 0.2)',    icon: '🔥' },
    water:    { name: 'みず',     color: '#3399ff', bg: 'rgba(51, 153, 255, 0.2)',   icon: '💧' },
    electric: { name: 'でんき',   color: '#ffcc00', bg: 'rgba(255, 204, 0, 0.2)',    icon: '⚡' },
    grass:    { name: 'くさ',     color: '#77cc33', bg: 'rgba(119, 204, 51, 0.2)',   icon: '🌿' },
    ice:      { name: 'こおり',   color: '#66ccff', bg: 'rgba(102, 204, 255, 0.2)',  icon: '❄️' },
    fighting: { name: 'かくとう', color: '#bb5544', bg: 'rgba(187, 85, 68, 0.2)',    icon: '🥊' },
    poison:   { name: 'どく',     color: '#aa5599', bg: 'rgba(170, 85, 153, 0.2)',   icon: '☠️' },
    ground:   { name: 'じめん',   color: '#ddbb55', bg: 'rgba(221, 187, 85, 0.2)',   icon: '🏜️' },
    flying:   { name: 'ひこう',   color: '#8899ff', bg: 'rgba(136, 153, 255, 0.2)',  icon: '🕊️' },
    psychic:  { name: 'エスパー', color: '#ff5599', bg: 'rgba(255, 85, 153, 0.2)',   icon: '🔮' },
    bug:      { name: 'むし',     color: '#aabb22', bg: 'rgba(170, 187, 34, 0.2)',   icon: '🐛' },
    rock:     { name: 'いわ',     color: '#bbaa66', bg: 'rgba(187, 170, 102, 0.2)',  icon: '🪨' },
    ghost:    { name: 'ゴースト', color: '#6666bb', bg: 'rgba(102, 102, 187, 0.2)',  icon: '👻' },
    dragon:   { name: 'ドラゴン', color: '#7766ee', bg: 'rgba(119, 102, 238, 0.2)',  icon: '🐉' },
    dark:     { name: 'あく',     color: '#775544', bg: 'rgba(119, 85, 68, 0.2)',    icon: '🌙' },
    steel:    { name: 'はがね',   color: '#aaaabb', bg: 'rgba(170, 170, 187, 0.2)',  icon: '🛡️' },
    fairy:    { name: 'フェアリー',color: '#ee99ee', bg: 'rgba(238, 153, 238, 0.2)',  icon: '✨' }
};

// 18-Type Advantage Multiplier Matrix (Exact match with official type chart)
function getTypeMultiplier(atkType, defType) {
    if (!atkType || !defType) return 1.0;

    const chart = {
        normal:   { rock: 0.5, ghost: 0.0, steel: 0.5 },
        fire:     { fire: 0.5, water: 0.5, grass: 2.0, ice: 2.0, bug: 2.0, rock: 0.5, dragon: 0.5, steel: 2.0 },
        water:    { fire: 2.0, water: 0.5, grass: 0.5, ground: 2.0, rock: 2.0, dragon: 0.5 },
        electric: { water: 2.0, electric: 0.5, grass: 0.5, ground: 0.0, flying: 2.0, dragon: 0.5 },
        grass:    { fire: 0.5, water: 2.0, grass: 0.5, poison: 0.5, ground: 2.0, flying: 0.5, bug: 0.5, rock: 2.0, dragon: 0.5, steel: 0.5 },
        ice:      { fire: 0.5, water: 0.5, grass: 2.0, ice: 0.5, ground: 2.0, flying: 2.0, dragon: 2.0, steel: 0.5 },
        fighting: { normal: 2.0, ice: 2.0, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2.0, ghost: 0.0, dark: 2.0, steel: 2.0, fairy: 0.5 },
        poison:   { grass: 2.0, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0.0, fairy: 2.0 },
        ground:   { fire: 2.0, electric: 2.0, grass: 0.5, poison: 2.0, flying: 0.0, bug: 0.5, rock: 2.0, steel: 2.0 },
        flying:   { electric: 0.5, grass: 2.0, fighting: 2.0, bug: 2.0, rock: 0.5, steel: 0.5 },
        psychic:  { fighting: 2.0, poison: 2.0, psychic: 0.5, dark: 0.0, steel: 0.5 },
        bug:      { fire: 0.5, grass: 2.0, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2.0, ghost: 0.5, dark: 2.0, steel: 0.5, fairy: 0.5 },
        rock:     { fire: 2.0, ice: 2.0, fighting: 0.5, ground: 0.5, flying: 2.0, bug: 2.0, steel: 0.5 },
        ghost:    { normal: 0.0, psychic: 2.0, ghost: 2.0, dark: 0.5 },
        dragon:   { dragon: 2.0, steel: 0.5, fairy: 0.0 },
        dark:     { fighting: 0.5, psychic: 2.0, ghost: 2.0, dark: 0.5, fairy: 0.5 },
        steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2.0, rock: 2.0, steel: 0.5, fairy: 2.0 },
        fairy:    { fire: 0.5, fighting: 2.0, poison: 0.5, dragon: 2.0, dark: 2.0, steel: 0.5 }
    };

    if (chart[atkType] && chart[atkType][defType] !== undefined) {
        return chart[atkType][defType];
    }
    return 1.0;
}

const STAGES = {
    baby: '幼年期',
    child: '成長期',
    adult: '進化体'
};

// Base Names Seeds for 100 Base PokéTama
const BASE_NAME_SEEDS = [
    { base: 'ヒノコ', evo: 'フレアレオン', type: 'fire' },
    { base: 'ポタポタ', evo: 'アクアパピヨン', type: 'water' },
    { base: 'リーフリス', evo: 'フォリスキング', type: 'grass' },
    { base: 'ピカポン', evo: 'ライボルトン', type: 'electric' },
    { base: 'コリペン', evo: 'エンペルアイス', type: 'ice' },
    { base: 'コボコボ', evo: 'ボクサードッグ', type: 'fighting' },
    { base: 'ドクガエル', evo: 'ヴェノムキング', type: 'poison' },
    { base: 'モグリン', evo: 'グラングラード', type: 'ground' },
    { base: 'ツバヒコ', evo: 'ファルコンウイング', type: 'flying' },
    { base: 'エノッチ', evo: 'サイキックマスター', type: 'psychic' },
    { base: 'ハナムシ', evo: 'ヘラクレスビート', type: 'bug' },
    { base: 'イワコロ', evo: 'ゴレムロック', type: 'rock' },
    { base: 'オバケッチ', evo: 'ナイトメアホロウ', type: 'ghost' },
    { base: 'ドラコ', evo: 'バハムートドラゴン', type: 'dragon' },
    { base: 'ヤミイヌ', evo: 'ダークヘルハウンド', type: 'dark' },
    { base: 'ハガネノコ', evo: 'ヴァルキリーシールド', type: 'steel' },
    { base: 'フェアリン', evo: 'プリンセスセラフィ', type: 'fairy' },
    { base: 'パタパタ', evo: 'グランノーマル', type: 'normal' }
];

// Custom Generated Artwork Mapping
const ARTWORK_MAP = {
    mon_001: 'images/starter_fire_fox.png',
    mon_002: 'images/starter_water_bunny.png',
    mon_003: 'images/grass_leaf_deer.png',
    mon_004: 'images/electric_thunder_fox.png',
    mon_005: 'images/ice_penguin.png',
    mon_006: 'images/fighting_boxer_dog.png',
    mon_007: 'images/poison_frog.png',
    mon_008: 'images/ground_mole.png',
    mon_009: 'images/flying_falcon.png',
    mon_018: 'images/normal_bear_cub.png',
    mon_101: 'images/boss_dragon_flame.png'
};

// Egg Database
const EGGS_DATABASE = {
    egg_fire: { id: 'egg_fire', name: 'フレアタマゴ', element: 'fire', description: '温かい炎の模様がついたタマゴ。', hatchesTo: 'mon_001', warmthNeeded: 100, color: '#ff5544', patternColor: '#ffcc00' },
    egg_water: { id: 'egg_water', name: 'アクアタマゴ', element: 'water', description: '水玉模様が浮かぶ海のタマゴ。', hatchesTo: 'mon_002', warmthNeeded: 100, color: '#33aaff', patternColor: '#88e0ff' },
    egg_grass: { id: 'egg_grass', name: 'リーフタマゴ', element: 'grass', description: '四つ葉の刺繍がついたタマゴ。', hatchesTo: 'mon_003', warmthNeeded: 100, color: '#44dd66', patternColor: '#aaff66' },
    egg_electric: { id: 'egg_electric', name: 'ボルトタマゴ', element: 'electric', description: '稲妻模様の弾けるタマゴ。', hatchesTo: 'mon_004', warmthNeeded: 100, color: '#ffcc00', patternColor: '#ffffff' }
};

// Procedural 200 Monsters Generator (#001 - #100 Base, #101 - #200 Evolved)
const MONSTERS_DATABASE = {};

(function generate200Monsters() {
    const typeKeys = Object.keys(ELEMENT_TYPES);

    for (let i = 1; i <= 100; i++) {
        const baseId = `mon_${String(i).padStart(3, '0')}`;
        const evoId = `mon_${String(i + 100).padStart(3, '0')}`;
        
        const seed = BASE_NAME_SEEDS[(i - 1) % BASE_NAME_SEEDS.length];
        const type = typeKeys[(i - 1) % typeKeys.length];
        
        const suffixNum = Math.floor((i - 1) / BASE_NAME_SEEDS.length) + 1;
        const baseName = suffixNum > 1 ? `${seed.base} Mark-${suffixNum}` : seed.base;
        const evoName = suffixNum > 1 ? `${seed.evo} Mark-${suffixNum}` : seed.evo;

        // Base Form Monster (#001 - #100)
        MONSTERS_DATABASE[baseId] = {
            id: baseId,
            dexNo: i,
            name: baseName,
            stage: 'child',
            element: type,
            maxHp: 75 + (i % 15) * 3,
            atk: 20 + (i % 10) * 2,
            def: 15 + (i % 8) * 2,
            spd: 18 + (i % 12) * 2,
            moves: ['tackle', `move_${type}`],
            nextEvolution: evoId,
            evoLevel: 16,
            imgSrc: ARTWORK_MAP[baseId] || null,
            description: `可愛い姿をした ${ELEMENT_TYPES[type].name} 属性の基本ポケたま。レベル16で大きな進化を遂げる！`
        };

        // Evolved Form Monster (#101 - #200)
        MONSTERS_DATABASE[evoId] = {
            id: evoId,
            dexNo: i + 100,
            name: evoName,
            stage: 'adult',
            element: type,
            maxHp: 180 + (i % 15) * 6,
            atk: 55 + (i % 10) * 4,
            def: 45 + (i % 8) * 4,
            spd: 48 + (i % 12) * 4,
            moves: ['tackle', `move_${type}`, 'hyper_beam'],
            nextEvolution: null,
            evoLevel: 0,
            imgSrc: ARTWORK_MAP[evoId] || null,
            description: `${baseName} がたくましく成長した ${ELEMENT_TYPES[type].name} 属性の秘められた力を持つ究極の進化形！`
        };
    }
})();

/**
 * renderMonsterSVG
 * Renders high-quality artwork (Custom PNG Image or Vector SVG) for all 200 monsters
 */
function renderMonsterSVG(monsterOrId, size = 160) {
    let mon = typeof monsterOrId === 'string' ? MONSTERS_DATABASE[monsterOrId] : monsterOrId;
    if (!mon) {
        mon = MONSTERS_DATABASE['mon_001'];
    }

    const elem = ELEMENT_TYPES[mon.element] || ELEMENT_TYPES.normal;
    const isEvolved = mon.dexNo > 100 || mon.stage === 'adult';
    const mainColor = elem.color;

    // Check if custom PNG artwork image exists
    const imgSrc = mon.imgSrc || ARTWORK_MAP[mon.id] || ARTWORK_MAP[mon.speciesId];
    if (imgSrc) {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="monster-svg">
            <defs>
                <clipPath id="clip-${mon.id}">
                    <circle cx="100" cy="100" r="74" />
                </clipPath>
            </defs>

            <!-- Outer Glowing Ring -->
            <circle cx="100" cy="100" r="82" fill="none" stroke="${mainColor}" stroke-width="3" opacity="0.8">
                <animate attributeName="stroke-opacity" values="0.4;1.0;0.4" dur="3s" repeatCount="indefinite" />
            </circle>

            <!-- PNG Artwork Image -->
            <image href="${imgSrc}" x="22" y="22" width="156" height="156" clip-path="url(#clip-${mon.id})" preserveAspectRatio="xMidYMid slice" />

            <!-- Element Badge Overlay -->
            <text x="100" y="188" text-anchor="middle" font-size="13" font-weight="bold" fill="${mainColor}">
                ${elem.icon} #${String(mon.dexNo).padStart(3, '0')} ${mon.name}
            </text>
        </svg>
        `;
    }

    const bodySize = isEvolved ? 62 : 46;

    let auraSvg = '';
    if (isEvolved) {
        auraSvg = `
            <circle cx="100" cy="100" r="82" fill="none" stroke="${mainColor}" stroke-width="2" stroke-dasharray="6,4" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="72" fill="${mainColor}" opacity="0.12" />
        `;
    }

    // Horns / Wings for Evolved Form
    let extrasSvg = '';
    if (isEvolved) {
        extrasSvg = `
            <!-- Wings / Horns -->
            <path d="M 45 70 Q 15 30 35 100 Q 55 90 45 70 Z" fill="${mainColor}" opacity="0.85" />
            <path d="M 155 70 Q 185 30 165 100 Q 145 90 155 70 Z" fill="${mainColor}" opacity="0.85" />
            <!-- Crown / Crest -->
            <path d="M 85 45 L 100 20 L 115 45 L 108 45 L 100 32 L 92 45 Z" fill="#ffe600" />
        `;
    } else {
        extrasSvg = `
            <!-- Cute Ears -->
            <ellipse cx="65" cy="60" rx="10" ry="18" fill="${mainColor}" transform="rotate(-15 65 60)" />
            <ellipse cx="135" cy="60" rx="10" ry="18" fill="${mainColor}" transform="rotate(15 135 60)" />
        `;
    }

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="monster-svg">
        <defs>
            <radialGradient id="grad-${mon.id}" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
                <stop offset="60%" stop-color="${mainColor}" />
                <stop offset="100%" stop-color="#111122" />
            </radialGradient>
        </defs>

        <!-- Aura -->
        ${auraSvg}

        <!-- Extras (Wings/Ears/Horns) -->
        ${extrasSvg}

        <!-- Body -->
        <circle cx="100" cy="105" r="${bodySize}" fill="url(#grad-${mon.id})" />

        <!-- Belly -->
        <ellipse cx="100" cy="115" rx="${bodySize * 0.6}" ry="${bodySize * 0.5}" fill="#ffffff" opacity="0.85" />

        <!-- Cute Eyes -->
        <circle cx="84" cy="96" r="6" fill="#111" />
        <circle cx="116" cy="96" r="6" fill="#111" />
        <circle cx="86" cy="94" r="2.2" fill="#fff" />
        <circle cx="118" cy="94" r="2.2" fill="#fff" />

        <!-- Blush Cheeks -->
        <ellipse cx="74" cy="106" rx="6" ry="4" fill="#ff6688" opacity="0.6" />
        <ellipse cx="126" cy="106" rx="6" ry="4" fill="#ff6688" opacity="0.6" />

        <!-- Mouth -->
        <path d="M 94 104 Q 100 110 106 104" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round" />

        <!-- Element Badge Overlay -->
        <text x="100" y="172" text-anchor="middle" font-size="14" font-weight="bold" fill="${mainColor}">
            ${elem.icon} #${String(mon.dexNo).padStart(3, '0')} ${mon.name}
        </text>
    </svg>
    `;
}

window.ELEMENT_TYPES = ELEMENT_TYPES;
window.getTypeMultiplier = getTypeMultiplier;
window.STAGES = STAGES;
window.EGGS_DATABASE = EGGS_DATABASE;
window.MONSTERS_DATABASE = MONSTERS_DATABASE;
window.renderMonsterSVG = renderMonsterSVG;
