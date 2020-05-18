import { IBellboyEvent } from 'bellboy';

export interface ViewerEvent extends IBellboyEvent {
    eventArgumentsStringified: any;
} 