export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function handleResponse(response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function analyzePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}

export async function createLogEntry(entry) {
  const response = await fetch(`${API_BASE_URL}/api/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return handleResponse(response);
}

export async function fetchLogEntries({ from, to } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const response = await fetch(`${API_BASE_URL}/api/logs?${params.toString()}`);
  return handleResponse(response);
}

export async function deleteLogEntry(id) {
  const response = await fetch(`${API_BASE_URL}/api/logs/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    return handleResponse(response);
  }
}

export async function fetchAdvice(days) {
  const response = await fetch(`${API_BASE_URL}/api/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
  });
  return handleResponse(response);
}

export function imageUrl(imagePath) {
  return `${API_BASE_URL}${imagePath}`;
}
