export interface Attempt {
    id?: string;
    timestamp: number;
    status: 'PASS' | 'FAIL';
    executionTime: number;
    code?: string;
}
