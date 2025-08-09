const initialState = {
    favoriteProducts: JSON.parse(localStorage.getItem('favorites')) || []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_FAVORITE':
            // Tránh thêm trùng
            if (state.favoriteProducts.some(p => p.id === action.payload.id)) {
                return state;
            }
            const updatedFavorites = [...state.favoriteProducts, action.payload];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return {
                ...state,
                favoriteProducts: updatedFavorites
            };

        case 'REMOVE_FAVORITE':
            const filteredFavorites = state.favoriteProducts.filter(p => p.id !== action.payload.id);
            localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
            return {
                ...state,
                favoriteProducts: filteredFavorites
            };

        default:
            return state;
    }
};

export default productReducer;
