/**
 * Monster Breeder Championship - Database & SVG Generator
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff6b5b', bg: 'rgba(255, 107, 91, 0.2)', icon: '🔥' },
    water: { name: '水', color: '#40c4ff', bg: 'rgba(64, 196, 255, 0.2)', icon: '💧' },
    grass: { name: '草', color: '#52e077', bg: 'rgba(82, 224, 119, 0.2)', icon: '🌿' },
    cyber: { name: '電脳', color: '#e056fd', bg: 'rgba(224, 86, 253, 0.2)', icon: '🔮' }
};

const STAGES = {
    baby: '幼体',
    child: '成長体',
    adult: '成熟体',
    ultimate: '究極体'
};

const MOVES_DATABASE = {
    tackle: { id: 'tackle', name: 'たい当たり', power: 25, type: 'normal', desc: '基本の体当たり攻撃' },
    flame_charge: { id: 'flame_charge', name: 'ニトロチャージ', power: 45, type: 'fire', desc: '炎を纏って高速突撃' },
    fire_breath: { id: 'fire_breath', name: '火炎放射', power: 75, type: 'fire', desc: '激しい炎で灼熱ダメージ' },
    inferno_strike: { id: 'inferno_strike', name: '爆裂連撃爪', power: 120, type: 'fire', desc: '究極の爆炎フィニッシュ' },

    water_drop: { id: 'water_drop', name: 'みずでっぽう', power: 30, type: 'water', desc: '水流を発射する' },
    aqua_tail: { id: 'aqua_tail', name: 'アクアテール', power: 55, type: 'water', desc: '大波の尾で打撃' },
    hydro_pump: { id: 'hydro_pump', name: 'ハイドロポンプ', power: 80, type: 'water', desc: '高圧水流で薙ぎ払う' },
    leviathan_wave: { id: 'leviathan_wave', name: '神海大津波', power: 125, type: 'water', desc: '全てを呑み込む大津波' },

    leaf_shot: { id: 'leaf_shot', name: 'はっぱカッター', power: 30, type: 'grass', desc: '鋭い葉っぱを発射' },
    vine_whip: { id: 'vine_whip', name: 'つるのムチ', power: 50, type: 'grass', desc: '強靭なツルで打撃' },
    petal_storm: { id: 'petal_storm', name: '花吹雪乱舞', power: 75, type: 'grass', desc: '嵐のような花弁攻撃' },
    gaia_blaster: { id: 'gaia_blaster', name: '大樹創世砲', power: 120, type: 'grass', desc: '大自然のエネルギー放出' },

    spark: { id: 'spark', name: 'スパーク', power: 35, type: 'cyber', desc: '電撃ショックを与える' },
    laser_claw: { id: 'laser_claw', name: 'プラズマクロー', power: 60, type: 'cyber', desc: '高圧電流の爪で引き裂く' },
    giga_volt: { id: 'giga_volt', name: 'ギガボルトバースト', power: 85, type: 'cyber', desc: '一兆ボルトの雷撃' },
    omega_cannon: { id: 'omega_cannon', name: '終焉破滅砲', power: 130, type: 'cyber', desc: '次元を穿つ究極砲' }
};

const MONSTERS_DATABASE = {
    // --- FIRE LINE ---
    fire_1: {
        id: 'fire_1', name: 'ヒノコ', stage: 'baby', element: 'fire',
        baseHp: 100, baseAtk: 25, baseDef: 15, baseSpd: 20,
        moves: ['tackle', 'flame_charge'], nextEvolution: 'fire_2', reqAtk: 60
    },
    fire_2: {
        id: 'fire_2', name: 'ヒノリュウ', stage: 'child', element: 'fire',
        baseHp: 180, baseAtk: 55, baseDef: 35, baseSpd: 45,
        moves: ['tackle', 'flame_charge', 'fire_breath'], nextEvolution: 'fire_3', reqAtk: 140
    },
    fire_3: {
        id: 'fire_3', name: 'バーンレックス', stage: 'adult', element: 'fire',
        baseHp: 320, baseAtk: 110, baseDef: 75, baseSpd: 85,
        moves: ['flame_charge', 'fire_breath', 'inferno_strike'], nextEvolution: 'fire_4', reqAtk: 260
    },
    fire_4: {
        id: 'fire_4', name: 'インフェルノス', stage: 'ultimate', element: 'fire',
 baseHp: 550, baseAtk: 210, baseDef: 140, baseSpd: 160,
        moves: ['flame_charge', 'fire_breath', 'inferno_strike'], nextEvolution: null
    },

    // --- WATER LINE ---
    water_1: {
        id: 'water_1', name: 'アクアプニ', stage: 'baby', element: 'water',
        baseHp: 110, baseAtk: 20, baseDef: 20, baseSpd: 18,
        moves: ['tackle', 'water_drop'], nextEvolution: 'water_2', reqDef: 60
    },
    water_2: {
        id: 'water_2', name: 'アクアラビ', stage: 'child', element: 'water',
        baseHp: 200, baseAtk: 45, baseDef: 50, baseSpd: 40,
        moves: ['tackle', 'water_drop', 'aqua_tail'], nextEvolution: 'water_3', reqDef: 135
    },
    water_3: {
        id: 'water_3', name: 'オーシャンラビ', stage: 'adult', element: 'water',
        baseHp: 360, baseAtk: 85, baseDef: 115, baseSpd: 75,
        moves: ['water_drop', 'aqua_tail', 'hydro_pump'], nextEvolution: 'water_4', reqDef: 250
    },
    water_4: {
        id: 'water_4', name: 'リヴァイアサン', stage: 'ultimate', element: 'water',
        baseHp: 620, baseAtk: 160, baseDef: 210, baseSpd: 130,
        moves: ['aqua_tail', 'hydro_pump', 'leviathan_wave'], nextEvolution: null
    },

    // --- GRASS LINE ---
    grass_1: {
        id: 'grass_1', name: 'ポコリーフ', stage: 'baby', element: 'grass',
        baseHp: 105, baseAtk: 22, baseDef: 18, baseSpd: 22,
        moves: ['tackle', 'leaf_shot'], nextEvolution: 'grass_2', reqSpd: 60
    },
    grass_2: {
        id: 'grass_2', name: 'リスリーフ', stage: 'child', element: 'grass',
        baseHp: 190, baseAtk: 50, baseDef: 40, baseSpd: 55,
        moves: ['tackle', 'leaf_shot', 'vine_whip'], nextEvolution: 'grass_3', reqSpd: 140
    },
    grass_3: {
        id: 'grass_3', name: 'フォレストリス', stage: 'adult', element: 'grass',
        baseHp: 340, baseAtk: 95, baseDef: 85, baseSpd: 120,
        moves: ['leaf_shot', 'vine_whip', 'petal_storm'], nextEvolution: 'grass_4', reqSpd: 260
    },
    grass_4: {
        id: 'grass_4', name: 'ガイアリス', stage: 'ultimate', element: 'grass',
        baseHp: 580, baseAtk: 180, baseDef: 150, baseSpd: 220,
        moves: ['vine_whip', 'petal_storm', 'gaia_blaster'], nextEvolution: null
    }
};

function renderMonsterSVG(id, options = {}) {
    const emotion = options.emotion || 'happy';
    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element];

    const drawP = (rects) => rects.map(([x, y, w, h, c]) => 
        `<rect x="${x}" y="${y}" width="${w || 1}" height="${h || 1}" fill="${c}" />`
    ).join('');

    let mainColor = elem.color;
    let accentColor = '#ffffff';
    let earInnerColor = '#ffcc00';
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
    }

    // Rosy Blush Cheeks
    const blush = drawP([
        [7,16,3,2, 'rgba(255, 120, 160, 0.85)'],
        [22,16,3,2, 'rgba(255, 120, 160, 0.85)']
    ]);

    // Anime Eye Sparkles
    let eyePixels = drawP([
        [10,12,3,4, '#231830'], [10,12,1,2, '#ffffff'], [12,14,1,1, '#ffffff'],
        [19,12,3,4, '#231830'], [19,12,1,2, '#ffffff'], [21,14,1,1, '#ffffff']
    ]);

    let mouthPixels = drawP([[14,17,4,2, '#ff4477'], [15,17,2,1, '#ffffff']]);

    if (emotion === 'tired' || emotion === 'sleep') {
        eyePixels = drawP([[10,14,4,1, '#231830'], [18,14,4,1, '#231830']]);
        mouthPixels = drawP([[15,16,2,2, '#ff6688']]);
    } else if (emotion === 'train') {
        eyePixels = drawP([
            [10,12,3,4, '#231830'], [10,13,2,2, '#ffdd44'], [9,11,4,1, '#231830'],
            [19,12,3,4, '#231830'], [19,13,2,2, '#ffdd44'], [19,11,4,1, '#231830']
        ]);
    }

    let bodyArt = '';
    if (monster.element === 'fire') {
        bodyArt = `
            ${drawP([
                [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
                [5,4,4,4, mainColor], [6,5,2,3, earInnerColor],
                [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
                [22,4,4,4, mainColor], [23,5,2,3, earInnerColor]
            ])}
            ${drawP([
                [1,16,5,1, borderColor], [0,17,2,9, borderColor], [5,17,2,9, borderColor], [1,26,5,1, borderColor],
                [2,17,3,9, accentColor], [3,18,2,7, mainColor]
            ])}
            ${drawP([
                [9,7,14,1, borderColor], [7,8,2,4, borderColor], [23,8,2,4, borderColor],
                [6,12,2,14, borderColor], [24,12,2,14, borderColor],
                [8,26,16,1, borderColor], [10,27,12,1, borderColor]
            ])}
            ${drawP([[9,8,14,4, mainColor], [8,12,16,14, mainColor]])}
            ${drawP([[12,15,8,9, '#ffffff'], [14,24,4,2, '#ffffff']])}
            ${drawP([[10,25,4,2, '#ffffff'], [18,25,4,2, '#ffffff']])}
        `;
    } else if (monster.element === 'water') {
        bodyArt = `
            ${drawP([
                [2,6,6,1, borderColor], [1,7,2,10, borderColor], [7,7,2,10, borderColor], [2,17,6,1, borderColor],
                [3,7,4,10, mainColor], [4,8,2,8, accentColor],
                [24,6,6,1, borderColor], [23,7,2,10, borderColor], [29,7,2,10, borderColor], [24,17,6,1, borderColor],
                [25,7,4,10, mainColor], [26,8,2,8, accentColor]
            ])}
            ${drawP([
                [10,7,12,1, borderColor], [8,8,2,4, borderColor], [22,8,2,4, borderColor],
                [7,12,2,14, borderColor], [23,12,2,14, borderColor],
                [9,26,14,1, borderColor], [11,27,10,1, borderColor]
            ])}
            ${drawP([[10,8,12,4, mainColor], [9,12,14,14, mainColor]])}
            ${drawP([[12,15,8,9, '#ffffff']])}
            ${drawP([[10,25,4,2, accentColor], [18,25,4,2, accentColor]])}
        `;
    } else { // grass
        bodyArt = `
            ${drawP([
                [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
                [5,4,4,4, mainColor], [6,5,2,3, accentColor],
                [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
                [22,4,4,4, mainColor], [23,5,2,3, accentColor],
                [20,2,3,3, '#ff66aa'], [21,3,1,1, '#ffff44']
            ])}
            ${drawP([
                [9,7,14,1, borderColor], [7,8,2,4, borderColor], [23,8,2,4, borderColor],
                [6,12,2,14, borderColor], [24,12,2,14, borderColor],
                [8,26,16,1, borderColor], [10,27,12,1, borderColor]
            ])}
            ${drawP([[9,8,14,4, mainColor], [8,12,16,14, mainColor]])}
            ${drawP([[12,15,8,9, '#ffffff']])}
            ${drawP([[10,25,4,2, '#ffffff'], [18,25,4,2, '#ffffff']])}
        `;
    }

    return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" class="monster-svg stage-${monster.stage}">
        <rect x="8" y="28" width="16" height="1" fill="rgba(0,0,0,0.3)" />
        <g class="monster-body">
            ${bodyArt}
            <g class="face">
                ${eyePixels}
                <rect x="15" y="15" width="2" height="1" fill="#231830" />
                ${mouthPixels}
                ${blush}
            </g>
        </g>
    </svg>`;
}
