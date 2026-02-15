# Environment Variables

Stateless requires specific environment variables to connect to its backend services (Puter).

## Configuration File

Create a file named `.env.local` in the root of your project. This file is ignored by Git to keep your configuration secure.

## Local Development Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_PUTER_WORKER_URL` | The HTTPS URL of your deployed Puter Worker (Backend). | `https://stateless-worker-xyz.puter.work` |

## Example `.env.local`

```env
VITE_PUTER_WORKER_URL="https://your-worker-subdomain.puter.work"
```

## How to Obtain `VITE_PUTER_WORKER_URL`

1.  Deploy your worker code (see [Backend Setup](BACKEND_SETUP.md)).
2.  Once deployed, Puter will provide a public URL for your worker.
3.  Copy that URL and paste it into your `.env.local` file.

> **Note:** Ensure there is no trailing slash on the URL.
