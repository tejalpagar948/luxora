import api from "./api";

export const getProducts = () => {
    return api.get("/products");
}

export const createProduct = (productData) => {
    return api.post("/products/create", productData)
}

export const getProductById = (id) => {
    return api.get(`/products/edit/${id}`)
}

export const updateProduct = (id, productData) => {
    return api.put(`/products/edit/${id}`, productData)
}

export const deleteProduct = (id) => {
    return api.delete(`/products/delete/${id}`)
}

export const getSingleProduct = (id) => {
    return api.get(`/products/${id}`)
}