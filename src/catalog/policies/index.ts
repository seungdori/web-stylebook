// Policies catalog domain. Single source of truth: re-export the existing
// src/data/agentHandoff.ts data (no re-authoring — P1). The MCP catalog and the
// website share these exact arrays.

import {
  preflightChecks, verificationGroups, antiPatterns, decisionExamples,
} from '../../data/agentHandoff';
import type { Policies } from '../types';

export { preflightChecks, verificationGroups, antiPatterns, decisionExamples };

export const policies: Policies = {
  preflight: preflightChecks,
  verification: verificationGroups,
  antiPatterns,
  decisionExamples,
};
