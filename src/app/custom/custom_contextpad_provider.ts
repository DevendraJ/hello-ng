import { ContextpadProviderInterface } from "./customization_interface";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { assign } from 'min-dash';

export default class CustomContextpadProvider implements ContextpadProviderInterface {

    static $inject = [
        'contextPad',
        'translate',
        'connect'
    ];

    constructor(private contextPad, private translate, private connect) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        // console.log(element.type)

        let connect = this.connect;
        let translate = this.translate;

        return function (entries) {

            delete entries['lane-insert-above']
            delete entries['lane-divide-two']
            delete entries['lane-divide-three']
            delete entries['lane-insert-below']
            delete entries['append.receive-task']
            delete entries['append.message-intermediate-event']
            delete entries['append.timer-intermediate-event']
            delete entries['append.condition-intermediate-event']
            delete entries['append.signal-intermediate-event']
            delete entries['append.compensation-activity']
            delete entries['append.end-event']
            delete entries['append.gateway']
            delete entries['append.append-task']
            delete entries['append.intermediate-event']
            delete entries['replace']
            delete entries['append.text-annotation']
            delete entries['connect']

            if (element.type !== 'label') {
                let businessObject = element.businessObject
                if (isAny(businessObject, [
                    'bpmn:FlowNode',
                    'bpmn:InteractionNode',
                    'bpmn:DataObjectReference',
                    'bpmn:DataStoreReference'
                ])) {

                    assign(entries, {
                        'connect': {
                            group: 'connect',
                            className: 'bpmn-icon-connection-multi',
                            title: translate('Connect using DataInputAssociation'),
                            action: {
                                click: function (event, element) {
                                    connect.start(event, element);
                                },
                                dragstart: function (event, element) {
                                    connect.start(event, element);
                                }
                            }
                        }
                    });
                }
            }

            return entries;
        }
    }

}