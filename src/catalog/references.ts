import referenceLibraryData from './references.generated.json';
import type { DesignReferenceLibrary } from './types';

export const referenceLibrary = referenceLibraryData as DesignReferenceLibrary;
export const designReferences = referenceLibrary.references;
