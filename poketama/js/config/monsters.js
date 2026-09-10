/**
 * Pokemon-Style 2D RPG - Monsters, Moves & SVG Generator Database
 */

const ELEMENT_TYPES = {
    fire: { name: '炎', color: '#ff5544', bg: 'rgba(255, 85, 68, 0.2)', icon: '🔥', weak: 'water', strong: 'grass' },
    water: { name: '水', color: '#33aaff', bg: 'rgba(51, 170, 255, 0.2)', icon: '💧', weak: 'grass', strong: 'fire' },
    grass: { name: '草', color: '#44dd66', bg: 'rgba(68, 221, 102, 0.2)', icon: '🌿', weak: 'fire', strong: 'water' },
    normal: { name: 'ノーマル', color: '#aaaaaa', bg: 'rgba(170, 170, 170, 0.2)', icon: '⚔️', weak: 'none', strong: 'none' }
};

const MOVES_DATABASE = {
    tackle: { id: 'tackle', name: 'たい当たり', type: 'normal', power: 35, maxPp: 35, desc: '体をぶつけて攻撃' },
    scratch: { id: 'scratch', name: 'ひっかく', type: 'normal', power: 40, maxPp: 30, desc: '鋭い爪でひっかく' },
    
    ember: { id: 'ember', name: 'ひのこ', type: 'fire', power: 40, maxPp: 25, desc: '小さな炎を放つ' },
    flame_wheel: { id: 'flame_wheel', name: '火炎車', type: 'fire', power: 65, maxPp: 15, desc: '炎を纏って体当たり' },
    fire_blast: { id: 'fire_blast', name: '大文字', type: 'fire', power: 95, maxPp: 5, desc: '爆炎の文字で焼き尽くす' },

    water_gun: { id: 'water_gun', name: '水鉄砲', type: 'water', power: 40, maxPp: 25, desc: '勢いよく水を噴射する' },
    bubble_beam: { id: 'bubble_beam', name: 'バブル光線', type: 'water', power: 65, maxPp: 15, desc: '大量の泡を発射' },
    hydro_pump: { id: 'hydro_pump', name: 'ハイドロポンプ', type: 'water', power: 95, maxPp: 5, desc: '高圧水流で薙ぎ払う' },

    vine_whip: { id: 'vine_whip', name: 'つるのムチ', type: 'grass', power: 45, maxPp: 25, desc: 'しなやかなツルで叩く' },
    razor_leaf: { id: 'razor_leaf', name: 'はっぱカッター', type: 'grass', power: 65, maxPp: 15, desc: '鋭い葉っぱを放つ' },
    solar_beam: { id: 'solar_beam', name: 'ソーラービーム', type: 'grass', power: 100, maxPp: 5, desc: '光線を照射する大技' }
};

const MONSTERS_DATABASE = {
    // --- STARTER 1: FIRE LINE ---
    fire_1: {
        id: 'fire_1', name: 'ヒノコ', element: 'fire', stage: 'baby',
        baseHp: 42, baseAtk: 52, baseDef: 43, baseSpd: 60,
        moves: ['tackle', 'ember'], nextEvo: 'fire_2', evoLevel: 12
    },
    fire_2: {
        id: 'fire_2', name: 'ヒノリュウ', element: 'fire', stage: 'child',
        baseHp: 64, baseAtk: 78, baseDef: 65, baseSpd: 80,
        moves: ['scratch', 'ember', 'flame_wheel'], nextEvo: 'fire_3', evoLevel: 28
    },
    fire_3: {
        id: 'fire_3', name: 'バーンレックス', element: 'fire', stage: 'adult',
        baseHp: 84, baseAtk: 104, baseDef: 85, baseSpd: 100,
        moves: ['scratch', 'flame_wheel', 'fire_blast'], nextEvo: null
    },

    // --- STARTER 2: WATER LINE ---
    water_1: {
        id: 'water_1', name: 'アクアプニ', element: 'water', stage: 'baby',
        baseHp: 48, baseAtk: 45, baseDef: 55, baseSpd: 42,
        moves: ['tackle', 'water_gun'], nextEvo: 'water_2', evoLevel: 12
    },
    water_2: {
        id: 'water_2', name: 'アクアラビ', element: 'water', stage: 'child',
        baseHp: 68, baseAtk: 65, baseDef: 78, baseSpd: 62,
        moves: ['tackle', 'water_gun', 'bubble_beam'], nextEvo: 'water_3', evoLevel: 28
    },
    water_3: {
        id: 'water_3', name: 'オーシャンラビ', element: 'water', stage: 'adult',
        baseHp: 90, baseAtk: 88, baseDef: 105, baseSpd: 82,
        moves: ['tackle', 'bubble_beam', 'hydro_pump'], nextEvo: null
    },

    // --- STARTER 3: GRASS LINE ---
    grass_1: {
        id: 'grass_1', name: 'ポコリーフ', element: 'grass', stage: 'baby',
        baseHp: 45, baseAtk: 48, baseDef: 48, baseSpd: 55,
        moves: ['tackle', 'vine_whip'], nextEvo: 'grass_2', evoLevel: 12
    },
    grass_2: {
        id: 'grass_2', name: 'リスリーフ', element: 'grass', stage: 'child',
        baseHp: 65, baseAtk: 70, baseDef: 68, baseSpd: 75,
        moves: ['tackle', 'vine_whip', 'razor_leaf'], nextEvo: 'grass_3', evoLevel: 28
    },
    grass_3: {
        id: 'grass_3', name: 'フォレストリス', element: 'grass', stage: 'adult',
        baseHp: 85, baseAtk: 92, baseDef: 90, baseSpd: 98,
        moves: ['tackle', 'razor_leaf', 'solar_beam'], nextEvo: null
    },

    // --- WILD ROUTE 1 MONSTERS ---
    wild_bird: {
        id: 'wild_bird', name: 'ポッポトリ', element: 'normal', stage: 'baby',
        baseHp: 38, baseAtk: 40, baseDef: 35, baseSpd: 52,
        moves: ['tackle', 'scratch'], nextEvo: null
    },
    wild_bug: {
        id: 'wild_bug', name: 'キャタムシ', element: 'grass', stage: 'baby',
        baseHp: 40, baseAtk: 35, baseDef: 45, baseSpd: 30,
        moves: ['tackle', 'vine_whip'], nextEvo: null
    },

    // --- GYM LEADER 1 BOSS ---
    gym_leader_1: {
        id: 'gym_leader_1', name: 'イワザル', element: 'normal', stage: 'child',
        baseHp: 75, baseAtk: 72, baseDef: 85, baseSpd: 50,
        moves: ['tackle', 'scratch'], nextEvo: null
    }
};

function renderMonsterSVG(id, options = {}) {
    const emotion = options.emotion || 'happy';
    const monster = MONSTERS_DATABASE[id] || MONSTERS_DATABASE.fire_1;
    const elem = ELEMENT_TYPES[monster.element] || ELEMENT_TYPES.normal;

    const drawP = (rects) => rects.map(([x, y, w, h, c]) => 
        `<rect x="${x}" y="${y}" width="${w || 1}" height="${h || 1}" fill="${c}" />`
    ).join('');

    let mainColor = elem.color;
    let accentColor = '#ffffff';
    let earInnerColor = '#ffcc00';
    let borderColor = '#20162b';

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

    const blush = drawP([
        [7,16,3,2, 'rgba(255, 120, 160, 0.85)'],
        [22,16,3,2, 'rgba(255, 120, 160, 0.85)']
    ]);

    let eyePixels = drawP([
        [10,12,3,4, '#20162b'], [10,12,1,2, '#ffffff'], [12,14,1,1, '#ffffff'],
        [19,12,3,4, '#20162b'], [19,12,1,2, '#ffffff'], [21,14,1,1, '#ffffff']
    ]);

    let mouthPixels = drawP([[14,17,4,2, '#ff4477'], [15,17,2,1, '#ffffff']]);

    if (emotion === 'sleep') {
        eyePixels = drawP([[10,14,4,1, '#20162b'], [18,14,4,1, '#20162b']]);
        mouthPixels = drawP([[15,16,2,2, '#ff6688']]);
    }

    let bodyArt = `
        ${drawP([
            [5,3,5,1, borderColor], [4,4,2,4, borderColor], [9,4,2,4, borderColor],
            [5,4,4,4, mainColor], [6,5,2,3, earInnerColor],
            [22,3,5,1, borderColor], [21,4,2,4, borderColor], [26,4,2,4, borderColor],
            [22,4,4,4, mainColor], [23,5,2,3, earInnerColor]
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

    return `
    <svg viewBox="0 0 32 32" width="100%" height="100%" class="monster-svg">
        <g class="monster-body">
            ${bodyArt}
            <g class="face">
                ${eyePixels}
                <rect x="15" y="15" width="2" height="1" fill="#20162b" />
                ${mouthPixels}
                ${blush}
            </g>
        </g>
    </svg>`;
}
