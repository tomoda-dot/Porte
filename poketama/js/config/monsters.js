/**
 * PokéTama Monster Configurations & Cute Animal-Style SVG Artwork Generators
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff6b5b', bg: 'rgba(255, 107, 91, 0.2)', icon: '🔥', weak: 'water', strong: 'grass' },
    water: { name: '水', color: '#40c4ff', bg: 'rgba(64, 196, 255, 0.2)', icon: '💧', weak: 'grass', strong: 'fire' },
    grass: { name: '草', color: '#52e077', bg: 'rgba(82, 224, 119, 0.2)', icon: '🌿', weak: 'fire', strong: 'water' },
    cyber: { name: '電脳', color: '#e056fd', bg: 'rgba(224, 86, 253, 0.2)', icon: '🔮', weak: 'grass', strong: 'water' }
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
 * Render Authentic Retro Game Boy / Tamagotchi 32x32 Pixel Art (ドット絵) SVG Engine
 */
function renderMonsterSVG(id, options = {}) {
    const isEgg = id.startsWith('egg_');
    const emotion = options.emotion || 'happy'; // happy, sleep, hungry, angry, battle

    const drawP = (rects) => rects.map(([x, y, w, h, c]) => 
        `<rect x="${x}" y="${y}" width="${w || 1}" height="${h || 1}" fill="${c}" />`
    ).join('');

    if (isEgg) {
        const eggData = EGGS_DATABASE[id] || EGGS_DATABASE.egg_fire;
        const crack = options.crackProgress || 0;

        const mainC = eggData.color;
        const spotC = eggData.patternColor;
        const borderC = '#152018';

        return `
        <svg viewBox="0 0 32 32" width="100%" height="100%" class="monster-svg egg-svg" shape-rendering="crispEdges">
            <!-- Shadow -->
            <rect x="8" y="30" width="16" height="1" fill="rgba(0,0,0,0.3)" />
            <rect x="10" y="29" width="12" height="1" fill="rgba(0,0,0,0.4)" />

            <!-- Pixel Egg Outer Border -->
            ${drawP([
                [11,4,10,1, borderC], [9,5,2,2, borderC], [21,5,2,2, borderC],
                [7,7,2,3, borderC], [23,7,2,3, borderC], [5,10,2,14, borderC], [25,10,2,14, borderC],
                [7,24,2,3, borderC], [23,24,2,3, borderC], [9,27,2,2, borderC], [21,27,2,2, borderC],
                [11,29,10,1, borderC]
            ])}

            <!-- Egg Main Color Fill -->
            ${drawP([
                [11,5,10,2, mainC], [9,7,14,3, mainC], [7,10,18,14, mainC],
                [9,24,14,3, mainC], [11,27,10,2, mainC]
            ])}

            <!-- Egg Specular Highlight Pixels -->
            ${drawP([
                [12,6,5,1, '#ffffff'], [10,7,4,4, '#ffffff'], [8,11,2,6, '#ffffff']
            ])}

            <!-- Egg Spot Patterns -->
            ${drawP([
                [11,11,4,4, spotC], [19,16,4,4, spotC], [13,22,3,3, spotC]
            ])}

            <!-- Crack Overlay if Warming -->
            ${crack > 0.3 ? drawP([[15,10,3,1,'#fff'], [17,11,1,4,'#fff'], [14,15,4,1,'#fff']]) : ''}
            ${crack > 0.7 ? drawP([[10,17,3,1,'#fff'], [9,18,1,5,'#fff'], [10,23,3,1,'#fff']]) : ''}
        </svg>`;
    }

    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element];

    let mainColor = elem.color;
    let accentColor = '#ffffff';
    let earInnerColor = '#ffffff';
    let borderColor = '#231830';

    if (monster.element === 'fire') {
        accentColor = '#ffdd55';
        earInnerColor = '#ff8833';
    } else if (monster.element === 'water') {
        accentColor = '#a6edff';
        earInnerColor = '#2979ff';
    } else if (monster.element === 'grass') {
        accentColor = '#d6ff99';
        earInnerColor = '#00e676';
    } else { // cyber
        accentColor = '#00e5ff';
        earInnerColor = '#d500f9';
    }

    // --- POP CUTE BLUSH CHEEKS ---
    const blushPixels = drawP([
        [7,16,3,2, 'rgba(255, 120, 160, 0.85)'],
        [22,16,3,2, 'rgba(255, 120, 160, 0.85)']
    ]);

    // --- 32x32 POP EYE EXPRESSIONS ---
    let eyePixels = drawP([
        [10,12,3,4, '#231830'], [10,12,1,2, '#ffffff'], [12,14,1,1, '#ffffff'],
        [19,12,3,4, '#231830'], [19,12,1,2, '#ffffff'], [21,14,1,1, '#ffffff']
    ]);

    let mouthPixels = drawP([[14,17,4,2, '#ff4477'], [15,17,2,1, '#ffffff']]);
    let emotionOverlay = '';

    if (emotion === 'sleep') {
        eyePixels = drawP([
            [10,14,4,1, '#231830'], [18,14,4,1, '#231830']
        ]);
        mouthPixels = drawP([[15,16,2,2, '#ff6688']]);
        emotionOverlay = drawP([
            [23,6,3,1, '#88ccff'], [25,5,3,1, '#88ccff'], [24,7,4,1, '#88ccff'],
            [27,3,2,1, '#88ccff'], [28,2,2,1, '#88ccff']
        ]);
    } else if (emotion === 'hungry') {
        mouthPixels = drawP([
            [14,17,4,3, '#ff4466'], [15,17,2,1, '#ffffff']
        ]);
        emotionOverlay = drawP([[23,12,2,5, '#33bbee'], [23,17,1,1, '#33bbee']]);
    } else if (emotion === 'angry' || emotion === 'battle') {
        eyePixels = drawP([
            [10,12,3,4, '#231830'], [10,13,2,2, '#ffdd44'], [9,11,4,1, '#231830'],
            [19,12,3,4, '#231830'], [19,13,2,2, '#ffdd44'], [19,11,4,1, '#231830']
        ]);
        mouthPixels = drawP([
            [14,17,4,2, '#ff2244'], [15,17,2,1, '#ffffff']
        ]);
    }

    // --- 32x32 ANIMAL SPECIFIC PIXEL ART BODY ---
    let animalPixelArt = '';

    if (monster.element === 'fire') { // 子狐 (ヒノコ / 火狐)
        animalPixelArt = `
            <!-- Pixel Fox Ears -->
            ${drawP([
                [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
                [5,4,4,4, mainColor], [6,5,2,3, earInnerColor],
                [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
                [22,4,4,4, mainColor], [23,5,2,3, earInnerColor]
            ])}

            <!-- Fluffy Flame Tail -->
            ${drawP([
                [1,16,5,1, borderColor], [0,17,2,9, borderColor], [5,17,2,9, borderColor], [1,26,5,1, borderColor],
                [2,17,3,9, accentColor], [3,18,2,7, mainColor]
            ])}

            <!-- Head & Body Outer Border -->
            ${drawP([
                [9,7,14,1, borderColor], [7,8,2,4, borderColor], [23,8,2,4, borderColor],
                [6,12,2,14, borderColor], [24,12,2,14, borderColor],
                [8,26,16,1, borderColor], [10,27,12,1, borderColor]
            ])}

            <!-- Body Fill -->
            ${drawP([
                [9,8,14,4, mainColor], [8,12,16,14, mainColor]
            ])}

            <!-- White Cream Chest & Belly -->
            ${drawP([
                [12,15,8,9, '#ffffff'], [14,24,4,2, '#ffffff']
            ])}

            <!-- Rosy Cheek Pixels -->
            ${drawP([
                [8,15,3,2, '#ff6688'], [21,15,3,2, '#ff6688']
            ])}

            <!-- Paws -->
            ${drawP([
                [10,25,4,2, '#ffffff'], [18,25,4,2, '#ffffff']
            ])}
        `;
    } else if (monster.element === 'water') { // たれ耳うさぎ (アクアプニ)
        animalPixelArt = `
            <!-- Floppy Bunny Ears -->
            ${drawP([
                [2,6,6,1, borderColor], [1,7,2,10, borderColor], [7,7,2,10, borderColor], [2,17,6,1, borderColor],
                [3,7,4,10, mainColor], [4,8,2,8, accentColor],
                [24,6,6,1, borderColor], [23,7,2,10, borderColor], [29,7,2,10, borderColor], [24,17,6,1, borderColor],
                [25,7,4,10, mainColor], [26,8,2,8, accentColor]
            ])}

            <!-- Swirl Aquatic Tail -->
            ${drawP([
                [25,18,6,1, borderColor], [24,19,2,6, borderColor], [30,19,2,6, borderColor], [25,25,6,1, borderColor],
                [26,19,4,6, accentColor]
            ])}

            <!-- Round Body Outer Border -->
            ${drawP([
                [10,7,12,1, borderColor], [8,8,2,4, borderColor], [22,8,2,4, borderColor],
                [7,12,2,14, borderColor], [23,12,2,14, borderColor],
                [9,26,14,1, borderColor], [11,27,10,1, borderColor]
            ])}

            <!-- Body Fill -->
            ${drawP([
                [10,8,12,4, mainColor], [9,12,14,14, mainColor]
            ])}

            <!-- White Cream Belly -->
            ${drawP([
                [12,15,8,9, '#ffffff']
            ])}

            <!-- Rosy Cheeks -->
            ${drawP([
                [8,15,3,2, '#ff6688'], [21,15,3,2, '#ff6688']
            ])}

            <!-- Paws -->
            ${drawP([
                [10,25,4,2, accentColor], [18,25,4,2, accentColor]
            ])}
        `;
    } else if (monster.element === 'grass') { // 子リス (ポコリーフ)
        animalPixelArt = `
            <!-- Leaf Ears & Flower -->
            ${drawP([
                [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
                [5,4,4,4, mainColor], [6,5,2,3, accentColor],
                [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
                [22,4,4,4, mainColor], [23,5,2,3, accentColor],
                [20,2,3,3, '#ff66aa'], [21,3,1,1, '#ffff44']
            ])}

            <!-- Bushy Leaf Tail -->
            ${drawP([
                [1,14,6,1, borderColor], [0,15,2,10, borderColor], [6,15,2,10, borderColor], [1,25,6,1, borderColor],
                [2,15,4,10, accentColor], [3,16,2,8, mainColor]
            ])}

            <!-- Body Outer Border -->
            ${drawP([
                [9,7,14,1, borderColor], [7,8,2,4, borderColor], [23,8,2,4, borderColor],
                [6,12,2,14, borderColor], [24,12,2,14, borderColor],
                [8,26,16,1, borderColor], [10,27,12,1, borderColor]
            ])}

            <!-- Body Fill -->
            ${drawP([
                [9,8,14,4, mainColor], [8,12,16,14, mainColor]
            ])}

            <!-- White Belly -->
            ${drawP([
                [12,15,8,9, '#ffffff']
            ])}

            <!-- Rosy Cheeks -->
            ${drawP([
                [8,15,3,2, '#ff6688'], [21,15,3,2, '#ff6688']
            ])}

            <!-- Paws -->
            ${drawP([
                [10,25,4,2, accentColor], [18,25,4,2, accentColor]
            ])}
        `;
    } else { // Cyber / Electric (電気ハムスター スパークン)
        animalPixelArt = `
            <!-- Twitchy Hamster Ears & Visor -->
            ${drawP([
                [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
                [5,4,4,4, mainColor], [6,5,2,3, earInnerColor],
                [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
                [22,4,4,4, mainColor], [23,5,2,3, earInnerColor],
                [9,8,14,2, accentColor]
            ])}

            <!-- Lightning Bolt Tail -->
            ${drawP([
                [1,12,3,2, accentColor], [3,14,3,2, accentColor], [2,16,4,2, accentColor],
                [4,18,3,2, accentColor]
            ])}

            <!-- Body Outer Border -->
            ${drawP([
                [9,7,14,1, borderColor], [7,8,2,4, borderColor], [23,8,2,4, borderColor],
                [6,12,2,14, borderColor], [24,12,2,14, borderColor],
                [8,26,16,1, borderColor], [10,27,12,1, borderColor]
            ])}

            <!-- Body Fill -->
            ${drawP([
                [9,8,14,4, mainColor], [8,12,16,14, mainColor]
            ])}

            <!-- White Belly -->
            ${drawP([
                [12,15,8,9, '#ffffff']
            ])}

            <!-- Rosy Cheeks -->
            ${drawP([
                [8,15,3,2, '#ff6688'], [21,15,3,2, '#ff6688']
            ])}

            <!-- Paws -->
            ${drawP([
                [10,25,4,2, '#ffffff'], [18,25,4,2, '#ffffff']
            ])}
        `;
    }

    return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" class="monster-svg stage-${monster.stage}" shape-rendering="crispEdges">
        <!-- Shadow -->
        <rect x="8" y="28" width="16" height="1" fill="rgba(0,0,0,0.3)" />
        <rect x="10" y="27" width="12" height="1" fill="rgba(0,0,0,0.4)" />

        <!-- 32x32 Pixel Art Monster -->
        <g class="monster-body-group">
            ${animalPixelArt}

            <!-- Face Features -->
            <g class="monster-face">
                ${eyePixels}
                <!-- Nose Pixel -->
                <rect x="15" y="15" width="2" height="1" fill="#111827" />
                ${mouthPixels}
            </g>

            ${emotionOverlay}
        </g>
    </svg>`;
}


