import { PaletteProviderInterface } from "./customization_interface";
import { assign } from 'min-dash';

export default class CustomPaletteProvider implements PaletteProviderInterface {

    static $inject = [
        'palette',
        'translate',
        'elementFactory',
        'create'
    ]

    constructor(private palette, private translate, private elementFactory, private create) {
        palette.registerProvider(this);
    }

    getPaletteEntries(element: any) {
        let translate = this.translate;
        let elementFactory = this.elementFactory;
        let create = this.create;

        function createServiceTask(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
            create.start(event, shape);
        }

        return function (entries) {
            delete entries['hand-tool']
            delete entries['lasso-tool']
            delete entries['global-connect-tool']
            delete entries['tool-separator']

            assign(entries, {
                'create.service-task': {
                    group: 'activity',
                    className: 'bpmn-icon-service-task',
                    title: translate('Create ServiceTask'),
                    action: {
                        dragstart: createServiceTask,
                        click: createServiceTask
                    }
                }
            })

            return entries;
        }
    }

}