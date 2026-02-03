export interface NudgeCommunication {
    method: 'sms' | 'email' | 'whatsapp';
    recipient: string;
    template: string;
}

export interface NudgePayload {
    communication?: NudgeCommunication;
    daysLeft?: number;
    [key: string]: any;
}

export interface NudgeResult {
    title: string;
    description: string;
    type: string;
    priority: 'LOW' | 'Medium' | 'HIGH' | 'CRITICAL';
    payload?: NudgePayload;
    candidateId?: string;
    projectId?: string;
    clientId?: string;
}

export interface NudgeContext {
    candidates: any[];
    projects: any[];
    clients: any[];
}

export interface NudgeGenerator {
    generate(context: NudgeContext): Promise<NudgeResult[]>;
}
