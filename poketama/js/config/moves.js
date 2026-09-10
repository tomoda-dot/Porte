/**
 * moves.js
 * PokéTama Battle Moves & 18 Elemental Effectiveness Matrix Engine
 */

const MOVES_DATABASE = {
    tackle: { id: 'tackle', name: 'たい当たり', type: 'normal', power: 35, accuracy: 95, maxPp: 30, description: '体全体でぶつかる基本技。', fx: 'physical_hit' },
    hyper_beam: { id: 'hyper_beam', name: '破壊光線', type: 'normal', power: 120, accuracy: 85, maxPp: 5, description: '全エネルギーを一気に照射する大技。', fx: 'cyber_bolt' },
    
    // 18 Element Type Signature Moves
    move_normal:   { id: 'move_normal',   name: 'スピードスター', type: 'normal',   power: 45, accuracy: 100, maxPp: 20, description: '星型の光を放つ。', fx: 'physical_hit' },
    move_fire:     { id: 'move_fire',     name: 'かえんほうしゃ', type: 'fire',     power: 60, accuracy: 95,  maxPp: 15, description: '激しい炎を吹き付ける。', fx: 'fire_spark' },
    move_water:    { id: 'move_water',    name: 'ハイドロポンプ', type: 'water',    power: 60, accuracy: 95,  maxPp: 15, description: '高圧水流を発射する。', fx: 'water_splash' },
    move_electric: { id: 'move_electric', name: '10まんボルト',  type: 'electric', power: 60, accuracy: 95,  maxPp: 15, description: '強烈な電撃を放つ。', fx: 'cyber_bolt' },
    move_grass:    { id: 'move_grass',    name: 'ソーラービーム', type: 'grass',    power: 60, accuracy: 95,  maxPp: 15, description: '光エネルギーを照射。', fx: 'leaf_slice' },
    move_ice:      { id: 'move_ice',      name: 'れいとうビーム', type: 'ice',      power: 60, accuracy: 95,  maxPp: 15, description: '冷気を放ち凍らせる。', fx: 'water_splash' },
    move_fighting: { id: 'move_fighting', name: 'インファイト',   type: 'fighting', power: 65, accuracy: 90,  maxPp: 15, description: '連続パンチを叩き込む。', fx: 'physical_hit' },
    move_poison:   { id: 'move_poison',   name: 'ヘドロばくだん', type: 'poison',   power: 60, accuracy: 95,  maxPp: 15, description: '毒の爆弾を投げつける。', fx: 'leaf_slice' },
    move_ground:   { id: 'move_ground',   name: 'じしん',         type: 'ground',   power: 65, accuracy: 95,  maxPp: 15, description: '激しい揺れで攻撃。', fx: 'physical_hit' },
    move_flying:   { id: 'move_flying',   name: 'エアスラッシュ', type: 'flying',   power: 60, accuracy: 95,  maxPp: 15, description: '空気の刃で切り裂く。', fx: 'leaf_slice' },
    move_psychic:  { id: 'move_psychic',  name: 'サイコキネシス', type: 'psychic',  power: 60, accuracy: 95,  maxPp: 15, description: '念力で念波を送る。', fx: 'cyber_bolt' },
    move_bug:      { id: 'move_bug',      name: 'シザークロス',   type: 'bug',      power: 60, accuracy: 95,  maxPp: 15, description: '鎌を交差させて切る。', fx: 'leaf_slice' },
    move_rock:     { id: 'move_rock',     name: 'いわなだれ',     type: 'rock',     power: 60, accuracy: 90,  maxPp: 15, description: '大岩を落として攻撃。', fx: 'physical_hit' },
    move_ghost:    { id: 'move_ghost',    name: 'シャドーボール', type: 'ghost',    power: 60, accuracy: 95,  maxPp: 15, description: '黒い影の塊を放つ。', fx: 'cyber_bolt' },
    move_dragon:   { id: 'move_dragon',   name: 'りゅうのいぶき', type: 'dragon',   power: 65, accuracy: 95,  maxPp: 15, description: '竜の息吹を噴射する。', fx: 'fire_spark' },
    move_dark:     { id: 'move_dark',     name: 'あくのはどう',   type: 'dark',     power: 60, accuracy: 95,  maxPp: 15, description: '悪意のオーラを放つ。', fx: 'cyber_bolt' },
    move_steel:    { id: 'move_steel',    name: 'ラスターカノン', type: 'steel',    power: 60, accuracy: 95,  maxPp: 15, description: '鋼の光波を発射する。', fx: 'cyber_bolt' },
    move_fairy:    { id: 'move_fairy',    name: 'ムーンフォース', type: 'fairy',    power: 60, accuracy: 95,  maxPp: 15, description: '月の力で光を放つ。', fx: 'cyber_bolt' }
};

/**
 * Calculate Battle Damage Formula
 */
function calculateBattleDamage(attacker, defender, move) {
    const moveId = typeof move === 'string' ? move : (move.id || move);
    const moveData = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;
    
    const atk = attacker.atk || 20;
    const def = defender.def || 15;
    const power = moveData.power;

    const typeMult = typeof window.getTypeMultiplier === 'function' 
        ? window.getTypeMultiplier(moveData.type, defender.element) 
        : 1.0;
    
    const friendshipVal = attacker.friendship !== undefined ? attacker.friendship : 50;
    const hungerVal = attacker.hunger !== undefined ? attacker.hunger : 50;

    const friendshipMult = 1.0 + (friendshipVal / 500);
    const randomMult = 0.95 + Math.random() * 0.2;

    let critChance = 0.08;
    if (friendshipVal >= 70) critChance += 0.15;
    if (hungerVal >= 70) critChance += 0.15;

    const isCrit = Math.random() < Math.min(0.80, critChance);
    const critMult = isCrit ? 1.6 : 1.0;

    let damage = Math.floor(((atk * 0.65 * power) / (def * 0.9) + 6) * typeMult * friendshipMult * randomMult * critMult);
    damage = Math.max(5, damage);

    return {
        damage,
        typeMult,
        isCrit,
        moveName: moveData.name,
        moveType: moveData.type,
        fx: moveData.fx || 'physical_hit'
    };
}

window.MOVES_DATABASE = MOVES_DATABASE;
window.calculateBattleDamage = calculateBattleDamage;
