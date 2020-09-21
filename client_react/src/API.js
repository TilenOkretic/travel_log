const API_URL = 'http://192.168.1.11:1337';

export async function listLogEntries() {
    const response = await fetch(`${API_URL}/api/logs`);
    return response.json();
  }

export async function createLogEntry(entry) {
    const data = await fetch(`${API_URL}/api/logs`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(entry),
    });
    return data.json();
}