/**
 * PokéTama Items Configuration
 */

const ITEMS_DATABASE = {
    // --- FOOD / FOOD ITEMS ---
    berry_red: {
        id: 'berry_red',
        name: 'ヒコブーの果実',
        type: 'food',
        hungerRestore: 30,
        friendshipGain: 5,
        icon: '🍎',
        description: '甘くてシャキシャキした赤い木の実。おなかをしっかり満たす。'
    },
    berry_blue: {
        id: 'berry_blue',
        name: 'オルカのみ',
        type: 'food',
        hungerRestore: 25,
        friendshipGain: 8,
        icon: '🫐',
        description: 'みずみずしくて美味しい果実。水分補給となつき度に優れる。'
    },
    berry_golden: {
        id: 'berry_golden',
        name: '黄金のスターベリー',
        type: 'food',
        hungerRestore: 50,
        friendshipGain: 20,
        icon: '⭐',
        description: 'めったに手に入らない黄金の木の実。おなかとなつき度を大回復！'
    },
    meat_roast: {
        id: 'meat_roast',
        name: '特製骨付き肉',
        type: 'food',
        hungerRestore: 75,
        friendshipGain: 12,
        icon: '🍖',
        description: 'スタミナ満点のご馳走肉。おなかを一気にいっぱいに。'
    },

    // --- INCUBATORS (孵化器) ---
    incubator_standard: {
        id: 'incubator_standard',
        name: '孵化器',
        type: 'incubator',
        timeSeconds: 1800,
        icon: '🥚',
        description: 'タマゴを自動であたためて孵化させる標準的な装置。（孵化時間：30分）'
    },
    incubator_super: {
        id: 'incubator_super',
        name: 'スーパー孵化器',
        type: 'incubator',
        timeSeconds: 600,
        icon: '🪺',
        description: '特殊な温熱波でタマゴを素早くあたためる進化した孵化器。（孵化時間：10分）'
    },
    incubator_hyper: {
        id: 'incubator_hyper',
        name: 'ハイパー孵化器',
        type: 'incubator',
        timeSeconds: 60,
        icon: '⚡',
        description: '超強力の量子温熱波により一瞬で孵化を促す最高峰の孵化器。（孵化時間：1分）'
    },

    // --- RECOVERY & MEDICINE ---
    potion_small: {
        id: 'potion_small',
        name: 'キズぐすり',
        type: 'medicine',
        hpRestore: 60,
        icon: '🧪',
        description: 'バトルの傷を癒やす基本の飲み薬。HPを60回復。'
    },
    potion_hyper: {
        id: 'potion_hyper',
        name: 'すごいキズぐすり',
        type: 'medicine',
        hpRestore: 180,
        icon: '🍾',
        description: '傷を一気に完治させる強力な薬。HPを180回復。'
    },
    energy_drink: {
        id: 'energy_drink',
        name: 'げんきスプレー',
        type: 'medicine',
        energyRestore: 50,
        icon: '⚡',
        description: 'モンスターの疲労を吹き飛ばす特効スプレー。'
    }
};
