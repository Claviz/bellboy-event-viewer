import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { selectMostRecentEvent } from '.';
import { ElectronService } from '../services/electron.service';
import { addEvents, selectEvent } from './event.actions';

@Injectable()
export class EventEffects {

    addEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addEvents),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.store.select(selectMostRecentEvent)),
                )
            ),
            map(([action, mostRecentEvent]) => {
                return selectEvent({ eventId: mostRecentEvent.eventId })
            }),
            filter(x => !!x)
        ),
    );

    constructor(
        private actions$: Actions,
        private store: Store,
        private electronService: ElectronService,
    ) { }
}