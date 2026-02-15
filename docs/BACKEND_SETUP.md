# Backend Setup with Puter.js

Stateless uses a [Puter Worker](https://puter.com/workers) as its backend to handle project storage (Key-Value), visibility logic, and CORS handling.

## Instructions

1.  **Create a Worker on Puter.com:**
    - Log in to your Puter account.
    - Go to **Workers** > **Create New Worker**.
    - Choose the **Blank (Node.js)** template (or any basic HTTP template).

2.  **Paste the Worker Code:**
    - Replace the contents of `index.js` in your worker with the code below.
    - Ensure your worker has a standard router setup if not included (e.g., `itty-router` or similar depending on the template). If using the default Puter "HTTP Function" template, ensure you adapt `router.get` calls if necessary, but typically Puter workers support this router syntax out of the box.

3.  **Get Your Worker URL:**
    - Once deployed, copy the worker URL (e.g., `https://stateless-worker-xyz.puter.work`).
    - Add this URL to your `.env.local` file as `VITE_PUTER_WORKER_URL`.

## `puter.worker.js` Code

```javascript
/* 
   Stateless Backend Worker Logic
   Handles:
   - Project Save (Create/Update)
   - Project List (Respects visibility)
   - Project Get (Single item)
   - Project Delete
   - CORS Preflight headers
*/

const PROJECT_PREFIX = 'stateless_project_';

// Helper for consistent JSON responses with CORS headers
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        }
    })
}

const jsonError = (status, message, extra = {}) => {
    return jsonResponse({ error: message, ...extra }, status);
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();
        return user?.uuid || null;
    } catch { return null; }
}

// FIX: Handle CORS Preflight (fixes the DELETE/TypeError issue)
// If router.options isn't available, check if your router supports .all('*', logic)
if (router.options) {
    router.options('/*', () => jsonResponse(null, 204));
} else {
    // Fallback or just ensure OPTIONS returns 200 OK with headers
}

// ---------------- ROUTES ----------------

// Save Project (Create or Update)
router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;
        const visibility = body?.visibility; // Read visibility from frontend

        if(!project?.id) return jsonError(400, 'Project ID is required');

        const payload = {
            ...project,
            // Logic: Set isPublic based on explicit visibility toggle or existing status
            // Default is private unless explicitly shared
            isPublic: visibility === 'public' || (project.isPublic === true && visibility !== 'private'),
            updatedAt: new Date().toISOString(),
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return jsonResponse({ saved: true, id: project.id, project: payload });
    } catch (e) {
        return jsonError(500, 'Failed to save project', { message: e.message || 'Unknown error' });
    }
});

// List Projects
router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        // Fetch all projects for this user
        // Note: list(prefix, true) returns [{ key, value }, ...]
        const projects = (await userPuter.kv.list(PROJECT_PREFIX, true))
            .map(({ value }) => ({
                ...value,
                // Ensure isPublic reflects the stored value. Default to false if undefined.
                isPublic: value.isPublic === true || value.visibility === 'public'
            }));

        return jsonResponse({ projects });
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e.message || 'Unknown error' });
    }
});

// Get Single Project
router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Project ID is required');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);

        if (!project) return jsonError(404, 'Project not found');

        return jsonResponse({ project });
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e.message || 'Unknown error' });
    }
});

// Delete Project
router.delete('/api/projects/delete', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');
        
        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Project ID is required');

        const key = `${PROJECT_PREFIX}${id}`;
        
        // Use del (or delete) to remove the key
        await userPuter.kv.del(key);

        return jsonResponse({ deleted: true });
    } catch(e) {
        return jsonError(500, 'Failed to delete project', { message: e.message });
    }
});

router.get('/', ({ request }) => {
    return new Response('Hello Stateless Backend', { headers: { 'Access-Control-Allow-Origin': '*' } }); 
});

// Catch-all 404
router.get('/*page', ({ request, params }) => {
    return new Response(`Page ${params.page} not found`, { status: 404 });
});
```
