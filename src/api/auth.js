import { request } from './http';

export const loginUser = (username, password) =>
  request('/api/auth/user/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });

export const registerUser = ({ username, password, fullName, phoneNumber, salaryAmount }) =>
  request('/api/auth/register', {
    method: 'POST',
    body: { username, password, fullName, phoneNumber, salaryAmount },
    auth: false,
  });

export const getMe = () => request('/api/users/me');
