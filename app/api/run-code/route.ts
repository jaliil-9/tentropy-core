
import { Sandbox } from '@e2b/code-interpreter';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { code, sandboxID } = await req.json();

    if (!code) {
        return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    let sandbox;
    try {
        if (sandboxID) {
            try {
                sandbox = await Sandbox.connect(sandboxID, { apiKey: process.env.E2B_API_KEY });
            } catch (e) {
                console.log('Failed to connect to sandbox:', e);
            }
        }

        if (!sandbox) {
            // 10 seconds idle timeout to save costs
            sandbox = await Sandbox.create({
                apiKey: process.env.E2B_API_KEY,
                timeoutMs: 10000
            });
        }

        // Set a 5-second timeout for the code execution
        const execution = await sandbox.runCode(code, { timeoutMs: 5000 });

        return NextResponse.json({
            stdout: execution.logs.stdout.join(''),
            stderr: execution.logs.stderr.join(''),
            sandboxID: sandbox.sandboxId,
        });
    } catch (error) {
        console.error('Error executing code:', error);
        return NextResponse.json(
            { error: 'Execution failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
    // Removed finally block to keep sandbox alive
}

