import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/signup', data);
export const getTodos = () => API.get('/todos');
export const createTodo = (todo) => API.post('/todos', todo);
export const updateTodo = (id, todo) => API.put(`/todos/${id}`, todo);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
