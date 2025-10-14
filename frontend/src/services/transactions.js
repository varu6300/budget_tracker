import { api } from './api.js';

export async function fetchTransactions(){
  const { data } = await api.get('/api/transactions');
  return data;
}

export async function createTransaction(payload){
  const { data } = await api.post('/api/transactions', payload);
  return data;
}

export async function resetTransactions(){
  const { data } = await api.post('/api/transactions/reset');
  return data;
}

export async function getTransactionHistory({ page=0, size=10, type, category } = {}){
  const params = new URLSearchParams();
  if(page != null) params.set('page', String(page));
  if(size != null) params.set('size', String(size));
  if(type) params.set('type', type);
  if(category) params.set('category', category);
  const { data } = await api.get(`/api/transactions/history?${params.toString()}`);
  return data; // Spring Page<TransactionResponse>
}

export async function getCategories(){
  const { data } = await api.get('/api/transactions/categories');
  return data; // string[]
}

export async function updateTransaction(id, payload){
  const { data } = await api.put(`/api/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id){
  await api.delete(`/api/transactions/${id}`);
}
