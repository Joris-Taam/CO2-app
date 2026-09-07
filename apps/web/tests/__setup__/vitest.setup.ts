import { vi } from "vitest";
import createFetchMock, { FetchMock } from "vitest-fetch-mock";

// NOTE: Globals
defineGlobal("VITE_API_URL", "/");

// NOTE: Create a mock for fetch
const fetchMocker: FetchMock = createFetchMock(vi);
fetchMocker.enableMocks();

// NOTE: Disable mocking fetch by default
fetchMocker.dontMock();

// NOTE: Monkey patch attachShadow to always be open
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalAttachShadow: (init: ShadowRootInit) => ShadowRoot = Element.prototype.attachShadow;

Element.prototype.attachShadow = function (init) {
    return originalAttachShadow.call(this, { ...init, mode: "open" });
};

function defineGlobal(key: string, value?: unknown): void {
    // @ts-expect-error Allow defining globals
    global[key] = value;
}
