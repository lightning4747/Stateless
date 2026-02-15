import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
}

export const createProject = async ({ item, visibility }: { item: any, visibility?: string }) => {
    if (!PUTER_WORKER_URL) return null;
    
    try {
        // We concatenate the route to the base URL, just like the working delete/get functions
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/save`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    project: item, 
                    visibility 
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Save failed:", response.status, errorText);
            return null;
        }

        const data = await response.json();
        return data?.project ?? null;
    } catch (e) {
        console.error("Create/Save call failed:", e);
        return null;
    }
}

export const getProjects = async () => {
    if (!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
        return []
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: 'GET' });

        if (!response.ok) {
            console.error('Failed to fetch history', await response.text());
            return [];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null };

        return Array.isArray(data?.projects) ? data?.projects : [];
    } catch (e) {
        console.error('Failed to get projects', e);
        return [];
    }
}

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};

export const deleteProject = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) return false;
    
    try {
        // We use the full URL + options, just like your working GET method
        // but specifying the POST method and body.
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/delete`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data.deleted === true;
        }
        
        const errorText = await response.text();
        console.error("Delete failed with status:", response.status, errorText);
        return false;
    } catch (e) {
        console.error("Delete call failed:", e);
        return false;
    }
}