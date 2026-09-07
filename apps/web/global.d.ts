declare global {
    const VITE_API_URL: string;

    // NOTE: Prevent casting of getElementById
    interface Document {
        getElementById<E extends HTMLElement = HTMLElement>(elementId: string): E | null;
    }
}

export { };
