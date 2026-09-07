import { readFile } from "fs/promises";
import { vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";

export async function loadHTMLWithScripts(htmlPath: string, ...scriptPaths: string[]): Promise<void> {
    await loadHTML(htmlPath);

    for (const scriptPath of scriptPaths) {
        await import(scriptPath);
    }

    // NOTE: Simulate DOMContentLoaded event
    window.dispatchEvent(new Event("DOMContentLoaded"));
}

export async function loadHTML(path: string): Promise<void> {
    const text: string = (await readFile(path)).toString();

    document.body.innerHTML = text;
}

export function deepQuerySelector(element: Node, selector: string): HTMLElement | null {
    const elements: HTMLElement[] = deepQuerySelectorAll(element, selector);

    if (elements.length === 0) {
        return null;
    }

    return elements[0];
}

export function deepQuerySelectorAll(element: Node, selector: string): HTMLElement[] {
    const elements: HTMLElement[] = [];

    function search(node: Node): void {
        if (
            node instanceof HTMLElement &&
            typeof node.matches === "function" &&
            node.matches(selector)
        ) {
            elements.push(node);
        }

        node.childNodes.forEach(search);

        if ((node as Element).shadowRoot) {
            search((node as Element).shadowRoot as Node);
        }
    }

    search(element);

    return elements;
}

export function createMockWindowLocation(): MockProxy<Location> {
    const locationMock: MockProxy<Location> = mock<Location>();

    vi.spyOn(window, "location", "get")
        .mockReturnValue(locationMock);

    return locationMock;
}
