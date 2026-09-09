/**
 * PokéTama Battle Moves & Elemental Effectiveness Matrix
 */

const MOVES_DATABASE = {
    // --- NORMAL / STARTER MOVES ---
    tackle: {
        id: 'tackle',
        name: 'たい当たり',
        type: 'normal',
        power: 35,
        accuracy: 95,
        spCost: 0,
        description: '体全体でぶつかって攻撃する基本技。',
        fx: 'physical_hit'
    },
    water_drop: {
        id: 'water_drop',
        name: 'みずでっぽう',
        type: 'water',
        power: 40,
        accuracy: 100,
        spCost: 5,
        description: '冷たい水滴を勢いよく射出する。',
        fx: 'water_splash'
    },
    ember: {
        id: 'ember',
        name: 'ひのこ',
        type: 'fire',
        power: 40,
        accuracy: 100,
        spCost: 5,
        description: '小さな火の粉を飛ばして攻撃する。',
        fx: 'fire_spark'
    },
    leaf_shot: {
        id: 'leaf_shot',
        name: 'はっぱカッター',
        type: 'grass',
        power: 40,
        accuracy: 100,
        spCost: 5,
        description: '鋭い葉っぱを連射して切り裂く。',
        fx: 'leaf_slice'
    },
    spark: {
        id: 'spark',
        name: 'スパーク',
        type: 'cyber',
        power: 42,
        accuracy: 95,
        spCost: 5,
        description: 'パチパチとはじける静電気を叩きつける。',
        fx: 'cyber_bolt'
    },

    // --- INTERMEDIATE MOVES ---
    flame_charge: {
        id: 'flame_charge',
        name: 'ニトロチャージ',
        type: 'fire',
        power: 60,
        accuracy: 90,
        spCost: 12,
        description: '炎を纏って突進。自分のすばやさを高める。',
        fx: 'fire_spark'
    },
    fire_breath: {
        id: 'fire_breath',
        name: 'かえんほうしゃ',
        type: 'fire',
        power: 75,
        accuracy: 90,
        spCost: 18,
        description: '激しい灼熱の炎を相手に吹き付ける。',
        fx: 'fire_spark'
    },
    bubble_beam: {
        id: 'bubble_beam',
        name: 'バブルビーム',
        type: 'water',
        power: 60,
        accuracy: 95,
        spCost: 12,
        description: '大量の泡を勢いよく連続発射する。',
        fx: 'water_splash'
    },
    aqua_tail: {
        id: 'aqua_tail',
        name: 'アクアテール',
        type: 'water',
        power: 75,
        accuracy: 90,
        spCost: 18,
        description: '水を纏った大きなシッポで強烈に叩く。',
        fx: 'water_splash'
    },
    vine_whip: {
        id: 'vine_whip',
        name: 'つるのムチ',
        type: 'grass',
        power: 60,
        accuracy: 95,
        spCost: 12,
        description: 'しなやかなツルで鞭打つように攻撃する。',
        fx: 'leaf_slice'
    },
    leaf_blade: {
        id: 'leaf_blade',
        name: 'リーフブレード',
        type: 'grass',
        power: 75,
        accuracy: 90,
        spCost: 18,
        description: '剣のように鋭い葉で一閃する。',
        fx: 'leaf_slice'
    },
    thunder_bolt: {
        id: 'thunder_bolt',
        name: '10まんボルト',
        type: 'cyber',
        power: 65,
        accuracy: 95,
        spCost: 14,
        description: '強い電撃を叩きつけて麻痺させることがある。',
        fx: 'cyber_bolt'
    },
    laser_claw: {
        id: 'laser_claw',
        name: 'サイバークロウ',
        type: 'cyber',
        power: 78,
        accuracy: 90,
        spCost: 18,
        description: '光線で強化された爪で敵を一刺し。',
        fx: 'cyber_bolt'
    },

    // --- HIGH-END / ULTIMATE MOVES ---
    fire_claw: {
        id: 'fire_claw',
        name: '爆炎爪',
        type: 'fire',
        power: 95,
        accuracy: 85,
        spCost: 24,
        description: '燃え盛る爪で相手を裂き、大ダメージを与える。',
        fx: 'fire_spark'
    },
    lava_surge: {
        id: 'lava_surge',
        name: 'マグマサージ',
        type: 'fire',
        power: 110,
        accuracy: 80,
        spCost: 30,
        description: '地表からマグマの噴柱を呼び起こす大技。',
        fx: 'fire_spark'
    },
    overheat: {
        id: 'overheat',
        name: 'オーバーヒート',
        type: 'fire',
        power: 130,
        accuracy: 85,
        spCost: 40,
        description: '出せる限りの限界火力を叩き出す必殺技。',
        fx: 'fire_spark'
    },
    giga_flare: {
        id: 'giga_flare',
        name: 'ギガフレア・ブレイズ',
        type: 'fire',
        power: 160,
        accuracy: 75,
        spCost: 55,
        description: '究極体のみが放てる伝説の超爆炎波。',
        fx: 'fire_spark'
    },

    surf_wave: {
        id: 'surf_wave',
        name: 'なみのり',
        type: 'water',
        power: 90,
        accuracy: 90,
        spCost: 22,
        description: '巨大な波を起こして敵を飲み込む。',
        fx: 'water_splash'
    },
    hydro_pump: {
        id: 'hydro_pump',
        name: 'ハイドロポンプ',
        type: 'water',
        power: 120,
        accuracy: 80,
        spCost: 35,
        description: '超高圧の水流を発射して全てを押し流す。',
        fx: 'water_splash'
    },
    ocean_cataclysm: {
        id: 'ocean_cataclysm',
        name: '大海の大渦カタクリズム',
        type: 'water',
        power: 155,
        accuracy: 80,
        spCost: 50,
        description: '深海の大渦を発生させて全てを水没させる。',
        fx: 'water_splash'
    },

    petal_storm: {
        id: 'petal_storm',
        name: 'はなふぶき',
        type: 'grass',
        power: 90,
        accuracy: 90,
        spCost: 22,
        description: '無数の鋭い花びらの渦で包み込む。',
        fx: 'leaf_slice'
    },
    solar_beam: {
        id: 'solar_beam',
        name: 'ソーラービーム',
        type: 'grass',
        power: 125,
        accuracy: 85,
        spCost: 35,
        description: '光エネルギーを集束して一気に放射する。',
        fx: 'leaf_slice'
    },
    world_tree_blessing: {
        id: 'world_tree_blessing',
        name: '世界樹の裁き',
        type: 'grass',
        power: 150,
        accuracy: 80,
        spCost: 50,
        description: '大自然の怒りを光の柱として降らせる。',
        fx: 'leaf_slice'
    },

    discharge: {
        id: 'discharge',
        name: 'プラズマ放電',
        type: 'cyber',
        power: 92,
        accuracy: 90,
        spCost: 22,
        description: '高圧プラズマを全方位に放散する。',
        fx: 'cyber_bolt'
    },
    giga_volt: {
        id: 'giga_volt',
        name: 'ギガボルトブレイク',
        type: 'cyber',
        power: 130,
        accuracy: 85,
        spCost: 38,
        description: '落雷のような超高電圧を直撃させる。',
        fx: 'cyber_bolt'
    },
    cyber_overclock: {
        id: 'cyber_overclock',
        name: 'クロノス・オーバークロック',
        type: 'cyber',
        power: 160,
        accuracy: 75,
        spCost: 55,
        description: '限界突破の演算速度で放つ究極の電磁爆発。',
        fx: 'cyber_bolt'
    }
};

/**
 * Calculate Elemental Damage Multiplier
 */
function getTypeMultiplier(moveType, targetElement) {
    if (moveType === 'normal') return 1.0;
    
    const matrix = {
        fire: { grass: 2.0, water: 0.5, fire: 0.5, cyber: 1.0 },
        water: { fire: 2.0, grass: 0.5, water: 0.5, cyber: 1.5 },
        grass: { water: 2.0, fire: 0.5, grass: 0.5, cyber: 0.5 },
        cyber: { water: 1.5, grass: 1.5, fire: 1.0, cyber: 0.5 }
    };

    if (matrix[moveType] && matrix[moveType][targetElement]) {
        return matrix[moveType][targetElement];
    }
    return 1.0;
}

/**
 * Calculate Battle Damage Formula
 */
function calculateBattleDamage(attacker, defender, move, friendshipBonus = 0) {
    const moveData = MOVES_DATABASE[move.id || move] || MOVES_DATABASE.tackle;
    
    // Base damage formula
    const atk = attacker.atk || 20;
    const def = defender.def || 15;
    const power = moveData.power;

    const typeMult = getTypeMultiplier(moveData.type, defender.element);
    
    // Friendship Bonus (0% to 20% extra damage)
    const friendshipMult = 1.0 + (friendshipBonus / 500);

    // Random variance 0.9 to 1.1
    const randomMult = 0.9 + Math.random() * 0.2;

    // Critical Hit chance (higher if friendship high)
    const isCrit = Math.random() < (0.08 + (friendshipBonus / 1000));
    const critMult = isCrit ? 1.5 : 1.0;

    // Balanced damage formula (3-6 turns per battle)
    let damage = Math.floor(((atk * 0.55 * power) / (def * 0.95) + 4) * typeMult * friendshipMult * randomMult * critMult);
    damage = Math.max(3, damage);

    return {
        damage,
        typeMult,
        isCrit,
        moveName: moveData.name,
        moveType: moveData.type,
        fx: moveData.fx
    };
}
