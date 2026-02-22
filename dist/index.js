export class BaseGrid {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'http://localhost:3000';
    }
    async request(endpoint, options = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Request failed: ${response.status}`);
        }
        return response.json();
    }
    async add(params) {
        const response = await this.request('/v1/memories', {
            method: 'POST',
            body: JSON.stringify(params)
        });
        return response.data;
    }
    async search(params) {
        const response = await this.request('/v1/memories/search', {
            method: 'POST',
            body: JSON.stringify(params)
        });
        return response.results;
    }
    async delete(memoryId) {
        const response = await this.request(`/v1/memories/${memoryId}`, {
            method: 'DELETE'
        });
        return response;
    }
    async list(agentId, options) {
        const params = new URLSearchParams();
        if (options?.limit)
            params.set('limit', options.limit.toString());
        if (options?.offset)
            params.set('offset', options.offset.toString());
        if (options?.search)
            params.set('search', options.search);
        return this.request(`/v1/agents/${agentId}/memories?${params}`);
    }
    // New Data Management Methods
    async update(memoryId, data) {
        return this.request(`/v1/data/memories/${memoryId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
    async bulkDelete(memoryIds) {
        return this.request('/v1/data/memories/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ memoryIds })
        });
    }
    async deleteAgentMemories(agentId) {
        return this.request(`/v1/data/agents/${agentId}/memories`, {
            method: 'DELETE'
        });
    }
    async exportAllData() {
        return this.request('/v1/data/export/all', {
            method: 'GET'
        });
    }
    async getRetentionPolicies() {
        return this.request('/v1/data/retention-policies', {
            method: 'GET'
        });
    }
    async createRetentionPolicy(policy) {
        return this.request('/v1/data/retention-policies', {
            method: 'POST',
            body: JSON.stringify(policy)
        });
    }
    async updateRetentionPolicy(id, updates) {
        return this.request(`/v1/data/retention-policies/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    }
    async deleteRetentionPolicy(id) {
        return this.request(`/v1/data/retention-policies/${id}`, {
            method: 'DELETE'
        });
    }
}
