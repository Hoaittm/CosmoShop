import 'react-toastify/dist/ReactToastify.css';

const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];

const initCart = {
    carts: storedCart,
    amountItem: storedCart.length,
    totalAmount: storedCart.reduce((total, item) => total + item.price * item.quantity, 0)
};
const cartReducer = (state = initCart, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.carts.findIndex(item =>
                item.id === action.payload.id
            );

            let updatedCarts;
            if (existingItemIndex !== -1) {
                // Update existing item
                updatedCarts = state.carts.map((item, index) =>
                    index === existingItemIndex ? {
                        ...item, quantity: item.quantity + action.payload.amount
                    } : item
                );
            } else {
                const newItem = {
                    ...action.payload,
                    quantity: action.payload.amount,
                };
                updatedCarts = [...state.carts, newItem];
                localStorage.setItem('cartItems', JSON.stringify(updatedCarts));
            }

            // Calculate total amount
            const totalAmount = updatedCarts.reduce((total, item) => total + item.price * item.quantity, 0);
            return {
                ...state,
                carts: updatedCarts,
                amountItem: updatedCarts.length, // Update the number of items in cart
                totalAmount // Set the total amount
            };

        case 'TOTAL_CART':
            console.log("Cart items:", state.carts);
            let total = 0;
            state.carts.map((item) => {
                total += item.price * item.quantity;
            });
            return {
                ...state,
                totalAmount: total,
            }

        case 'REMOVE_ITEM':
            // toast.warning(`Xóa ${action.payload.product_name} khỏi giỏ hàng`, {
            //     position: "top-right",
            //     autoClose: 2000
            // });
            const filteredCart = state.carts.filter(item =>
                !(item.product_id === action.payload.product_id)
            );
            localStorage.setItem('cartItems', JSON.stringify(filteredCart));

            return {
                ...state,
                carts: filteredCart
            };
        case 'CLEAR_CART':
            return {
                ...state,
                carts: [],
                totalAmount: 0
            }
        case "UPDATE_QUANTITY":
            console.log("Reducer received UPDATE_QUANTITY:", action.payload);
            return {
                ...state,
                carts: state.carts.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        default:
            return state;
    }
}
export default cartReducer;