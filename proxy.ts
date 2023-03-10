import "https://deno.land/std@0.177.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PORT = Number.parseInt(Deno.env.get('PROXY_PORT') ?? '7040');
const TARGET_URL = Deno.env.get('PROXY_TARGET_URL') ?? '';
const { port: TARGET_PORT, protocol: TARGET_PROTOCOL, hostname: TARGET_HOSTNAME } = new URL(TARGET_URL);

const handler = async (req: Request): Promise<Response> => {

  const url = new URL(req.url);
  url.port = TARGET_PORT;
  url.protocol = TARGET_PROTOCOL;
  url.hostname = TARGET_HOSTNAME;

  return await fetch(url.href, {
    headers: req.headers,
    method: req.method,
    body: req.body,
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);
await serve(handler, { port: PORT });


