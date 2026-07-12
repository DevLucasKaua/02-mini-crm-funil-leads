// json-server 0.17.x não publica types — declaração ambient mínima do que usamos
declare module 'json-server' {
  import type { RequestHandler, Router } from 'express';

  interface JsonServerRouter extends Router {
    // instância lowdb v1 (API chain: db.get('leads').value())
    db: {
      get(name: string): { value(): unknown };
    };
  }

  export function defaults(opts?: {
    logger?: boolean;
    readOnly?: boolean;
    noCors?: boolean;
    static?: string;
  }): RequestHandler[];

  export function router(source: string): JsonServerRouter;
  export const bodyParser: RequestHandler;
}
