import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

interface LintError {
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    code?: string;
    source: string;
}

interface RuffError {
    location: { row: number; column: number };
    end_location?: { row: number; column: number };
    message: string;
    type: string; // 'error' | 'warning'
    code: string;
}

interface PylintError {
    line: number;
    column: number;
    message: string;
    type: string; // 'error' | 'fatal' | 'convention' | 'refactor' | 'warning'
    'message-id': string;
}

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Code is required and must be a string' },
                { status: 400 }
            );
        }

        // Create a temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), '.temp');
        if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true });
        }

        // Create a temporary file
        const tempFile = path.join(tempDir, `temp_${Date.now()}.py`);
        await writeFile(tempFile, code, 'utf-8');

        const lintErrors: LintError[] = [];

        try {
            // Run Ruff (fast modern linter)
            try {
                const { stdout: ruffOutput } = await execAsync(
                    `python -m ruff check "${tempFile}" --output-format json`,
                    { timeout: 5000 }
                );

                if (ruffOutput) {
                    const ruffErrors: RuffError[] = JSON.parse(ruffOutput);
                    ruffErrors.forEach((error) => {
                        lintErrors.push({
                            line: error.location.row,
                            column: error.location.column,
                            endLine: error.end_location?.row,
                            endColumn: error.end_location?.column,
                            message: error.message,
                            severity: error.type === 'error' ? 'error' : 'warning',
                            code: error.code,
                            source: 'ruff'
                        });
                    });
                }
            } catch (error) {
                // Ruff not installed or errors found, try pylint
                console.log('Ruff not available or failed', error);
            }

            // If Ruff didn't work, try Pylint
            if (lintErrors.length === 0) {
                try {
                    const pylintrcPath = path.join(process.cwd(), '.pylintrc');
                    const { stdout: pylintOutput } = await execAsync(
                        `python -m pylint "${tempFile}" --rcfile="${pylintrcPath}" --output-format=json`,
                        { timeout: 10000 }
                    );

                    if (pylintOutput) {
                        const pylintErrors: PylintError[] = JSON.parse(pylintOutput);
                        pylintErrors.forEach((error) => {
                            let severity: 'error' | 'warning' | 'info' = 'warning';
                            if (error.type === 'error' || error.type === 'fatal') {
                                severity = 'error';
                            } else if (error.type === 'convention' || error.type === 'refactor') {
                                severity = 'info';
                            }

                            lintErrors.push({
                                line: error.line,
                                column: error.column,
                                message: error.message,
                                severity,
                                code: error['message-id'],
                                source: 'pylint'
                            });
                        });
                    }
                } catch (pylintError: unknown) {
                    console.log('Pylint error:', pylintError instanceof Error ? pylintError.message : String(pylintError));
                    // If both fail, try basic syntax check
                    try {
                        await execAsync(`python -m py_compile "${tempFile}"`, { timeout: 5000 });
                    } catch (syntaxError: unknown) {
                        // Parse syntax errors
                        const message = syntaxError instanceof Error ? syntaxError.message : String(syntaxError);
                        const match = message.match(/line (\d+)/);
                        if (match) {
                            lintErrors.push({
                                line: parseInt(match[1]),
                                column: 1,
                                message: 'Syntax error',
                                severity: 'error',
                                source: 'python'
                            });
                        }
                    }
                }
            }
        } finally {
            // Clean up temp file
            try {
                await unlink(tempFile);
            } catch (e) {
                console.error('Failed to delete temp file:', e);
            }
        }

        return NextResponse.json({
            success: true,
            errors: lintErrors,
            linterUsed: lintErrors[0]?.source || 'none'
        });

    } catch (error) {
        console.error('Linting error:', error);
        return NextResponse.json(
            {
                error: 'Failed to lint code',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
