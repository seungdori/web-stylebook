// Aggregates all surface recipe files into a single stateRecipes array.
import type { StateRecipe } from '../types';
import { dataTableRecipes } from './data-table';
import { formRecipes } from './form';
import { checkoutRecipes } from './checkout';
import { chatRecipes } from './chat';
import { developerConsoleRecipes } from './developer-console';

export const stateRecipes: StateRecipe[] = [
  ...dataTableRecipes,
  ...formRecipes,
  ...checkoutRecipes,
  ...chatRecipes,
  ...developerConsoleRecipes,
];
