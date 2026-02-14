interface AuthState {
    isSignedIn: boolean;
    userName: string | null,
    userId: string | null
}

type AuthContext = {
    isSignedIn: boolean;
    userName: string | null,
    userId: string | null,
    refreshAuth: () => Promise<boolean>,
    signOut: () => Promise<boolean>,
    signIn: ()=> Promise<boolean>
}

type HostingConfig = { subdomain: string };
type HostedAsset = { url: string };


interface StoreHostedImageParams {
    hosting: HostingConfig | null;
    url: string;
    projectId: string;
    label: "source" | "rendered";
}