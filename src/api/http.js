const BASE = 'https://qi-salfa.onrender.com';

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    try {
      const { token } = JSON.parse(localStorage.getItem('qi_auth') ?? '{}');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch {}
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('qi_auth');
      window.location.href = '/login';
      return;
    }
    const msg =
      data?.error ??
      (Array.isArray(data?.errors) ? data.errors.join(' | ') : null) ??
      `خطأ ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}
