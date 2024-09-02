import axios from 'axios';

const API = axios.create({
    baseURL: 'https://collection-management-backend.onrender.com/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    }
});
const APIformdata = axios.create({
    baseURL: 'https://collection-management-backend.onrender.com/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
    }
});


export const register = (data) => API.post('/auth/register', data);
export const logIn = (data) => API.post('/auth/login', data);
export const userAuth = () => API.get('/userAuth');

export const createCollection = (userId, formData) => APIformdata.post(`/collection/create-collection/${userId}`, formData);
export const updateCollection = (data, id) => APIformdata.put(`/collection/update-collection/${id}`, data);
export const getCollection = (id) => API.get(`/collection/get-collection/${id}`);
export const getAllCollections = (page, limit) => API.get(`/collection/get-all-collection?page=${page}&limit=${limit}`);
export const getUserCollections = (page, limit, userId) => API.get(`/collection/get-user-collection/${userId}?page=${page}&limit=${limit}`);
export const getLargestCollections = (limit) => API.get(`/collection/get-all-collection?limit=${limit}`);
export const getCategoryCollections = (category, page, limit) => API.get(`/collection/get-category-collection/${category}`, { params: { page, limit } });
export const deleteCollection = (id) => API.delete(`/collection/delete-collection/${id}`);

export const createItem = (data) => API.post(`/item/create-item`, data);
export const updateItem = (id, data) => API.put(`/item/update-item/${id}`, data);
export const getItem = (id) => API.get(`/item/get-item/${id}`);
export const getAllItems = (page, limit) => API.get(`/item/get-all-item?page=${page}&limit=${limit}`);
export const getLatestItems = () => API.get('/item/get-latest-item');
export const getTagItems = (tag, page, limit) => API.get(`/item/get-tag-item/${tag}`, { params: { page, limit } });
export const getCollectionItems = (page, limit, collectionId) => API.get(`/item/get-collection-item/${collectionId}?page=${page}&limit=${limit}`);
export const deleteItem = (id) => API.delete(`/item/delete-item/${id}`);

export const getUser = (id) => API.get(`/user/get-user/${id}`);

export const toggleLike = (itemId) => API.post(`/like/toggle-like/${itemId}`);

export const getItemComment = (itemId) => API.get(`/comment/get-item-comment/${itemId}`);
export const addComment = (text, itemId) => API.post(`/comment/add-comment/${itemId}`, { text });
export const deleteComment = (id) => API.delete(`/comment/remove-comment/${id}`);
export const editComment = (id, text) => API.put(`/comment/update-comment/${id}`, text);

export const searchAll = (query) => API.get(`/search`, { params: { query } });
export const searchTag = (query) => API.get(`/tag/search-tag`, { params: { query } });
export const searchUser = (query) => API.get(`/user/search-user`, { params: { query } });


export const getAdmins = () => API.get(`/admin/get-admin`);
export const promoteToAdmin = (userId) => API.put(`/admin/promote/${userId}`);
export const demoteToUser = (userId) => API.put(`/admin/demote/${userId}`);
export const adminBlock = (userId) => API.put(`/admin/block/${userId}`);
export const adminUnblock = (userId) => API.put(`/admin/unblock/${userId}`);


export const salesforceAuthUrl = () => API.get(`/salesforce/auth-url`);
export const salesforceRegister = (data) => API.post('/salesforce/register', data);
export const getToken = ({code}) => API.post('/salesforce/token', code);
