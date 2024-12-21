export interface ArsenalBuylistItemPrice {
    amount: number,
    currency: string
}

export interface ArsenalBuylistItemSerialized {
    id: string,
    itemId: string,
    buylistId: string,
    owned: boolean,
    store: string,
    price: ArsenalBuylistItemPrice,
    store_updated: string,
    price_updated: string
}

export class ArsenalBuylistItem {
    
}