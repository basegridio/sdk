export interface BaseGridConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface AddMemoryParams {
    agentId: string;
    content: string;
    metadata?: Record<string, any>;
    importance?: number;
    ttl?: string;
}
export interface SearchMemoryParams {
    agentId: string;
    query: string;
    limit?: number;
}
export interface Memory {
    id: string;
    agentId: string;
    content: string;
    metadata: Record<string, any>;
    importance: number;
    createdAt: string;
    accessedAt?: string;
}
export interface SearchResult extends Memory {
    similarity?: number;
    keyword_score?: number;
    combined_score?: number;
}
export declare class BaseGrid {
    private apiKey;
    private baseUrl;
    constructor(config: BaseGridConfig);
    private request;
    add(params: AddMemoryParams): Promise<Memory>;
    search(params: SearchMemoryParams): Promise<SearchResult[]>;
    delete(memoryId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    list(agentId: string, options?: {
        limit?: number;
        offset?: number;
        search?: string;
    }): Promise<any>;
    update(memoryId: string, data: {
        content?: string;
        importance?: number;
        metadata?: any;
    }): Promise<{
        success: boolean;
        memory: Memory;
    }>;
    bulkDelete(memoryIds: string[]): Promise<{
        success: boolean;
        deletedCount: number;
    }>;
    deleteAgentMemories(agentId: string): Promise<{
        success: boolean;
        deletedCount: number;
    }>;
    exportAllData(): Promise<any>;
    getRetentionPolicies(): Promise<any>;
    createRetentionPolicy(policy: {
        policy_type: 'auto_delete_old' | 'archive_old' | 'custom';
        retention_days: number;
        applies_to: 'all_memories' | 'specific_agent' | 'by_importance';
        agent_id?: string;
        importance_threshold?: number;
    }): Promise<any>;
    updateRetentionPolicy(id: string, updates: Partial<{
        enabled: boolean;
        retention_days: number;
    }>): Promise<any>;
    deleteRetentionPolicy(id: string): Promise<{
        success: boolean;
    }>;
}
