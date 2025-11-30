'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { createClient } from '@/utils/supabase/client';
import { Terminal, Shield, Filter, Search, Code, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogEntry {
    id: string;
    created_at: string;
    status: boolean;
    execution_time: number;
    code: string;
    challenge_id: string;
}

export default function LogsPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

    useEffect(() => {
        const fetchLogs = async () => {
            if (!user) return;

            const supabase = createClient();
            const { data, error } = await supabase
                .from('challenge_attempts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching logs:', error);
            } else {
                setLogs(data || []);
            }
            setIsLoadingLogs(false);
        };

        if (isAuthenticated) {
            fetchLogs();
        } else if (!loading) {
            setIsLoadingLogs(false);
        }
    }, [user, isAuthenticated, loading]);

    const filteredLogs = logs.filter(log => {
        if (filter === 'ALL') return true;
        if (filter === 'PASS') return log.status === true;
        if (filter === 'FAIL') return log.status === false;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-gray-500 font-mono text-sm">
                INITIALIZING SYSTEM...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-gray-400 font-mono">
                <Shield className="w-12 h-12 mb-4 text-gray-600" />
                <h1 className="text-xl font-bold text-white mb-2">ACCESS DENIED</h1>
                <p className="mb-6">Authentication required to view system logs.</p>
                <Link
                    href="/login"
                    className="px-6 py-2 bg-hazard-amber text-black font-bold rounded hover:bg-hazard-amber/90 transition-colors"
                >
                    AUTHENTICATE
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090B] text-gray-300 font-mono p-6 pt-32 md:p-12 md:pt-32">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-tungsten-grey pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                            <Terminal className="w-6 h-6 text-hazard-amber" />
                            SYSTEM_LOGS
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                            Comprehensive execution history for User: {user.id.slice(0, 8)}...
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 bg-deep-anthracite p-1 rounded border border-tungsten-grey">
                        <Filter className="w-3 h-3 text-gray-500 ml-2" />
                        <button
                            onClick={() => setFilter('ALL')}
                            className={cn(
                                "px-3 py-1 text-xs font-bold rounded transition-colors",
                                filter === 'ALL' ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            ALL
                        </button>
                        <button
                            onClick={() => setFilter('PASS')}
                            className={cn(
                                "px-3 py-1 text-xs font-bold rounded transition-colors",
                                filter === 'PASS' ? "bg-terminal-green/20 text-terminal-green" : "text-gray-500 hover:text-terminal-green"
                            )}
                        >
                            PASS
                        </button>
                        <button
                            onClick={() => setFilter('FAIL')}
                            className={cn(
                                "px-3 py-1 text-xs font-bold rounded transition-colors",
                                filter === 'FAIL' ? "bg-red-500/20 text-red-500" : "text-gray-500 hover:text-red-500"
                            )}
                        >
                            FAIL
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-deep-anthracite border border-tungsten-grey rounded-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-tungsten-grey bg-carbon-grey/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Timestamp</div>
                        <div className="col-span-3">Challenge ID</div>
                        <div className="col-span-2 text-right">Duration</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {isLoadingLogs ? (
                        <div className="p-12 text-center text-gray-500 animate-pulse">
                            FETCHING LOG DATA...
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            NO LOGS FOUND MATCHING CRITERIA.
                        </div>
                    ) : (
                        <div className="divide-y divide-tungsten-grey/30">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                                    <div className="col-span-2">
                                        <span className={cn(
                                            "flex items-center gap-2 text-xs font-bold",
                                            log.status ? "text-terminal-green" : "text-red-500"
                                        )}>
                                            {log.status ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {log.status ? 'PASS' : 'FAIL'}
                                        </span>
                                    </div>
                                    <div className="col-span-3 text-xs text-gray-400 font-mono">
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                    <div className="col-span-3 text-xs text-hazard-amber font-mono">
                                        {log.challenge_id}
                                    </div>
                                    <div className="col-span-2 text-right text-xs text-gray-500 font-mono">
                                        {log.execution_time}ms
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <Link
                                            href={`/challenge/${log.challenge_id}`}
                                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-transparent hover:border-gray-500 px-2 py-1 rounded transition-all"
                                        >
                                            <Code className="w-3 h-3" />
                                            Replay
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
