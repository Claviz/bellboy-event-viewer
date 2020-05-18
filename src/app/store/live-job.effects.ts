import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { ElectronService } from '../services/electron.service';
import { resumeJob } from '../store/live-job.actions';

@Injectable()
export class LiveJobEffects {

    resumeJob$ = createEffect(() =>
        this.actions$.pipe(
            ofType(resumeJob),
            tap((action) => {
                this.electronService.giveAnswer(action.jobResume)
            }),
        ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private store: Store,
        private electronService: ElectronService,
    ) { }
}