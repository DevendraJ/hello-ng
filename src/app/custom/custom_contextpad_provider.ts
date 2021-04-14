import { ContextpadProviderInterface } from "./customization_interface";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { assign } from 'min-dash';

export default class CustomContextpadProvider implements ContextpadProviderInterface {

    static $inject = [
        'config',
        'contextPad',
        'create',
        'elementFactory',
        'injector',
        'translate',
        'connect'
    ];

    constructor(private config, contextPad, private create,
        private elementFactory, private injector, private translate, private connect) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        if (element.type === 'label') {
            return {};
        }

        let connect = this.connect;
        let businessObject = element.businessObject;
        let actions = {};

        if (isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference'
        ])) {
            assign(actions, {
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: this.translate('Connect using DataInputAssociation'),
                    action: {
                        click: function(event, element) {
                            connect.start(event, element);
                        },
                        dragstart: function(event, element) {
                            connect.start(event, element);
                        }
                    }
                }
            });
        }

        return actions;
    }

}