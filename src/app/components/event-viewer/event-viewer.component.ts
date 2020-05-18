import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ViewerEvent } from '../../models/viewer-event';
import { TextFilterResult } from '../../models/text-filter-result';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-viewer',
  templateUrl: './event-viewer.component.html',
  styleUrls: ['./event-viewer.component.scss'],
})
export class EventViewerComponent implements OnInit, OnChanges {

  @Input() filterResult: TextFilterResult;
  @Input() isDarkTheme: boolean;

  editorOptions = { language: 'json', theme: 'vs-dark' };
  code: string;
  editor: monaco.editor.ICodeEditor;
  decorator: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterResult) {
      this.code = this.filterResult?.event?.eventArgumentsStringified;
    }
    if (changes.isDarkTheme) {
      this.editorOptions = { ...this.editorOptions, theme: this.isDarkTheme ? 'vs-dark' : null };
    }
    this.updateDeltaDecorations();
  }

  onInit(editor) {
    this.editor = editor;
    this.editor.getModel().onDidChangeContent(() => this.updateDeltaDecorations());
  }

  updateDeltaDecorations() {
    if (this.filterResult?.highlightedLines.length) {
      this.decorator = this.editor.deltaDecorations(this.decorator, this.filterResult.highlightedLines.map((x) => {
        return {
          range: new monaco.Range(x, 1, x, 1),
          options: {
            isWholeLine: true,
            className: 'found-editor-text-line',
          }
        };
      }));
      this.editor.revealLineInCenter(this.filterResult.highlightedLines[0]);

      return;
    }
    this.decorator = this.editor?.deltaDecorations(this.decorator, []) || [];
  }

}
