import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { EventFilter } from '../../models/event-filter';
import { EventFilterComponent } from './event-filter.component';

describe('EventFilterComponent', () => {
  let spectator: SpectatorHost<EventFilterComponent>;
  let loader: HarnessLoader;
  let appliedFilter: EventFilter;

  const createHostComponent = createHostFactory({
    component: EventFilterComponent,
    imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatIconModule, BrowserAnimationsModule],
  });

  beforeEach(() => {
    spectator = createHostComponent(`<app-event-filter [eventTypes]="eventTypes" [jobIds]="jobIds" (applyFilter)="onApplyFilter($event)"></app-event-filter>`, {
      hostProps: {
        onApplyFilter: ($event) => {
          appliedFilter = $event;
        },
        eventTypes: [],
        jobIds: [],
      }
    });
    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  });

  it('clear buttons should be hidden by default', async () => {
    expect(await getTextInputClearButton()).not.toExist();
    expect(await getJobIdsClearButton()).not.toExist();
    expect(await getEventTypesClearButton()).not.toExist();
  });

  it('should correctly handle text input', async () => {
    const textInput = await getTextInput();
    await textInput.setValue('hello, world');
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: [], jobIds: [], text: 'hello, world' });
    const textInputClearButton = await getTextInputClearButton();
    await textInputClearButton.click();
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: [], jobIds: [], text: null });
  });

  it('should correctly handle eventTypes select', async () => {
    spectator.setHostInput({ eventTypes: ['eventType1', 'eventType2'] });
    const eventTypesSelect = await getJobTypesSelect();
    await eventTypesSelect.open();
    const eventTypesOptions = await eventTypesSelect.getOptions({ text: 'eventType1' });
    await eventTypesOptions[0].click();
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: ['eventType1'], jobIds: [], text: null });
    const eventTypesClearButton = await getEventTypesClearButton();
    await eventTypesClearButton.click();
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: [], jobIds: [], text: null });
  });

  it('should correctly handle jobIds select', async () => {
    spectator.setHostInput({ jobIds: ['job1', 'job2'] });
    const jobIdsSelect = await getJobIdsSelect();
    await jobIdsSelect.open();
    const options = await jobIdsSelect.getOptions({ text: 'job1' });
    await options[0].click();
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: [], jobIds: ['job1'], text: null });
    const jobIdsClearButton = await getJobIdsClearButton();
    await jobIdsClearButton.click();
    expect(appliedFilter).toEqual<EventFilter>({ eventTypes: [], jobIds: [], text: null });
  });

  async function getTextInputClearButton() {
    return (await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid=text-input-clear-button]' })))[0];
  }

  async function getJobIdsClearButton() {
    return (await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid=jobIds-clear-button]' })))[0];
  }

  async function getEventTypesClearButton() {
    return (await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid=eventTypes-clear-button]' })))[0];
  }

  async function getTextInput() {
    return (await loader.getAllHarnesses(MatInputHarness.with({ selector: '[data-testid=text-input]' })))[0];
  }

  async function getJobIdsSelect() {
    return (await loader.getAllHarnesses(MatSelectHarness.with({ selector: '[data-testid=jobIds-select]' })))[0];
  }

  async function getJobTypesSelect() {
    return (await loader.getAllHarnesses(MatSelectHarness.with({ selector: '[data-testid=eventTypes-select]' })))[0];
  }
});