import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { JobResume } from '../../models/job-resume';
import { LiveJobItemComponent } from './live-job-item.component';

describe('LiveJobItemComponent', () => {
    let spectator: SpectatorHost<LiveJobItemComponent>;
    let loader: HarnessLoader;
    let jobResume: JobResume;

    const createHostComponent = createHostFactory({
        component: LiveJobItemComponent,
        imports: [ReactiveFormsModule, BrowserAnimationsModule, MatInputModule, MatIconModule, MatSlideToggleModule, MatCardModule],
    });

    beforeEach(() => {
        spectator = createHostComponent(`<app-live-job-item [job]="job" (jobResume)="onResume($event)"></app-live-job-item>`, {
            hostProps: {
                onResume: ($event) => {
                    jobResume = $event;
                }
            }
        });
        loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    });

    it('inputs and buttons should be disabled until job is available', async () => {
        spectator.setHostInput({ job: { jobId: 'job1', unavailable: false } })
        const nextEventButton = await getNextEventButton();
        const conditionalBreakpointSlideToggle = await getConditionalBreakpointSlideToggle();
        await conditionalBreakpointSlideToggle.toggle();
        const conditionInput = await getConditionInput();
        expect(await nextEventButton.isDisabled()).toBeFalsy();
        expect(await conditionalBreakpointSlideToggle.isDisabled()).toBeFalsy();
        expect(await conditionInput.isDisabled()).toBeFalsy();

        spectator.setHostInput({ job: { jobId: 'job1', unavailable: true } })
        expect(await nextEventButton.isDisabled()).toBeTruthy();
        expect(await conditionalBreakpointSlideToggle.isDisabled()).toBeTruthy();
        expect(await conditionInput.isDisabled()).toBeTruthy();
    });

    it('should resume with provided by user condition if conditional break is turned on', async () => {
        spectator.setHostInput({ job: { jobId: 'job1', unavailable: false } })
        const conditionalBreakpointSlideToggle = await getConditionalBreakpointSlideToggle();
        await conditionalBreakpointSlideToggle.toggle();
        const conditionInput = await getConditionInput();
        await conditionInput.setValue('some condition');
        const nextEventButton = await getNextEventButton();
        await nextEventButton.click();
        expect(jobResume).toEqual<JobResume>({
            condition: 'some condition',
            jobId: 'job1'
        });
    });

    it('should resume without condition if conditional break is turned off', async () => {
        spectator.setHostInput({ job: { jobId: 'job1', unavailable: false } })
        const conditionalBreakpointSlideToggle = await getConditionalBreakpointSlideToggle();
        expect(await conditionalBreakpointSlideToggle.isChecked()).toBeFalsy();
        const nextEventButton = await getNextEventButton();
        await nextEventButton.click();
        expect(jobResume).toEqual<JobResume>({
            condition: null,
            jobId: 'job1'
        });
    });

    it('should be able to clear condition by button click', async () => {
        spectator.setHostInput({ job: { jobId: 'job1', unavailable: false } })
        const conditionalBreakpointSlideToggle = await getConditionalBreakpointSlideToggle();
        await conditionalBreakpointSlideToggle.toggle();
        const conditionInput = await getConditionInput();
        await conditionInput.setValue('some condition');
        const clearConditionButton = await getClearConditionInputButton();
        await clearConditionButton.click();
        expect(await conditionInput.getValue()).toEqual('');
    });

    async function getNextEventButton() {
        return (await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid=next-event-button]' })))[0];
    }

    async function getClearConditionInputButton() {
        return (await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid=clear-condition-button]' })))[0];
    }

    async function getConditionalBreakpointSlideToggle() {
        return (await loader.getAllHarnesses(MatSlideToggleHarness.with({ selector: '[data-testid=conditionalBreak-slide-toggle]' })))[0];
    }

    async function getConditionInput() {
        return (await loader.getAllHarnesses(MatInputHarness.with({ selector: '[data-testid=condition-input]' })))[0];
    }
});