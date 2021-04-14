import { assign } from 'min-dash';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default class ModifiedContextPadProvider {

    static $inject = [
        'config',
        'contextPad',
        'create',
        'elementFactory',
        'injector',
        'translate',
        'modeling',
        'rules'
    ];

    private autoPlace;

    constructor(
        private config, private contextPad, private create,
        private elementFactory, private injector, private translate,
        private modeling, private rules
    ) {
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }
        contextPad.registerProvider(this);
    }

    appendAction(type, className, title, options) {
        let elementFactory = this.elementFactory;
        let autoPlace = this.autoPlace;

        if (typeof title !== 'string') {
            // options = title;
            title = this.translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
        }

        function appendStart(event, element) {
            let shape = elementFactory.createShape(assign({ type: type }, options));
            this.create.start(event, shape, {
                source: element
            });
        }

        let append = autoPlace ? function (event, element) {
            let shape = elementFactory.createShape(assign({ type: type }, options));
            autoPlace.append(element, shape);
        } : appendStart;

        return {
            group: 'model',
            className: className,
            title: title,
            action: {
                dragstart: appendStart,
                click: append
            }
        };
    }

    getContextPadEntries(element) {
        let actions = {};
        let modeling = this.modeling;

        if (element.type === 'label') {
            return {};
        }

        let businessObject = element.businessObject;
        if (isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference'
        ])) {
            assign(actions, {
                'append.text-annotation': this.appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation', null, null)
            });
        }

        let deleteAllowed = this.rules.allowed('elements.delete', { elements: [element] });
        if (deleteAllowed) {
            assign(actions, {
                'delete': {
                    group: 'edit',
                    className: 'bpmn-icon-trash',
                    title: this.translate('Remove'),
                    action: {
                        click: function (e) {
                            modeling.removeElements([element]);
                        }
                    }
                }
            });
        }

        return actions;
    }

}