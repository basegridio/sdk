export interface BaseGridConfig {
    apiKey: string
    baseUrl?: string
}

export interface AddMemoryParams {
    agentId: string
    content: string
    metadata?: Record<string, any>
    importance?: number
    ttl?: string
}

export interface SearchMemoryParams {
    agentId: string
    query: string
    limit?: number
}

export interface Memory {
    id: string
    agentId: string
    content: string
    metadata: Record<string, any>
    importance: number
    createdAt: string
    accessedAt?: string
}

export interface SearchResult extends Memory {
    similarity?: number
    keyword_score?: number
    combined_score?: number
}

export class BaseGrid {
    private apiKey: string
    private baseUrl: string

    constructor(config: BaseGridConfig) {
        this.apiKey = config.apiKey
        this.baseUrl = config.baseUrl || 'https://api.basegrid.io'
    }

    private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        })

        if (!response.ok) {
            const error: any = await response.json()
            throw new Error(error.error || `Request failed: ${response.status}`)
        }

        return response.json()
    }

    async add(params: AddMemoryParams): Promise<Memory> {
        const response: any = await this.request('/v1/memories', {
            method: 'POST',
            body: JSON.stringify(params)
        })
        return response.data
    }

    async search(params: SearchMemoryParams): Promise<SearchResult[]> {
        const response: any = await this.request('/v1/memories/search', {
            method: 'POST',
            body: JSON.stringify(params)
        })
        return response.results
    }

    async delete(memoryId: string): Promise<{ deleted: boolean; id: string }> {
        const response: any = await this.request(`/v1/memories/${memoryId}`, {
            method: 'DELETE'
        })
        return response
    }

    async list(agentId: string, options?: { limit?: number; offset?: number; search?: string }): Promise<any> {
        const params = new URLSearchParams()
        if (options?.limit) params.set('limit', options.limit.toString())
        if (options?.offset) params.set('offset', options.offset.toString())
        if (options?.search) params.set('search', options.search)

        return this.request(`/v1/agents/${agentId}/memories?${params}`)
    }

    // New Data Management Methods

    async update(memoryId: string, data: { content?: string; importance?: number; metadata?: any }): Promise<{ success: boolean; memory: Memory }> {
        return this.request(`/v1/data/memories/${memoryId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
    }

    async bulkDelete(memoryIds: string[]): Promise<{ success: boolean; deletedCount: number }> {
        return this.request('/v1/data/memories/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ memoryIds })
        })
    }

    async deleteAgentMemories(agentId: string): Promise<{ success: boolean; deletedCount: number }> {
        return this.request(`/v1/data/agents/${agentId}/memories`, {
            method: 'DELETE'
        })
    }

    async exportAllData(): Promise<any> {
        return this.request('/v1/data/export/all', {
            method: 'GET'
        })
    }

    async getRetentionPolicies(): Promise<any> {
        return this.request('/v1/data/retention-policies', {
            method: 'GET'
        })
    }

    async createRetentionPolicy(policy: {
        policy_type: 'auto_delete_old' | 'archive_old' | 'custom'
        retention_days: number
        applies_to: 'all_memories' | 'specific_agent' | 'by_importance'
        agent_id?: string
        importance_threshold?: number
    }): Promise<any> {
        return this.request('/v1/data/retention-policies', {
            method: 'POST',
            body: JSON.stringify(policy)
        })
    }

    async updateRetentionPolicy(id: string, updates: Partial<{ enabled: boolean; retention_days: number }>): Promise<any> {
        return this.request(`/v1/data/retention-policies/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        })
    }

    async deleteRetentionPolicy(id: string): Promise<{ success: boolean }> {
        return this.request(`/v1/data/retention-policies/${id}`, {
            method: 'DELETE'
        })
    }
}
