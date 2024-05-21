import { AsyncLocalStorage } from "node:async_hooks";
import { isServer, RequestContext } from '../../web/dist/web.js';

function provideRequestEvent(init, cb) {
  if (!isServer) throw new Error("Attempting to use server context in non-server build");
  const ctx = (globalThis[RequestContext] = globalThis[RequestContext] || new AsyncLocalStorage());
  return ctx.run(init, cb);
}

export { provideRequestEvent };
