// Policies catalog domain. Single source of truth: re-export the existing
// src/data/agentHandoff.ts data (no re-authoring — P1). The MCP catalog and the
// website share these exact arrays.

import {
  preflightChecks, verificationGroups, antiPatterns, decisionExamples,
} from '../../data/agentHandoff';
import type { Policies } from '../types';
import { auditChecks } from './audit';

export { preflightChecks, verificationGroups, antiPatterns, auditChecks, decisionExamples };

export const policies: Policies = {
  preflight: preflightChecks,
  verification: verificationGroups,
  antiPatterns,
  auditChecks,
  decisionExamples,
};
