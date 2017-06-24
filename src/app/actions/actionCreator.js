// All the sysnchronous action creators for Instaurant
import actionTypes from './actionTypes';

export const receiveCategories = categories => (
    {
        type: actionTypes.RECEIVE_CATEGORY,
        categories,
    }
);

export const fetchingCategories = () => ({ type: actionTypes.FETCHING_CATEGORY });

export const addCategory = category => (
    {
        type: actionTypes.ADD_CATEGORY,
        category,
    }
);

export const selectedCategory = selectedCategoryId => (
    {
        type: actionTypes.SELECT_CATEGORY,
        selectedCategoryId,
    }
);

export const updateCategory = category => (
    {
        type: actionTypes.UPDATE_CATEGORY,
        category,
    }
);

export const deleteCategory = (categoriesWithUpdatedOrder, deletedCategoryId) => (
    {
        type: actionTypes.DELETE_CATEGORY,
        data: {
            categoriesWithUpdatedOrder,
            deletedCategoryId,
        },
    }
);
