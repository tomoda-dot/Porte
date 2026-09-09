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
 * Render Authentic Retro Pixel Art (ドット絵) SVG Artwork
 */
function renderMonsterSVG(id, options = {}) {
    const isEgg = id.startsWith('egg_');
    const emotion = options.emotion || 'happy'; // happy, sleep, hungry, angry, battle

    if (isEgg) {
        const eggData = EGGS_DATABASE[id] || EGGS_DATABASE.egg_fire;
        const crack = options.crackProgress || 0; // 0 to 1

        return `
        <svg viewBox="0 0 24 24" width="100%" height="100%" class="monster-svg egg-svg" shape-rendering="crispEdges">
            <!-- Shadow -->
            <rect x="6" y="22" width="12" height="1" fill="rgba(0,0,0,0.3)" />
            <rect x="8" y="21" width="8" height="1" fill="rgba(0,0,0,0.4)" />

            <!-- Egg Outer Pixel Border -->
            <rect x="8" y="2" width="8" height="1" fill="#111" />
            <rect x="6" y="3" width="2" height="2" fill="#111" />
            <rect x="16" y="3" width="2" height="2" fill="#111" />
            <rect x="4" y="5" width="2" height="13" fill="#111" />
            <rect x="18" y="5" width="2" height="13" fill="#111" />
            <rect x="6" y="18" width="2" height="3" fill="#111" />
            <rect x="16" y="18" width="2" height="3" fill="#111" />
            <rect x="8" y="20" width="8" height="1" fill="#111" />

            <!-- Egg Body Fill -->
            <rect x="8" y="3" width="8" height="2" fill="${eggData.color}" />
            <rect x="6" y="5" width="12" height="13" fill="${eggData.color}" />
            <rect x="8" y="18" width="8" height="2" fill="${eggData.color}" />

            <!-- Egg Highlight Pixels -->
            <rect x="9" y="4" width="3" height="1" fill="#ffffff" opacity="0.8" />
            <rect x="7" y="5" width="2" height="4" fill="#ffffff" opacity="0.6" />

            <!-- Pixel Spot Patterns -->
            <rect x="8" y="8" width="3" height="3" fill="${eggData.patternColor}" />
            <rect x="14" y="11" width="3" height="3" fill="${eggData.patternColor}" />
            <rect x="9" y="15" width="2" height="2" fill="${eggData.patternColor}" />

            <!-- Crack Pixels if warming -->
            ${crack > 0.3 ? `<rect x="11" y="7" width="2" height="1" fill="#fff" /><rect x="12" y="8" width="1" height="2" fill="#fff" /><rect x="10" y="10" width="2" height="1" fill="#fff" />` : ''}
            ${crack > 0.7 ? `<rect x="8" y="12" width="2" height="1" fill="#fff" /><rect x="7" y="13" width="1" height="3" fill="#fff" /><rect x="8" y="15" width="2" height="1" fill="#fff" />` : ''}
        </svg>`;
    }

    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element];

    let mainColor = elem.color;
    let accentColor = '#ffffff';
    let earColor = '#ffffff';

    if (monster.element === 'fire') {
        accentColor = '#ffcc00';
        earColor = '#ff9900';
    } else if (monster.element === 'water') {
        accentColor = '#88e0ff';
        earColor = '#3388ff';
    } else if (monster.element === 'grass') {
        accentColor = '#aaff66';
        earColor = '#33cc55';
    } else { // cyber
        accentColor = '#00ffff';
        earColor = '#aa00ff';
    }

    // --- PIXEL EXPRESSION OVERLAYS ---
    let eyePixels = `
        <rect x="8" y="10" width="2" height="3" fill="#111" />
        <rect x="8" y="10" width="1" height="1" fill="#fff" />
        <rect x="14" y="10" width="2" height="3" fill="#111" />
        <rect x="14" y="10" width="1" height="1" fill="#fff" />`;

    let mouthPixels = `<rect x="11" y="13" width="2" height="1" fill="#111" />`;
    let emotionOverlay = '';

    if (emotion === 'sleep') {
        eyePixels = `
            <rect x="8" y="11" width="3" height="1" fill="#111" />
            <rect x="13" y="11" width="3" height="1" fill="#111" />`;
        mouthPixels = `<rect x="11" y="13" width="2" height="2" fill="#ff77aa" />`;
        emotionOverlay = `
            <rect x="17" y="5" width="2" height="1" fill="#99ccff" />
            <rect x="19" y="4" width="2" height="1" fill="#99ccff" />
            <rect x="18" y="6" width="3" height="1" fill="#99ccff" />`;
    } else if (emotion === 'hungry') {
        mouthPixels = `
            <rect x="10" y="13" width="4" height="2" fill="#ff4466" />
            <rect x="11" y="13" width="2" height="1" fill="#fff" />`;
        emotionOverlay = `<rect x="17" y="9" width="1" height="3" fill="#55ccff" />`;
    } else if (emotion === 'angry' || emotion === 'battle') {
        eyePixels = `
            <rect x="8" y="10" width="2" height="3" fill="#111" />
            <rect x="8" y="11" width="1" height="1" fill="#ffdd44" />
            <rect x="7" y="9" width="3" height="1" fill="#111" />
            <rect x="14" y="10" width="2" height="3" fill="#111" />
            <rect x="14" y="11" width="1" height="1" fill="#ffdd44" />
            <rect x="14" y="9" width="3" height="1" fill="#111" />`;
        mouthPixels = `
            <rect x="10" y="13" width="4" height="2" fill="#ff2244" />
            <rect x="11" y="13" width="2" height="1" fill="#fff" />`;
    }

    // --- ANIMAL SPECIFIC PIXEL ART BODY ---
    let pixelFeatureSvg = '';

    if (monster.element === 'fire') { // 子狐・キツネ
        pixelFeatureSvg = `
            <!-- Pixel Fox Ears -->
            <rect x="4" y="3" width="4" height="4" fill="${mainColor}" />
            <rect x="5" y="4" width="2" height="2" fill="${accentColor}" />
            <rect x="16" y="3" width="4" height="4" fill="${mainColor}" />
            <rect x="17" y="4" width="2" height="2" fill="${accentColor}" />

            <!-- Pixel Fluffy Fox Tail -->
            <rect x="1" y="12" width="4" height="5" fill="${accentColor}" />
            <rect x="2" y="13" width="3" height="4" fill="${mainColor}" />

            <!-- Pixel Chubby Body -->
            <rect x="6" y="7" width="12" height="10" fill="${mainColor}" />
            <!-- White Cream Belly -->
            <rect x="9" y="11" width="6" height="5" fill="#ffffff" />

            <!-- Rosy Cheeks -->
            <rect x="6" y="12" width="2" height="1" fill="#ff6699" />
            <rect x="16" y="12" width="2" height="1" fill="#ff6699" />

            <!-- Paws -->
            <rect x="7" y="17" width="3" height="2" fill="#ffffff" />
            <rect x="14" y="17" width="3" height="2" fill="#ffffff" />
        `;
    } else if (monster.element === 'water') { // たれ耳うさぎ
        pixelFeatureSvg = `
            <!-- Floppy Pixel Bunny Ears -->
            <rect x="2" y="5" width="4" height="6" fill="${mainColor}" />
            <rect x="3" y="6" width="2" height="4" fill="${accentColor}" />
            <rect x="18" y="5" width="4" height="6" fill="${mainColor}" />
            <rect x="19" y="6" width="2" height="4" fill="${accentColor}" />

            <!-- Aquatic Swirl Tail -->
            <rect x="17" y="14" width="5" height="3" fill="${accentColor}" />

            <!-- Round Pixel Body -->
            <rect x="5" y="7" width="14" height="10" fill="${mainColor}" />
            <!-- White Belly -->
            <rect x="8" y="11" width="8" height="5" fill="#ffffff" />

            <!-- Rosy Cheeks -->
            <rect x="6" y="12" width="2" height="1" fill="#ff6699" />
            <rect x="16" y="12" width="2" height="1" fill="#ff6699" />

            <!-- Paws -->
            <rect x="7" y="17" width="3" height="2" fill="${accentColor}" />
            <rect x="14" y="17" width="3" height="2" fill="${accentColor}" />
        `;
    } else if (monster.element === 'grass') { // 子リス
        pixelFeatureSvg = `
            <!-- Leaf Ears & Flower -->
            <rect x="4" y="2" width="4" height="5" fill="${mainColor}" />
            <rect x="5" y="3" width="2" height="3" fill="${accentColor}" />
            <rect x="16" y="2" width="4" height="5" fill="${mainColor}" />
            <rect x="17" y="3" width="2" height="3" fill="${accentColor}" />
            <rect x="15" y="2" width="2" height="2" fill="#ff77aa" />

            <!-- Giant Leaf Bushy Tail -->
            <rect x="1" y="10" width="5" height="7" fill="${accentColor}" />
            <rect x="2" y="11" width="3" height="5" fill="${mainColor}" />

            <!-- Round Squirrel Body -->
            <rect x="5" y="7" width="14" height="10" fill="${mainColor}" />
            <rect x="8" y="11" width="8" height="5" fill="#ffffff" />

            <!-- Rosy Cheeks -->
            <rect x="6" y="12" width="2" height="1" fill="#ff6699" />
            <rect x="16" y="12" width="2" height="1" fill="#ff6699" />

            <!-- Paws -->
            <rect x="7" y="17" width="3" height="2" fill="${accentColor}" />
            <rect x="14" y="17" width="3" height="2" fill="${accentColor}" />
        `;
    } else { // Cyber / Electric (電気ハムスター)
        pixelFeatureSvg = `
            <!-- Twitchy Hamster Ears & Visor -->
            <rect x="4" y="3" width="4" height="4" fill="${mainColor}" />
            <rect x="5" y="4" width="2" height="2" fill="${accentColor}" />
            <rect x="16" y="3" width="4" height="4" fill="${mainColor}" />
            <rect x="17" y="4" width="2" height="2" fill="${accentColor}" />
            <rect x="7" y="7" width="10" height="2" fill="${accentColor}" />

            <!-- Lightning Tail -->
            <rect x="1" y="10" width="2" height="3" fill="${accentColor}" />
            <rect x="2" y="12" width="3" height="2" fill="${accentColor}" />

            <!-- Body -->
            <rect x="5" y="7" width="14" height="10" fill="${mainColor}" />
            <rect x="8" y="11" width="8" height="5" fill="#ffffff" />

            <!-- Rosy Cheeks -->
            <rect x="6" y="12" width="2" height="1" fill="#ff6699" />
            <rect x="16" y="12" width="2" height="1" fill="#ff6699" />

            <!-- Paws -->
            <rect x="7" y="17" width="3" height="2" fill="#ffffff" />
            <rect x="14" y="17" width="3" height="2" fill="#ffffff" />
        `;
    }

    return `
    <svg viewBox="0 0 24 24" width="100%" height="100%" class="monster-svg stage-${monster.stage}" shape-rendering="crispEdges">
        <!-- Shadow -->
        <rect x="6" y="19" width="12" height="1" fill="rgba(0,0,0,0.3)" />
        <rect x="8" y="20" width="8" height="1" fill="rgba(0,0,0,0.4)" />

        <!-- Pixel Monster Body & Features -->
        <g class="monster-body-group">
            ${pixelFeatureSvg}

            <!-- Pixel Face Expressions -->
            <g class="monster-face">
                ${eyePixels}
                <!-- Nose Pixel -->
                <rect x="11" y="12" width="2" height="1" fill="#111" />
                ${mouthPixels}
            </g>

            ${emotionOverlay}
        </g>
    </svg>`;
}

