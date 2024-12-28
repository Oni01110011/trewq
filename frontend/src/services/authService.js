import axios from 'axios'

const TOKEN_KEY = 'auth_token'
const USERNAME_KEY = 'auth_username'

export async function login(username, password) {
  const { data } = await axios.post('/api/login', { username, password })
  if (data && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USERNAME_KEY, data.username || username)
  }
  return data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}
