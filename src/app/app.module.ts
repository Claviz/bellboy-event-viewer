import '../polyfills';
import 'reflect-metadata';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularSplitModule } from 'angular-split';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventFilterComponent } from './components/event-filter/event-filter.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventViewerComponent } from './components/event-viewer/event-viewer.component';
import { LiveJobListComponent } from './components/live-job-list/live-job-list.component';
import { LiveJobItemComponent } from './components/live-job-item/live-job-item.component';
import { EventFilterContainerComponent } from './containers/event-filter-container/event-filter-container.component';
import { EventListContainerComponent } from './containers/event-list-container/event-list-container.component';
import { EventViewerContainerComponent } from './containers/event-viewer-container/event-viewer-container.component';
import { LiveJobListContainerComponent } from './containers/live-job-list-container/live-job-list-container.component';
import { reducers } from './store';
import { EventEffects } from './store/event.effects';
import { LiveJobEffects } from './store/live-job.effects';

@NgModule({
  declarations: [
    AppComponent,
    EventFilterComponent,
    EventListContainerComponent,
    EventListComponent,
    EventViewerContainerComponent,
    EventViewerComponent,
    LiveJobListContainerComponent,
    LiveJobListComponent,
    EventFilterContainerComponent,
    LiveJobItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatChipsModule,
    MonacoEditorModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatBadgeModule,
    AngularSplitModule.forRoot(),
    ScrollingModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionWithinNgZone: true,
      }
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      EventEffects,
      LiveJobEffects
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
