
export const ADD = (item) => ({
    type: 'ADD_TO_CART',
    payload: item
});

export const TOTAL_CART = () => ({
    type: 'TOTAL_CART',
    payload: ''
});

export const REMOVE_ITEM = (product) => ({
    type: 'REMOVE_ITEM',
    payload: {
        id: product.id,
    }
});

export const CLEAR = () => ({
    type: 'CLEAR_CART',
    payload: ''
});

export const UPDATE_QUANTITY = (id, quantity) => ({
    type: "UPDATE_QUANTITY",
    payload: {
        id,
        quantity
    }
});