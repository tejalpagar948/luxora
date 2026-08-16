import api from "./api"

export const addToCart = ({ id, quantity }) => {
    return api.post(`/cart/${id}`, { quantity })
}

export const getCart = () => {
    return api.get(`/cart`)
}

export const deleteFromCart = (id) => {
    return api.delete(`/cart/${id}`)
}

export const updateCart = (id, quantity) => {
    return api.put(`/cart/${id}`, { quantity })
}

export const deleteManyFromCart = (ids) => {
    return api.post(`/cart/delete-many`, { ids })
}

export const checkoutCart = ({ items, totalAmount, paymentMethod }) => {
    return api.post(`/cart/checkout`, { items, totalAmount, paymentMethod })
}