import { Component, OnInit } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { ViewerEvent } from '../../models/viewer-event';
import { selectCurrentEvent, selectEventFilter, selectEventFilterText, selectCurrentEventTextFilterResult } from '../../store';
import { EventFilter } from '../../models/event-filter';
import { TextFilterResult } from '../../models/text-filter-result';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-event-viewer-container',
  templateUrl: './event-viewer-container.component.html',
  styleUrls: ['./event-viewer-container.component.scss']
})
export class EventViewerContainerComponent implements OnInit {

  filterResult$: Observable<TextFilterResult>;
  isDarkTheme$: Subject<boolean>;

  constructor(public store: Store, public electronService: ElectronService) {
    this.filterResult$ = store.select(selectCurrentEventTextFilterResult);
    this.isDarkTheme$ = electronService.isDarkTheme$;
  }

  ngOnInit(): void {
  }

}
