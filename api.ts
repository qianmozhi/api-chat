import "https://deno.land/std@0.177.0/dotenv/load.ts";
import { serve, type ConnInfo } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const PORT = Number.parseInt(Deno.env.get('API_PORT') ?? '7050');

const handler = async (req: Request, conn: ConnInfo): Promise<Response> => {

  console.log(conn.remoteAddr);

  if (req.method === "POST" && req.headers.get("content-type") === "application/json") {

    const body = await req.json();

    if (body?.text) {

      console.log(body);

      const request = await fetch("https://api.openai.com/v1/completions", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          // "model": "text-davinci-003",
          "model": "text-curie-001",
          "prompt": body.text,
          "max_tokens": 1500
        })
      });

      const res = await request.json();

      console.log(res);

      if (res?.id) {
        return new Response(res.choices[0].text, {
          headers: {
            "content-type": "text/plain; charset=utf-8"
          },
          status: 200
        });
      } else {
        return new Response(JSON.stringify(res), {
          headers: {
            "content-type": "text/plain; charset=utf-8"
          },
          status: 400
        });
      }
    }
  }

  return new Response(null, { status: 403 });
};

await serve(handler, {
  port: PORT,
  onListen({ port, hostname }) {
    console.log(`Server started at http://${hostname}:${port}`);
  },
});

