import {v4 as uuid} from 'uuid';

export interface Basket {
        id: string;
        items: BasketItem[];
}

export interface BasketItem {
        id: number;
        productName: string;
        price: number;
        quantity: number;
        pictureUrl: string;
        brand: string;
        type: string;
}

export class BasketUnique implements Basket{
    id = uuid();
    items: BasketItem[] = [];
}

export interface BasketTotals{
        shipping: number;
        subtotal: number;
        total: number;
}