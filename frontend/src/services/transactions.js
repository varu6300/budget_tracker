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
