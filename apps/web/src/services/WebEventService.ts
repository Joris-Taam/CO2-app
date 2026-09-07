import { WebEvent } from "../enums/WebEvent";

/**
 * Service to allow components to communicate with eachother through events
 */
export class WebEventService {
    /**
     * Listen for a web event and execute a function when it occurs
     *
     * @template T Type used for the event data
     *
     * @param webEvent Kind of web event to listen for
     * @param callback Function to call when the web event occurs. Will get the event data as an argument.
     */
    public addEventListener<T>(
        webEvent: WebEvent,
        callback: (data: T) => void
    ): void {
        window.addEventListener(`web:${webEvent}`, event => {
            callback((event as CustomEvent).detail as T);
        });
    }

    /**
     * Dispatch a web event
     *
     * @template T Type used for the event data
     *
     * @param webEvent Kind of web event to dispatch
     * @param data Event data to send along with the dispatch
     */
    public dispatchEvent<T>(webEvent: WebEvent, data?: T): void {
        window.dispatchEvent(
            new CustomEvent(`web:${webEvent}`, {
                detail: data,
            })
        );
    }
}
