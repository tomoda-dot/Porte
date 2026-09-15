/**
 * PokéTama Shop & Trading System Module (木もれびショップ・駄菓子屋)
 */

const SHOP_CATALOG = {
    food: [
        { id: 'berry_red', buyPrice: 20, sellPrice: 10 },
        { id: 'berry_blue', buyPrice: 30, sellPrice: 15 },
        { id: 'meat_roast', buyPrice: 60, sellPrice: 30 },
        { id: 'berry_golden', buyPrice: 120, sellPrice: 60 }
    ],
    medicine: [
        { id: 'potion_small', buyPrice: 50, sellPrice: 25 },
        { id: 'potion_hyper', buyPrice: 150, sellPrice: 75 },
        { id: 'energy_drink', buyPrice: 40, sellPrice: 20 }
    ],
    incubators: [
        { id: 'incubator_standard', buyPrice: 500, sellPrice: 250 },
        { id: 'incubator_super', buyPrice: 750, sellPrice: 375 },
        { id: 'incubator_hyper', buyPrice: 12000, sellPrice: 6000 }
    ],
    eggs: [
        { id: 'egg_fire', buyPrice: 200 },
        { id: 'egg_water', buyPrice: 200 },
        { id: 'egg_grass', buyPrice: 200 },
        { id: 'egg_cyber', buyPrice: 350 }
    ]
};

const ShopModule = {
    buyItem(itemId) {
        let itemDef = null;
        for (const cat in SHOP_CATALOG) {
            const found = SHOP_CATALOG[cat].find(i => i.id === itemId);
            if (found) { itemDef = found; break; }
        }

        if (!itemDef) return { success: false, message: '無効な商品です。' };

        if (gameEngine.gold < itemDef.buyPrice) {
            return { success: false, message: `所持金(G)が足りません！（必要: ${itemDef.buyPrice} G）` };
        }

        const itemData = ITEMS_DATABASE[itemId];
        if (!itemData) return { success: false, message: '商品データが見つかりません。' };

        gameEngine.gold -= itemDef.buyPrice;
        gameEngine.inventory[itemId] = (gameEngine.inventory[itemId] || 0) + 1;

        audioFX.playFeed();
        return {
            success: true,
            message: `🛒 「${itemData.name}」 を ${itemDef.buyPrice} G で購入しました！`
        };
    },

    buyEgg(eggId) {
        const eggDef = SHOP_CATALOG.eggs.find(e => e.id === eggId);
        if (!eggDef) return { success: false, message: '無効なタマゴです。' };

        if (gameEngine.gold < eggDef.buyPrice) {
            return { success: false, message: `所持金(G)が足りません！（必要: ${eggDef.buyPrice} G）` };
        }

        if (gameEngine.incubator.length >= 3) {
            return { success: false, message: '孵化器がいっぱいです（最大3個まで）。まず既存のタマゴを孵化させてください！' };
        }

        gameEngine.gold -= eggDef.buyPrice;
        const addRes = IncubatorModule.addNewEggToIncubator(eggId);

        if (addRes.success) {
            audioFX.playFeed();
            return {
                success: true,
                message: `🥚 「${EGGS_DATABASE[eggId].name}」 を ${eggDef.buyPrice} G で購入！孵化室に追加されました！`
            };
        } else {
            gameEngine.gold += eggDef.buyPrice; // refund
            return addRes;
        }
    },

    sellItem(itemId) {
        if (!gameEngine.inventory[itemId] || gameEngine.inventory[itemId] <= 0) {
            return { success: false, message: '所持していません。' };
        }

        let itemDef = null;
        for (const cat in SHOP_CATALOG) {
            const found = SHOP_CATALOG[cat].find(i => i.id === itemId);
            if (found) { itemDef = found; break; }
        }

        const itemData = ITEMS_DATABASE[itemId];
        const sellPrice = itemDef && itemDef.sellPrice ? itemDef.sellPrice : 10;

        gameEngine.inventory[itemId]--;
        gameEngine.gold += sellPrice;

        audioFX.playClick();
        return {
            success: true,
            message: `💰 「${itemData ? itemData.name : itemId}」 を売却し ${sellPrice} G 獲得！`
        };
    }
};
