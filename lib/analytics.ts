type EventProps = Record<string, any>;

export const trackEvent = (eventName: string, props?: EventProps) => {
    // In a real app, you would send this to Sevalla or another analytics provider
    // Example Sevalla call (hypothetical):
    // sevalla.track(eventName, props);

    console.log(`[Analytics] ${eventName}`, props);
};
