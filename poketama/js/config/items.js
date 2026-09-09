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

    // --- EGG WARMING & CARE TOOLS ---
    egg_blanket: {
        id: 'egg_blanket',
        name: 'ぽかぽか毛布',
        type: 'egg_tool',
        warmthAdd: 25,
        icon: '🧺',
        description: '温かい毛布でタマゴを包む。温もり度 +25'
    },
    egg_lamp: {
        id: 'egg_lamp',
        name: '温熱育成ランプ',
        type: 'egg_tool',
        warmthAdd: 50,
        icon: '💡',
        description: '特殊な育成光線でタマゴの孵化を促す。温もり度 +50'
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
