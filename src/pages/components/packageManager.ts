import { createContext, useContext } from 'react';

export type PackageManager = 'npm' | 'pnpm' | 'bun';

export const PackageManagerContext = createContext<{ manager: PackageManager; setManager: (next: PackageManager) => void } | null>(null);

export function usePackageManager() {
  const value = useContext(PackageManagerContext);
  if (!value) throw new Error('usePackageManager must be used inside PackageManagerContext');
  return value;
}
