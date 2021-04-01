import { assign } from 'min-dash';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default class CustomContextPadProvider {

    constructor(config, contextPad, create, elementFactory, injector, translate, modeling, rules) {
        this.create = create;
        this._elementFactory = elementFactory;
        this._translate = translate;
        this.contextPad = contextPad;
        this._modeling = modeling;
        this.rules = rules;

        if (config.autoPlace !== false) {
            this._autoPlace = injector.get('autoPlace', false);
        }
        contextPad.registerProvider(this);
    }


    getContextPadEntries(element) {

        var actions = {};
        var modeling = this._modeling;
        var translate = this._translate;
        var autoPlace = this._autoPlace
        var elementFactory = this._elementFactory;

        function appendAction(type, className, title, options) {
            if (typeof title !== 'string') {
                options = title;
                title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
            }

            function appendStart(event, element) {
                var shape = elementFactory.createShape(assign({ type: type }, options));
                create.start(event, shape, {
                    source: element
                });
            }

            var append = autoPlace ? function (event, element) {
                var shape = elementFactory.createShape(assign({ type: type }, options));
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

        if (element.type === 'label') {
            return {};
        }

        var businessObject = element.businessObject;
        if (isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference'
          ])) {
            assign(actions, {
                'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation')
            });
        }

        function removeElement(e) {
            modeling.removeElements([element]);
        }

        var deleteAllowed = this.rules.allowed('elements.delete', { elements: [element] });
        if (deleteAllowed) {
            assign(actions, {
                'delete': {
                    group: 'edit',
                    className: 'bpmn-icon-trash',
                    title: translate('Remove'),
                    action: {
                        click: removeElement
                    }
                }
            });
        }

        return actions;
    }

}


CustomContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate',
    'modeling',
    'rules'
];