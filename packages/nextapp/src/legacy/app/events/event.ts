import { createEvent } from '@legacy/cdk/hooks/event-dispatcher';

export const fitScreenSizeEvent = createEvent('fitScreenSizeEvent');
export const someEvent = createEvent<{ data: string }>('otherEvent');
