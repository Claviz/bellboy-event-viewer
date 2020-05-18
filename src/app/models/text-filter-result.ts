import { ViewerEvent } from '../models/viewer-event';

export interface TextFilterResult {
    event: ViewerEvent;
    highlightedLines: number[];
}