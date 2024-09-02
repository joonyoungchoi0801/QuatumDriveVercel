import axios from 'axios';

import { BASE_URL } from '@/constants/API';

const logininstance = axios.create({
  baseURL: BASE_URL,
});

export default logininstance;
