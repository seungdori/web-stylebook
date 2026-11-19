import { z } from 'zod';

// Public pages validate saved drafts under a CSP without unsafe-eval. Disable
// Zod's JIT before creating schemas, including its dynamic-code capability probe.
z.config({ jitless: true });

export { z };
