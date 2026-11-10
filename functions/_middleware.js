import { onRequest as handlePageRequest } from '../src/data/pageMiddleware.ts';

export function onRequest(context) {
  return handlePageRequest(context);
}
