/**
 * PokéTama Monster Configurations & Cute Animal-Style SVG Artwork Generators
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff5544', bg: 'rgba(255, 85, 68, 0.15)', icon: '🔥', weak: 'water', strong: 'grass' },
    water: { name: '水', color: '#33aaff', bg: 'rgba(51, 170, 255, 0.15)', icon: '💧', weak: 'grass', strong: 'fire' },
    grass: { name: '草', color: '#44dd66', bg: 'rgba(68, 221, 102, 0.15)', icon: '🌿', weak: 'fire', strong: 'water' },
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
        description: 'ほのかに温かい、可愛い火狐の模様がついたタマゴ。',
        hatchesTo: 'fire_1',
        warmthNeeded: 100,
        color: '#ff5544',
        patternColor: '#ffcc00'
    },
    egg_water: {
        id: 'egg_water',
        name: 'アクアタマゴ',
        element: 'water',
        description: '水玉模様が浮かぶ、すずしい海のタマゴ。',
        hatchesTo: 'water_1',
        warmthNeeded: 100,
        color: '#33aaff',
        patternColor: '#88e0ff'
    },
    egg_grass: {
        id: 'egg_grass',
        name: 'リーフタマゴ',
        element: 'grass',
        description: '四つ葉のクローバーの刺繍がある植物のタマゴ。',
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
    // --- FIRE EVOLUTION LINE (火狐・きつね＆ライオン系) ---
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
        description: 'ふんわりフサフサのシッポを持つ火狐の子犬。元気に甘えて跳ね回る。'
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
        description: '小さな羽がついたドラゴンフォックス。熱い友情で仲間を守る。'
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
        description: '燃えるタテガミを持つ可愛い炎ライオン。頼りになる兄貴分。'
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
        description: '九尾の炎と光の翼を纏う伝説の神聖フォックスドラゴン。'
    },

    // --- WATER EVOLUTION LINE (水うさぎ・あざらし系) ---
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
        description: 'たれ耳と丸い身体がキュートな水うさぎ。プニプニしてて癒やされる。'
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
        description: '貝殻のリュックを背負ったラッコちゃん。水てっぽうが得意。'
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
        description: '海の泡に乗って空を飛ぶクジラウサギ。おっとり優しい性格。'
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
        description: 'クリスタル王冠を戴く深海のアザラシナイト。優しき海の守護神。'
    },

    // --- GRASS EVOLUTION LINE (森のリス・フェネック系) ---
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
        description: '大きな葉っぱ耳とクルンとしたシッポを持つ子リス。日向ぼっこが大好き。'
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
        description: '大きな耳でお花の歌を聞くフェネックキツネ。すばしっこく駆け回る。'
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
        description: '桜の花びらを散らしながら駆ける可愛らしいシカナイト。'
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
        description: '世界樹のハスと光の翼を持つ大自然の聖なる妖精フォックス。'
    },

    // --- CYBER EVOLUTION LINE (電気ハムスター・ネコ系) ---
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
        description: 'ほっぺがピカピカ光る電気ハムスター。きのみを頬張る姿が激カワ。'
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
        description: 'ネコミミバイザーをつけた電脳子ネコ。イナズマのシッポを振る。'
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
        description: 'ネオンの肉球とプラズマツインテールを持つ雷電ライガー。'
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
        description: 'デジタル天使の羽を纏う最強の電脳キャット神。光速の雷撃を放つ。'
    }
};

/**
 * Render Dynamic Cute Animal-Style SVG Artwork
 */
function renderMonsterSVG(id, options = {}) {
    const isEgg = id.startsWith('egg_');
    const emotion = options.emotion || 'happy'; // happy, sleep, hungry, angry, battle

    if (isEgg) {
        const eggData = EGGS_DATABASE[id] || EGGS_DATABASE.egg_fire;
        const crack = options.crackProgress || 0; // 0 to 1
        return `
        <svg viewBox="0 0 200 240" width="100%" height="100%" class="monster-svg egg-svg">
            <defs>
                <radialGradient id="eggGlow_${id}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${eggData.patternColor}" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="${eggData.color}" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="eggGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${eggData.patternColor}"/>
                    <stop offset="50%" stop-color="${eggData.color}"/>
                    <stop offset="100%" stop-color="#1a1c2e"/>
                </linearGradient>
            </defs>

            <!-- Aura Shadow -->
            <ellipse cx="100" cy="215" rx="55" ry="14" fill="rgba(0,0,0,0.35)" />
            <ellipse cx="100" cy="130" rx="75" ry="85" fill="url(#eggGlow_${id})" opacity="0.6"/>

            <!-- Egg Main Shell -->
            <path d="M 100,25 C 152,25 172,80 172,140 C 172,195 142,210 100,210 C 58,210 28,195 28,140 C 28,80 48,25 100,25 Z" 
                  fill="url(#eggGrad_${id})" stroke="#ffffff" stroke-width="3.5" />

            <!-- Cute Ribbon Accent on Egg -->
            <path d="M 85,60 Q 100,70 115,60 Q 125,50 115,40 Q 100,50 85,40 Q 75,50 85,60 Z" fill="#ff77aa" opacity="0.9" />

            <!-- Egg Cute Spot Patterns -->
            <circle cx="75" cy="100" r="16" fill="${eggData.patternColor}" opacity="0.8" />
            <circle cx="130" cy="135" r="20" fill="${eggData.patternColor}" opacity="0.8" />
            <circle cx="70" cy="165" r="14" fill="${eggData.patternColor}" opacity="0.8" />

            <!-- Crack Overlay if Warming -->
            ${crack > 0.3 ? `<path d="M 90,75 L 105,90 L 95,105 L 115,120" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}
            ${crack > 0.7 ? `<path d="M 125,135 L 110,150 L 130,165 L 115,185" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}

            <!-- Shine Highlight -->
            <path d="M 65,45 Q 90,35 110,40 C 80,48 55,75 55,105 C 55,80 60,55 65,45 Z" fill="#ffffff" opacity="0.45" />
        </svg>`;
    }

    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element];

    // --- ANIME ANIMAL EYES & FACE RENDERING ---
    let eyeLeft = `
        <circle cx="76" cy="94" r="11" fill="#1e1e2e"/>
        <circle cx="73" cy="90" r="4.5" fill="#ffffff"/>
        <circle cx="79" cy="97" r="2" fill="#ffffff"/>`;

    let eyeRight = `
        <circle cx="124" cy="94" r="11" fill="#1e1e2e"/>
        <circle cx="121" cy="90" r="4.5" fill="#ffffff"/>
        <circle cx="127" cy="97" r="2" fill="#ffffff"/>`;

    let mouth = `<path d="M 92,106 Q 100,114 108,106" fill="none" stroke="#1e1e2e" stroke-width="3" stroke-linecap="round"/>`;
    let cheeks = `
        <circle cx="63" cy="106" r="8" fill="#ff6699" opacity="0.65"/>
        <circle cx="137" cy="106" r="8" fill="#ff6699" opacity="0.65"/>`;
    let extraOverlay = '';

    if (emotion === 'sleep') {
        eyeLeft = `<path d="M 67,95 Q 76,102 85,95" fill="none" stroke="#1e1e2e" stroke-width="3.5" stroke-linecap="round"/>`;
        eyeRight = `<path d="M 115,95 Q 124,102 133,95" fill="none" stroke="#1e1e2e" stroke-width="3.5" stroke-linecap="round"/>`;
        mouth = `<ellipse cx="100" cy="110" rx="3.5" ry="5" fill="#ff6699"/>`;
        extraOverlay = `<text x="142" y="65" fill="#99ccff" font-family="'M PLUS Rounded 1c', sans-serif" font-weight="900" font-size="24">Zzz...</text>`;
    } else if (emotion === 'hungry') {
        mouth = `<path d="M 92,112 Q 100,102 108,112 Z" fill="#ff6699" stroke="#1e1e2e" stroke-width="2"/>`;
        extraOverlay = `<path d="M 132,72 Q 138,82 132,92" fill="none" stroke="#55ccff" stroke-width="3.5" stroke-linecap="round"/>`;
    } else if (emotion === 'angry' || emotion === 'battle') {
        eyeLeft = `
            <circle cx="76" cy="94" r="11" fill="#1e1e2e"/>
            <circle cx="74" cy="91" r="4" fill="#ffdd44"/>
            <path d="M 64,82 L 86,90" stroke="#1e1e2e" stroke-width="3" stroke-linecap="round"/>`;
        eyeRight = `
            <circle cx="124" cy="94" r="11" fill="#1e1e2e"/>
            <circle cx="122" cy="91" r="4" fill="#ffdd44"/>
            <path d="M 136,82 L 114,90" stroke="#1e1e2e" stroke-width="3" stroke-linecap="round"/>`;
        mouth = `<path d="M 92,112 Q 100,104 108,112 Z" fill="#ff4444"/>`;
        extraOverlay = `<path d="M 45,45 L 55,60 M 155,45 L 145,60" stroke="${elem.color}" stroke-width="4.5" stroke-linecap="round"/>`;
    }

    // --- ANIMAL SPECIFIC BODY & EARS ARTWORK ---
    let animalFeaturePath = '';
    let mainColor = elem.color;
    let accentColor = '#ffffff';

    if (monster.element === 'fire') {
        accentColor = '#ffcc00';
        animalFeaturePath = `
            <!-- Fluffy Fox Ears (Large Fluffy Ears) -->
            <path d="M 68,68 Q 30,25 58,15 Q 82,25 80,62 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 64,60 Q 42,32 58,25 Q 74,32 74,56 Z" fill="${accentColor}"/>

            <path d="M 132,68 Q 170,25 142,15 Q 118,25 120,62 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 136,60 Q 158,32 142,25 Q 126,32 126,56 Z" fill="${accentColor}"/>

            <!-- Fluffy Flame Fox Tail -->
            <path d="M 42,145 Q 10,110 30,75 Q 58,105 60,135 Z" fill="${accentColor}"/>
            <path d="M 32,130 Q 15,112 28,90 Q 48,110 50,130 Z" fill="${mainColor}"/>

            <!-- Chubby Animal Body -->
            <ellipse cx="100" cy="115" rx="54" ry="48" fill="${mainColor}"/>
            <!-- Soft White Belly Patch -->
            <ellipse cx="100" cy="130" rx="30" ry="24" fill="#ffffff" opacity="0.9"/>

            <!-- Cute Paws -->
            <ellipse cx="74" cy="154" rx="12" ry="8" fill="#ffffff"/>
            <ellipse cx="126" cy="154" rx="12" ry="8" fill="#ffffff"/>
        `;
    } else if (monster.element === 'water') {
        accentColor = '#88e0ff';
        animalFeaturePath = `
            <!-- Floppy Water Bunny / Seal Ears -->
            <path d="M 70,68 Q 25,65 30,105 Q 60,110 74,74 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 66,74 Q 35,72 38,98 Q 58,102 70,78 Z" fill="${accentColor}"/>

            <path d="M 130,68 Q 175,65 170,105 Q 140,110 126,74 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 134,74 Q 165,72 162,98 Q 142,102 130,78 Z" fill="${accentColor}"/>

            <!-- Aquatic Swirl Tail -->
            <path d="M 100,162 Q 130,185 155,160 Q 145,145 120,150 Z" fill="${accentColor}"/>

            <!-- Round Squishy Body -->
            <ellipse cx="100" cy="115" rx="55" ry="50" fill="${mainColor}"/>
            <!-- White Cream Belly -->
            <ellipse cx="100" cy="126" rx="34" ry="28" fill="#ffffff" opacity="0.9"/>

            <!-- Small Flippers / Paws -->
            <ellipse cx="68" cy="150" rx="14" ry="8" fill="${accentColor}"/>
            <ellipse cx="132" cy="150" rx="14" ry="8" fill="${accentColor}"/>
        `;
    } else if (monster.element === 'grass') {
        accentColor = '#aaff66';
        animalFeaturePath = `
            <!-- Leafy Fennec / Squirrel Ears -->
            <path d="M 72,66 Q 35,20 50,10 Q 75,20 82,58 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 68,60 Q 42,26 52,18 Q 70,26 76,54 Z" fill="${accentColor}"/>

            <path d="M 128,66 Q 165,20 150,10 Q 125,20 118,58 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 132,60 Q 158,26 148,18 Q 130,26 124,54 Z" fill="${accentColor}"/>

            <!-- Giant Bushy Leaf Tail -->
            <path d="M 45,140 Q 15,115 20,70 Q 55,85 62,130 Z" fill="${accentColor}"/>
            <!-- Flower Head Ornament -->
            <circle cx="120" cy="45" r="10" fill="#ff77aa"/>
            <circle cx="120" cy="45" r="4" fill="#ffffaa"/>

            <!-- Round Body -->
            <ellipse cx="100" cy="115" rx="52" ry="46" fill="${mainColor}"/>
            <ellipse cx="100" cy="128" rx="32" ry="24" fill="#ffffff" opacity="0.9"/>

            <!-- Cute Little Paws -->
            <circle cx="74" cy="152" r="9" fill="${accentColor}"/>
            <circle cx="126" cy="152" r="9" fill="${accentColor}"/>
        `;
    } else { // Cyber / Electric (電気ハムスター・ネコ)
        accentColor = '#00ffff';
        animalFeaturePath = `
            <!-- Twitchy Cat/Hamster Ears -->
            <path d="M 72,65 Q 48,25 65,20 Q 82,32 80,60 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 70,58 Q 54,28 65,25 Q 76,32 76,54 Z" fill="${accentColor}"/>

            <path d="M 128,65 Q 152,25 135,20 Q 118,32 120,60 Z" fill="${mainColor}" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M 130,58 Q 146,28 135,25 Q 124,32 124,54 Z" fill="${accentColor}"/>

            <!-- Lightning Bolt Tail -->
            <path d="M 45,135 L 20,110 L 35,110 L 15,85 L 50,110 Z" fill="${accentColor}"/>

            <!-- Visor Accent / Headband -->
            <rect x="75" y="60" width="50" height="8" rx="4" fill="${accentColor}" opacity="0.8"/>

            <!-- Body -->
            <ellipse cx="100" cy="115" rx="53" ry="47" fill="${mainColor}"/>
            <ellipse cx="100" cy="128" rx="30" ry="24" fill="#ffffff" opacity="0.9"/>

            <!-- Cute Paws -->
            <ellipse cx="72" cy="152" rx="10" ry="7" fill="#ffffff"/>
            <ellipse cx="128" cy="152" rx="10" ry="7" fill="#ffffff"/>
        `;
    }

    return `
    <svg viewBox="0 0 200 200" width="100%" height="100%" class="monster-svg stage-${monster.stage}">
        <defs>
            <filter id="glow_${id}">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Soft Shadow -->
        <ellipse cx="100" cy="176" rx="46" ry="10" fill="rgba(0,0,0,0.3)" />

        <!-- Cute Animal Body Group -->
        <g class="monster-body-group">
            ${animalFeaturePath}

            <!-- Rosy Cheeks -->
            ${cheeks}

            <!-- Anime Eyes & Cute Nose/Mouth -->
            <g class="monster-face">
                ${eyeLeft}
                ${eyeRight}

                <!-- Cute Animal Button Nose -->
                <ellipse cx="100" cy="101" rx="3" ry="2.2" fill="#1e1e2e"/>

                ${mouth}
            </g>

            ${extraOverlay}
        </g>
    </svg>`;
}
