/**
 * PokéTama Monster Configurations & SVG Artwork Generators
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.15)', icon: '🔥', weak: 'water', strong: 'grass' },
    water: { name: '水', color: '#3399ff', bg: 'rgba(51, 153, 255, 0.15)', icon: '💧', weak: 'grass', strong: 'fire' },
    grass: { name: '草', color: '#4dff88', bg: 'rgba(77, 255, 136, 0.15)', icon: '🌿', weak: 'fire', strong: 'water' },
    cyber: { name: '電脳', color: '#cc66ff', bg: 'rgba(204, 102, 255, 0.15)', icon: '🔮', weak: 'grass', strong: 'water' }
};

const STAGES = {
    egg: 'タマゴ',
    baby: '幼年期',
    child: '成長期',
    adult: '成熟期',
    ultimate: '究極体'
};

const EGGS_DATABASE = {
    egg_fire: {
        id: 'egg_fire',
        name: 'フレアタマゴ',
        element: 'fire',
        description: 'ほのかに温かい、情熱の炎を秘めたタマゴ。',
        hatchesTo: 'fire_1',
        warmthNeeded: 100,
        color: '#ff5533',
        patternColor: '#ffcc00'
    },
    egg_water: {
        id: 'egg_water',
        name: 'アクアタマゴ',
        element: 'water',
        description: '澄んだ水流の音が聞こえる清らかなタマゴ。',
        hatchesTo: 'water_1',
        warmthNeeded: 100,
        color: '#33aaff',
        patternColor: '#88e0ff'
    },
    egg_grass: {
        id: 'egg_grass',
        name: 'リーフタマゴ',
        element: 'grass',
        description: '若葉の香りが漂う神秘的な生命のタマゴ。',
        hatchesTo: 'grass_1',
        warmthNeeded: 100,
        color: '#44dd66',
        patternColor: '#aaff66'
    },
    egg_cyber: {
        id: 'egg_cyber',
        name: 'サイバータマゴ',
        element: 'cyber',
        description: 'ネオンの光線が脈動する未来都市のタマゴ。',
        hatchesTo: 'cyber_1',
        warmthNeeded: 120,
        color: '#bb44ff',
        patternColor: '#00ffff'
    }
};

const MONSTERS_DATABASE = {
    // --- FIRE EVOLUTION LINE ---
    fire_1: {
        id: 'fire_1',
        name: 'ヒノコ',
        stage: 'baby',
        element: 'fire',
        maxHp: 80,
        atk: 22,
        def: 14,
        spd: 18,
        moves: ['tackle', 'ember'],
        nextEvolution: 'fire_2',
        evoLevel: 5,
        evoFriendship: 30,
        description: 'あたまの小さな炎がごきげんのしるし。元気に跳ね回る。'
    },
    fire_2: {
        id: 'fire_2',
        name: 'ヒノリュウ',
        stage: 'child',
        element: 'fire',
        maxHp: 160,
        atk: 45,
        def: 32,
        spd: 38,
        moves: ['tackle', 'flame_charge', 'fire_breath'],
        nextEvolution: 'fire_3',
        evoLevel: 12,
        evoFriendship: 60,
        description: '背中の炎が大きくなり、熱い情熱で仲間を守る竜の子。'
    },
    fire_3: {
        id: 'fire_3',
        name: 'バーンレックス',
        stage: 'adult',
        element: 'fire',
        maxHp: 280,
        atk: 88,
        def: 62,
        spd: 70,
        moves: ['flame_charge', 'fire_breath', 'fire_claw', 'lava_surge'],
        nextEvolution: 'fire_4',
        evoLevel: 25,
        evoFriendship: 90,
        description: '灼熱の牙と爪を持つ熱血モンスター。口から爆炎を吐き出す。'
    },
    fire_4: {
        id: 'fire_4',
        name: 'ギガフレアドラ',
        stage: 'ultimate',
        element: 'fire',
        maxHp: 460,
        atk: 145,
        def: 105,
        spd: 115,
        moves: ['fire_claw', 'lava_surge', 'overheat', 'giga_flare'],
        nextEvolution: null,
        description: '全ての炎を司る伝説の爆炎竜。その威光は戦場全体を焦がす。'
    },

    // --- WATER EVOLUTION LINE ---
    water_1: {
        id: 'water_1',
        name: 'アクアプニ',
        stage: 'baby',
        element: 'water',
        maxHp: 90,
        atk: 16,
        def: 18,
        spd: 16,
        moves: ['tackle', 'water_drop'],
        nextEvolution: 'water_2',
        evoLevel: 5,
        evoFriendship: 30,
        description: 'プニプニした水の身体を持つ。甘えん坊で水を吹きかける。'
    },
    water_2: {
        id: 'water_2',
        name: 'アクアシェル',
        stage: 'child',
        element: 'water',
        maxHp: 180,
        atk: 36,
        def: 48,
        spd: 30,
        moves: ['tackle', 'water_drop', 'bubble_beam'],
        nextEvolution: 'water_3',
        evoLevel: 12,
        evoFriendship: 60,
        description: '頑丈な甲羅と優しさを持ち、水のバリアで攻撃を防ぐ。'
    },
    water_3: {
        id: 'water_3',
        name: 'タイダルホエール',
        stage: 'adult',
        element: 'water',
        maxHp: 320,
        atk: 72,
        def: 95,
        spd: 55,
        moves: ['bubble_beam', 'aqua_tail', 'surf_wave', 'hydro_pump'],
        nextEvolution: 'water_4',
        evoLevel: 25,
        evoFriendship: 90,
        description: '大いなる海原の守護者。津波を呼ぶ豪快な尾ビレを持つ。'
    },
    water_4: {
        id: 'water_4',
        name: 'カイザーポセイドン',
        stage: 'ultimate',
        element: 'water',
        maxHp: 520,
        atk: 125,
        def: 140,
        spd: 90,
        moves: ['aqua_tail', 'surf_wave', 'hydro_pump', 'ocean_cataclysm'],
        nextEvolution: null,
        description: '海洋の絶対絶対王者。三叉の槍で深海の大渦を統べる。'
    },

    // --- GRASS EVOLUTION LINE ---
    grass_1: {
        id: 'grass_1',
        name: 'ポコリーフ',
        stage: 'baby',
        element: 'grass',
        maxHp: 85,
        atk: 18,
        def: 16,
        spd: 20,
        moves: ['tackle', 'leaf_shot'],
        nextEvolution: 'grass_2',
        evoLevel: 5,
        evoFriendship: 30,
        description: '頭の葉っぱで日光浴をするのが大好きな癒やし系。'
    },
    grass_2: {
        id: 'grass_2',
        name: 'フォレストフェネック',
        stage: 'child',
        element: 'grass',
        maxHp: 165,
        atk: 40,
        def: 36,
        spd: 46,
        moves: ['tackle', 'leaf_shot', 'vine_whip'],
        nextEvolution: 'grass_3',
        evoLevel: 12,
        evoFriendship: 60,
        description: '森林をすばしっこく駆け回る。鋭いツルを鞭のように扱う。'
    },
    grass_3: {
        id: 'grass_3',
        name: 'フローラヴァルキリー',
        stage: 'adult',
        element: 'grass',
        maxHp: 270,
        atk: 82,
        def: 68,
        spd: 92,
        moves: ['vine_whip', 'leaf_blade', 'petal_storm', 'energy_drain'],
        nextEvolution: 'grass_4',
        evoLevel: 25,
        evoFriendship: 90,
        description: '花びらの舞とともに疾走する森の騎士。回復と俊敏な攻撃が得意。'
    },
    grass_4: {
        id: 'grass_4',
        name: 'ユグドラシエル',
        stage: 'ultimate',
        element: 'grass',
        maxHp: 480,
        atk: 135,
        def: 115,
        spd: 125,
        moves: ['leaf_blade', 'petal_storm', 'solar_beam', 'world_tree_blessing'],
        nextEvolution: null,
        description: '世界樹の加護を受けし神聖なる聖獣。大自然の生命力を束ねる。'
    },

    // --- CYBER EVOLUTION LINE ---
    cyber_1: {
        id: 'cyber_1',
        name: 'スパークン',
        stage: 'baby',
        element: 'cyber',
        maxHp: 75,
        atk: 24,
        def: 12,
        spd: 24,
        moves: ['tackle', 'spark'],
        nextEvolution: 'cyber_2',
        evoLevel: 5,
        evoFriendship: 30,
        description: '静電気でパチパチ光る。デジタルデータが大好き。'
    },
    cyber_2: {
        id: 'cyber_2',
        name: 'サイバーネコ',
        stage: 'child',
        element: 'cyber',
        maxHp: 155,
        atk: 48,
        def: 30,
        spd: 52,
        moves: ['tackle', 'spark', 'thunder_bolt'],
        nextEvolution: 'cyber_3',
        evoLevel: 12,
        evoFriendship: 60,
        description: '光速のシッポで電波を発信する。素早い連続攻撃が得意。'
    },
    cyber_3: {
        id: 'cyber_3',
        name: 'ボルテックライガー',
        stage: 'adult',
        element: 'cyber',
        maxHp: 260,
        atk: 96,
        def: 58,
        spd: 105,
        moves: ['thunder_bolt', 'laser_claw', 'discharge', 'plasma_surge'],
        nextEvolution: 'cyber_4',
        evoLevel: 25,
        evoFriendship: 90,
        description: '電脳空間を雷光となって駆け抜ける獣。稲妻の爪で敵を討つ。'
    },
    cyber_4: {
        id: 'cyber_4',
        name: 'ゼウスオメガ',
        stage: 'ultimate',
        element: 'cyber',
        maxHp: 440,
        atk: 160,
        def: 95,
        spd: 140,
        moves: ['laser_claw', 'plasma_surge', 'giga_volt', 'cyber_overclock'],
        nextEvolution: null,
        description: '電脳神の領域に達した究極体。演算速度と圧倒的雷撃で敵を圧倒。'
    }
};

/**
 * Render Dynamic SVG artwork for Eggs & Monsters
 */
function renderMonsterSVG(id, options = {}) {
    const isEgg = id.startsWith('egg_');
    const emotion = options.emotion || 'happy'; // happy, sleep, hungry, angry, battle
    const scale = options.scale || 1;

    if (isEgg) {
        const eggData = EGGS_DATABASE[id] || EGGS_DATABASE.egg_fire;
        const crack = options.crackProgress || 0; // 0 to 1
        return `
        <svg viewBox="0 0 200 240" width="100%" height="100%" class="monster-svg egg-svg">
            <defs>
                <radialGradient id="eggGlow_${id}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${eggData.patternColor}" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="${eggData.color}" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="eggGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${eggData.patternColor}"/>
                    <stop offset="60%" stop-color="${eggData.color}"/>
                    <stop offset="100%" stop-color="#111122"/>
                </linearGradient>
                <filter id="glow_${id}">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Aura Shadow -->
            <ellipse cx="100" cy="215" rx="55" ry="14" fill="rgba(0,0,0,0.4)" />
            <ellipse cx="100" cy="130" rx="75" ry="85" fill="url(#eggGlow_${id})" filter="url(#glow_${id})" opacity="0.6"/>

            <!-- Egg Main Shell -->
            <path d="M 100,25 C 150,25 170,80 170,140 C 170,195 140,210 100,210 C 60,210 30,195 30,140 C 30,80 50,25 100,25 Z" 
                  fill="url(#eggGrad_${id})" stroke="#ffffff" stroke-width="3" filter="url(#glow_${id})" />

            <!-- Egg Patterns -->
            <circle cx="75" cy="85" r="16" fill="${eggData.patternColor}" opacity="0.7" />
            <circle cx="130" cy="120" r="22" fill="${eggData.patternColor}" opacity="0.7" />
            <circle cx="70" cy="160" r="14" fill="${eggData.patternColor}" opacity="0.7" />

            <!-- Crack overlay if warming -->
            ${crack > 0.3 ? `<path d="M 90,70 L 105,85 L 95,100 L 115,115" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}
            ${crack > 0.7 ? `<path d="M 120,130 L 105,145 L 125,160 L 110,180" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}

            <!-- Shine Highlight -->
            <path d="M 65,45 Q 90,35 110,40 C 80,48 55,75 55,105 C 55,80 60,55 65,45 Z" fill="#ffffff" opacity="0.4" />
        </svg>`;
    }

    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element];

    // Face features according to emotion
    let eyeLeft = `<circle cx="80" cy="95" r="7" fill="#ffffff"/><circle cx="82" cy="93" r="3" fill="#111"/>`;
    let eyeRight = `<circle cx="120" cy="95" r="7" fill="#ffffff"/><circle cx="118" cy="93" r="3" fill="#111"/>`;
    let mouth = `<path d="M 90,115 Q 100,125 110,115" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`;
    let extraFX = '';

    if (emotion === 'sleep') {
        eyeLeft = `<path d="M 72,95 Q 80,102 88,95" fill="none" stroke="#ffffff" stroke-width="3"/>`;
        eyeRight = `<path d="M 112,95 Q 120,102 128,95" fill="none" stroke="#ffffff" stroke-width="3"/>`;
        mouth = `<circle cx="100" cy="115" r="4" fill="#ffffff"/>`;
        extraFX = `<text x="140" y="70" fill="#aaccff" font-family="monospace" font-weight="bold" font-size="24">Zzz...</text>`;
    } else if (emotion === 'hungry') {
        eyeLeft = `<circle cx="80" cy="95" r="7" fill="#ffffff"/><circle cx="80" cy="95" r="2" fill="#ff3333"/>`;
        eyeRight = `<circle cx="120" cy="95" r="7" fill="#ffffff"/><circle cx="120" cy="95" r="2" fill="#ff3333"/>`;
        mouth = `<path d="M 90,122 Q 100,112 110,122" fill="none" stroke="#ffffff" stroke-width="3"/>`;
        extraFX = `<path d="M 125,75 Q 130,85 125,95" fill="none" stroke="#66ccff" stroke-width="3"/>`; // Sweat drop
    } else if (emotion === 'angry' || emotion === 'battle') {
        eyeLeft = `<polygon points="72,88 88,98 74,102" fill="#ffcc00"/>`;
        eyeRight = `<polygon points="128,88 112,98 126,102" fill="#ffcc00"/>`;
        mouth = `<path d="M 88,120 Q 100,108 112,120 Z" fill="#ff3333"/>`;
        extraFX = `<path d="M 50,50 L 60,65 M 150,50 L 140,65" stroke="${elem.color}" stroke-width="4"/>`;
    }

    // Element Body Shapes & Accents
    let bodyPath = '';
    let bodyColor = elem.color;
    let secondaryColor = '#ffffff';

    if (monster.element === 'fire') {
        secondaryColor = '#ffcc00';
        bodyPath = `
            <!-- Tail Flame -->
            <path d="M 45,150 Q 20,130 35,90 Q 55,120 65,140 Z" fill="${secondaryColor}" filter="url(#glow_${id})"/>
            <!-- Body -->
            <circle cx="100" cy="115" r="55" fill="${bodyColor}"/>
            <!-- Horn / Ears -->
            <path d="M 70,70 L 60,35 L 85,60 Z" fill="${secondaryColor}"/>
            <path d="M 130,70 L 140,35 L 115,60 Z" fill="${secondaryColor}"/>
        `;
    } else if (monster.element === 'water') {
        secondaryColor = '#88e0ff';
        bodyPath = `
            <!-- Fins -->
            <path d="M 35,115 Q 10,115 30,140 Z" fill="${secondaryColor}"/>
            <path d="M 165,115 Q 190,115 170,140 Z" fill="${secondaryColor}"/>
            <!-- Body -->
            <path d="M 100,50 C 150,50 160,100 150,150 C 130,175 70,175 50,150 C 40,100 50,50 100,50 Z" fill="${bodyColor}"/>
            <!-- Water Drop Head Ornament -->
            <path d="M 100,30 Q 110,48 100,55 Q 90,48 100,30 Z" fill="${secondaryColor}"/>
        `;
    } else if (monster.element === 'grass') {
        secondaryColor = '#aaff66';
        bodyPath = `
            <!-- Leaf Ears -->
            <path d="M 70,70 Q 30,30 55,20 Q 80,30 80,60 Z" fill="${secondaryColor}"/>
            <path d="M 130,70 Q 170,30 145,20 Q 120,30 120,60 Z" fill="${secondaryColor}"/>
            <!-- Body -->
            <ellipse cx="100" cy="120" rx="52" ry="48" fill="${bodyColor}"/>
            <!-- Chest Flower Ornament -->
            <circle cx="100" cy="145" r="10" fill="#ff66aa"/>
        `;
    } else { // cyber
        secondaryColor = '#00ffff';
        bodyPath = `
            <!-- Cyber Wings/Panels -->
            <path d="M 40,90 L 15,60 L 45,120 Z" fill="${secondaryColor}" opacity="0.8"/>
            <path d="M 160,90 L 185,60 L 155,120 Z" fill="${secondaryColor}" opacity="0.8"/>
            <!-- Body -->
            <rect x="52" y="65" width="96" height="96" rx="28" fill="${bodyColor}"/>
            <!-- Visor/Antenna -->
            <line x1="100" y1="65" x2="100" y2="40" stroke="${secondaryColor}" stroke-width="4"/>
            <circle cx="100" cy="36" r="6" fill="${secondaryColor}"/>
        `;
    }

    return `
    <svg viewBox="0 0 200 200" width="100%" height="100%" class="monster-svg stage-${monster.stage}">
        <defs>
            <filter id="glow_${id}">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Shadow -->
        <ellipse cx="100" cy="180" rx="50" ry="12" fill="rgba(0,0,0,0.35)" />

        <!-- Creature Body Base -->
        <g class="monster-body-group">
            ${bodyPath}

            <!-- Cheeks -->
            <circle cx="68" cy="108" r="8" fill="#ff6688" opacity="0.6"/>
            <circle cx="132" cy="108" r="8" fill="#ff6688" opacity="0.6"/>

            <!-- Face -->
            <g class="monster-face">
                ${eyeLeft}
                ${eyeRight}
                ${mouth}
            </g>

            ${extraFX}
        </g>
    </svg>`;
}
