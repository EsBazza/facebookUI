// Prefer an env-configured base (Vite): set VITE_API_BASE to override in development/production
// In dev default to the relative path so the Vite proxy can forward requests and avoid CORS.
// In production default to the hosted API endpoint.
let base =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV
    ? '/api/posts'
    : 'https://facebookapi-2txh.onrender.com/api/posts');

export function setBaseUrl(url) {
  if (!url) return;
  base = url.endsWith('/') ? url.slice(0, -1) : url;
}

async function handleResponse(res) {
  const text = await res.text();

  if (!res.ok) {
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch {
      // ignore parse errors, fall back to raw text
    }
    throw new Error(msg || res.statusText);
  }

  if (res.status === 204) return null; // No content
  if (!text) return null;              // Empty body

  try {
    return JSON.parse(text);
  } catch {
    return text; // Fallback to raw text
  }
}

export async function listPosts() {
  const res = await fetch(base);
  const data = await handleResponse(res);
  return data || [];
}

export async function getPost(id) {
  const res = await fetch(`${base}/${id}`);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
