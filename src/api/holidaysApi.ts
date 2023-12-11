import axios from 'axios';

export const holidaysApi = axios.create({
  baseURL: 'https://date.nager.at/api/v3',
});