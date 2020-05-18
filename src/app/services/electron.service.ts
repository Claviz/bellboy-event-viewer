import { Injectable, NgZone } from '@angular/core';
import * as childProcess from 'child_process';
import { ipcRenderer, remote, webFrame } from 'electron';
import * as fs from 'fs';
import { Subject, BehaviorSubject, ReplaySubject, fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { addLiveJobs, removeLiveJobs } from '../store/live-job.actions';
import { ViewerEvent } from '../models/viewer-event';
import { addEvents } from '../store/event.actions';
import { JobResume } from '../models/job-resume';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  isDarkTheme$ = new BehaviorSubject<boolean>(!!window.localStorage.getItem('isDarkTheme'));

  constructor(private store: Store, private ngZone: NgZone) {
    this.ipcRenderer = window.require('electron').ipcRenderer;
    this.webFrame = window.require('electron').webFrame;
    this.remote = window.require('electron').remote;

    this.childProcess = window.require('child_process');
    this.fs = window.require('fs');

    this.ipcRenderer.send('request-available-jobs');

    this.ipcRenderer.on('add-live-jobs', (event, message: string[]) => {
      this.ngZone.run(() => {
        store.dispatch(addLiveJobs({ jobIds: message }));
      });
    });
    this.ipcRenderer.on('remove-live-jobs', (event, message: string[]) => {
      this.ngZone.run(() => {
        store.dispatch(removeLiveJobs({ jobIds: message }));
      });
    });
    this.ipcRenderer.on('events', (event, message: ViewerEvent[]) => {
      this.ngZone.run(() => {
        store.dispatch(addEvents({ events: message }))
      });
    });

    this.ipcRenderer.on('toggle-theme', (e) => {
      const isDarkTheme = window.localStorage.getItem('isDarkTheme');
      if (isDarkTheme) {
        document.body.classList.remove('dark-theme');
        window.localStorage.removeItem('isDarkTheme');
        this.ngZone.run(() => {
          this.isDarkTheme$.next(false);
        });
      } else {
        document.body.classList.add('dark-theme');
        window.localStorage.setItem('isDarkTheme', 'true');
        this.ngZone.run(() => {
          this.isDarkTheme$.next(true);
        });
      }
    });
  }

  giveAnswer(jobResume: JobResume) {
    this.ipcRenderer.send('answer', jobResume);
  }
}