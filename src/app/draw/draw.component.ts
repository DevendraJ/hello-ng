import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, Injectable } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
@Injectable()
export class DrawComponent implements AfterContentInit {
  private bpmnJS: BpmnJS;
  private diagramUrl: string = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

  constructor(private http: HttpClient) {  }

  ngAfterContentInit(): void {
    this.bpmnJS = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties-panel'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
      ],
    });

    this.loadUrl(this.diagramUrl);
  }

  ngOnDestroy(): void {
    // this.bpmnJS.destroy();
  }

  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {

        },
        (err) => {

        }
      )
    );
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

}



