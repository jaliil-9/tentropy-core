'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Terminal as TerminalIcon, Loader2 } from 'lucide-react';

export default function CodePlayground() {
    const [code, setCode] = useState<string>('print("Hello, World!")');
    const [output, setOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sandboxID, setSandboxID] = useState<string | undefined>(undefined);

    const runCode = async () => {
        setIsLoading(true);
        setOutput('');
        try {
            const response = await fetch('/api/run-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, sandboxID }),
            });

            const data = await response.json();

            if (response.ok) {
                setOutput(data.stdout + data.stderr);
                if (data.sandboxID) {
                    setSandboxID(data.sandboxID);
                }
            } else {
                setOutput(`Error: ${data.error}\n${data.details || ''}`);
            }
        } catch (error) {
            setOutput(`Failed to run code: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5 text-green-500" />
                    <span className="font-semibold tracking-wide text-gray-200">Code Runner</span>
                </div>
                <button
                    onClick={runCode}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-md transition-colors text-sm font-medium"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Run Code
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Code Editor Section (70%) */}
                <div className="h-[70%] relative border-b border-gray-800">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16 },
                        }}
                    />
                </div>

                {/* Terminal Output Section (30%) */}
                <div className="h-[30%] flex flex-col bg-black">
                    <div className="flex items-center px-4 py-2 bg-gray-900 border-b border-gray-800">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Terminal Output</span>
                    </div>
                    <div className="flex-1 p-4 overflow-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
                        {output || <span className="text-gray-600 italic">Ready to execute...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
