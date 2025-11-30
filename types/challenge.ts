export interface Challenge {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    summary: string; // Short description for the card (1-2 lines)
    description: string; // Markdown content explaining the scenario
    brokenCode: string; // The Python code the user starts with
    testCode: string; // The Pytest code that runs to verify the fix
    successMessage: string; // What to show when they pass
    solutionCode?: string; // The working solution code
    hasSolution?: boolean; // Whether a solution exists (for client-side check)
    debrief?: string; // Educational content explaining the solution
}

export interface Track {
    id: string;
    title: string;
    description: string;
    challengeIds: string[];
}
