# mfmfintro-backend

## Develop

### TODO

- Create `.env.local` and fill in all the values.
- Run this
  ```bash
  npm install
  npm run dev
  ```

--> `http://localhost:8787/`

### Response

```bash
curl -X POST http://localhost:8787/api/counter
# --> {"count": <number> }
curl -X GET http://localhost:8787/api/members
# --> [{"id":1,"name":"おんねない","role":"Project Manager / Frontend Engineer","avatar_url":"https://orzhomagbyjnrgztpnhg.supabase.co/storage/v1/object/public/img/onnenai_icon.png","tw_url":"https://twitter.com/onnenai_w57"},{"id":2,"name":"まろん｡","role":"Backend Engineer","avatar_url":"https://orzhomagbyjnrgztpnhg.supabase.co/storage/v1/object/public/img/montblank_icon.png","tw_url":"https://twitter.com/rin_montblank"}]
```

## Format Code

Run "prettier":
```bash
npm run format
```

## Deploy

```bash
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
