/*!
Marksmith 0.4.8.pre
*/
var ListContinuationController = (function () {
    'use strict';

    /*
    Stimulus 3.2.1
    Copyright © 2023 Basecamp, LLC
     */

    function camelize(value) {
        return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
    }
    function namespaceCamelize(value) {
        return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
    }
    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    function dasherize(value) {
        return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
    }

    function isSomething(object) {
        return object !== null && object !== undefined;
    }
    function hasProperty(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }

    function readInheritableStaticArrayValues(constructor, propertyName) {
        const ancestors = getAncestorsForConstructor(constructor);
        return Array.from(ancestors.reduce((values, constructor) => {
            getOwnStaticArrayValues(constructor, propertyName).forEach((name) => values.add(name));
            return values;
        }, new Set()));
    }
    function readInheritableStaticObjectPairs(constructor, propertyName) {
        const ancestors = getAncestorsForConstructor(constructor);
        return ancestors.reduce((pairs, constructor) => {
            pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
            return pairs;
        }, []);
    }
    function getAncestorsForConstructor(constructor) {
        const ancestors = [];
        while (constructor) {
            ancestors.push(constructor);
            constructor = Object.getPrototypeOf(constructor);
        }
        return ancestors.reverse();
    }
    function getOwnStaticArrayValues(constructor, propertyName) {
        const definition = constructor[propertyName];
        return Array.isArray(definition) ? definition : [];
    }
    function getOwnStaticObjectPairs(constructor, propertyName) {
        const definition = constructor[propertyName];
        return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
    }
    (() => {
        function extendWithReflect(constructor) {
            function extended() {
                return Reflect.construct(constructor, arguments, new.target);
            }
            extended.prototype = Object.create(constructor.prototype, {
                constructor: { value: extended },
            });
            Reflect.setPrototypeOf(extended, constructor);
            return extended;
        }
        function testReflectExtension() {
            const a = function () {
                this.a.call(this);
            };
            const b = extendWithReflect(a);
            b.prototype.a = function () { };
            return new b();
        }
        try {
            testReflectExtension();
            return extendWithReflect;
        }
        catch (error) {
            return (constructor) => class extended extends constructor {
            };
        }
    })();

    ({
        controllerAttribute: "data-controller",
        actionAttribute: "data-action",
        targetAttribute: "data-target",
        targetAttributeForScope: (identifier) => `data-${identifier}-target`,
        outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
        keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n]))),
    });
    function objectFromEntries(array) {
        return array.reduce((memo, [k, v]) => (Object.assign(Object.assign({}, memo), { [k]: v })), {});
    }

    function ClassPropertiesBlessing(constructor) {
        const classes = readInheritableStaticArrayValues(constructor, "classes");
        return classes.reduce((properties, classDefinition) => {
            return Object.assign(properties, propertiesForClassDefinition(classDefinition));
        }, {});
    }
    function propertiesForClassDefinition(key) {
        return {
            [`${key}Class`]: {
                get() {
                    const { classes } = this;
                    if (classes.has(key)) {
                        return classes.get(key);
                    }
                    else {
                        const attribute = classes.getAttributeName(key);
                        throw new Error(`Missing attribute "${attribute}"`);
                    }
                },
            },
            [`${key}Classes`]: {
                get() {
                    return this.classes.getAll(key);
                },
            },
            [`has${capitalize(key)}Class`]: {
                get() {
                    return this.classes.has(key);
                },
            },
        };
    }

    function OutletPropertiesBlessing(constructor) {
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        return outlets.reduce((properties, outletDefinition) => {
            return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
        }, {});
    }
    function getOutletController(controller, element, identifier) {
        return controller.application.getControllerForElementAndIdentifier(element, identifier);
    }
    function getControllerAndEnsureConnectedScope(controller, element, outletName) {
        let outletController = getOutletController(controller, element, outletName);
        if (outletController)
            return outletController;
        controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
        outletController = getOutletController(controller, element, outletName);
        if (outletController)
            return outletController;
    }
    function propertiesForOutletDefinition(name) {
        const camelizedName = namespaceCamelize(name);
        return {
            [`${camelizedName}Outlet`]: {
                get() {
                    const outletElement = this.outlets.find(name);
                    const selector = this.outlets.getSelectorForOutletName(name);
                    if (outletElement) {
                        const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                        if (outletController)
                            return outletController;
                        throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
                    }
                    throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
                },
            },
            [`${camelizedName}Outlets`]: {
                get() {
                    const outlets = this.outlets.findAll(name);
                    if (outlets.length > 0) {
                        return outlets
                            .map((outletElement) => {
                            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
                            if (outletController)
                                return outletController;
                            console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
                        })
                            .filter((controller) => controller);
                    }
                    return [];
                },
            },
            [`${camelizedName}OutletElement`]: {
                get() {
                    const outletElement = this.outlets.find(name);
                    const selector = this.outlets.getSelectorForOutletName(name);
                    if (outletElement) {
                        return outletElement;
                    }
                    else {
                        throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
                    }
                },
            },
            [`${camelizedName}OutletElements`]: {
                get() {
                    return this.outlets.findAll(name);
                },
            },
            [`has${capitalize(camelizedName)}Outlet`]: {
                get() {
                    return this.outlets.has(name);
                },
            },
        };
    }

    function TargetPropertiesBlessing(constructor) {
        const targets = readInheritableStaticArrayValues(constructor, "targets");
        return targets.reduce((properties, targetDefinition) => {
            return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
        }, {});
    }
    function propertiesForTargetDefinition(name) {
        return {
            [`${name}Target`]: {
                get() {
                    const target = this.targets.find(name);
                    if (target) {
                        return target;
                    }
                    else {
                        throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                    }
                },
            },
            [`${name}Targets`]: {
                get() {
                    return this.targets.findAll(name);
                },
            },
            [`has${capitalize(name)}Target`]: {
                get() {
                    return this.targets.has(name);
                },
            },
        };
    }

    function ValuePropertiesBlessing(constructor) {
        const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
        const propertyDescriptorMap = {
            valueDescriptorMap: {
                get() {
                    return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                        const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                        const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                        return Object.assign(result, { [attributeName]: valueDescriptor });
                    }, {});
                },
            },
        };
        return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
            return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
        }, propertyDescriptorMap);
    }
    function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
        const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
        const { key, name, reader: read, writer: write } = definition;
        return {
            [name]: {
                get() {
                    const value = this.data.get(key);
                    if (value !== null) {
                        return read(value);
                    }
                    else {
                        return definition.defaultValue;
                    }
                },
                set(value) {
                    if (value === undefined) {
                        this.data.delete(key);
                    }
                    else {
                        this.data.set(key, write(value));
                    }
                },
            },
            [`has${capitalize(name)}`]: {
                get() {
                    return this.data.has(key) || definition.hasCustomDefaultValue;
                },
            },
        };
    }
    function parseValueDefinitionPair([token, typeDefinition], controller) {
        return valueDescriptorForTokenAndTypeDefinition({
            controller,
            token,
            typeDefinition,
        });
    }
    function parseValueTypeConstant(constant) {
        switch (constant) {
            case Array:
                return "array";
            case Boolean:
                return "boolean";
            case Number:
                return "number";
            case Object:
                return "object";
            case String:
                return "string";
        }
    }
    function parseValueTypeDefault(defaultValue) {
        switch (typeof defaultValue) {
            case "boolean":
                return "boolean";
            case "number":
                return "number";
            case "string":
                return "string";
        }
        if (Array.isArray(defaultValue))
            return "array";
        if (Object.prototype.toString.call(defaultValue) === "[object Object]")
            return "object";
    }
    function parseValueTypeObject(payload) {
        const { controller, token, typeObject } = payload;
        const hasType = isSomething(typeObject.type);
        const hasDefault = isSomething(typeObject.default);
        const fullObject = hasType && hasDefault;
        const onlyType = hasType && !hasDefault;
        const onlyDefault = !hasType && hasDefault;
        const typeFromObject = parseValueTypeConstant(typeObject.type);
        const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
        if (onlyType)
            return typeFromObject;
        if (onlyDefault)
            return typeFromDefaultValue;
        if (typeFromObject !== typeFromDefaultValue) {
            const propertyPath = controller ? `${controller}.${token}` : token;
            throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
        }
        if (fullObject)
            return typeFromObject;
    }
    function parseValueTypeDefinition(payload) {
        const { controller, token, typeDefinition } = payload;
        const typeObject = { controller, token, typeObject: typeDefinition };
        const typeFromObject = parseValueTypeObject(typeObject);
        const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
        const typeFromConstant = parseValueTypeConstant(typeDefinition);
        const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
        if (type)
            return type;
        const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
        throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
    }
    function defaultValueForDefinition(typeDefinition) {
        const constant = parseValueTypeConstant(typeDefinition);
        if (constant)
            return defaultValuesByType[constant];
        const hasDefault = hasProperty(typeDefinition, "default");
        const hasType = hasProperty(typeDefinition, "type");
        const typeObject = typeDefinition;
        if (hasDefault)
            return typeObject.default;
        if (hasType) {
            const { type } = typeObject;
            const constantFromType = parseValueTypeConstant(type);
            if (constantFromType)
                return defaultValuesByType[constantFromType];
        }
        return typeDefinition;
    }
    function valueDescriptorForTokenAndTypeDefinition(payload) {
        const { token, typeDefinition } = payload;
        const key = `${dasherize(token)}-value`;
        const type = parseValueTypeDefinition(payload);
        return {
            type,
            key,
            name: camelize(key),
            get defaultValue() {
                return defaultValueForDefinition(typeDefinition);
            },
            get hasCustomDefaultValue() {
                return parseValueTypeDefault(typeDefinition) !== undefined;
            },
            reader: readers[type],
            writer: writers[type] || writers.default,
        };
    }
    const defaultValuesByType = {
        get array() {
            return [];
        },
        boolean: false,
        number: 0,
        get object() {
            return {};
        },
        string: "",
    };
    const readers = {
        array(value) {
            const array = JSON.parse(value);
            if (!Array.isArray(array)) {
                throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
            }
            return array;
        },
        boolean(value) {
            return !(value == "0" || String(value).toLowerCase() == "false");
        },
        number(value) {
            return Number(value.replace(/_/g, ""));
        },
        object(value) {
            const object = JSON.parse(value);
            if (object === null || typeof object != "object" || Array.isArray(object)) {
                throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
            }
            return object;
        },
        string(value) {
            return value;
        },
    };
    const writers = {
        default: writeString,
        array: writeJSON,
        object: writeJSON,
    };
    function writeJSON(value) {
        return JSON.stringify(value);
    }
    function writeString(value) {
        return `${value}`;
    }

    class Controller {
        constructor(context) {
            this.context = context;
        }
        static get shouldLoad() {
            return true;
        }
        static afterLoad(_identifier, _application) {
            return;
        }
        get application() {
            return this.context.application;
        }
        get scope() {
            return this.context.scope;
        }
        get element() {
            return this.scope.element;
        }
        get identifier() {
            return this.scope.identifier;
        }
        get targets() {
            return this.scope.targets;
        }
        get outlets() {
            return this.scope.outlets;
        }
        get classes() {
            return this.scope.classes;
        }
        get data() {
            return this.scope.data;
        }
        initialize() {
        }
        connect() {
        }
        disconnect() {
        }
        dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true, } = {}) {
            const type = prefix ? `${prefix}:${eventName}` : eventName;
            const event = new CustomEvent(type, { detail, bubbles, cancelable });
            target.dispatchEvent(event);
            return event;
        }
    }
    Controller.blessings = [
        ClassPropertiesBlessing,
        TargetPropertiesBlessing,
        ValuePropertiesBlessing,
        OutletPropertiesBlessing,
    ];
    Controller.targets = [];
    Controller.outlets = [];
    Controller.values = {};

    class list_continuation_controller extends Controller {
      connect() {
        this.isInsertLineBreak = false;
        this.isProcessing = false;  // Guard flag to prevent recursion

        this.SPACE_PATTERN = /^(\s*)?/;
        this.LIST_PATTERN = /^(\s*)([*-]|(\d+)\.)\s(\[[\sx]\]\s)?/;
      }

      handleBeforeInput(event) {
        if (this.isProcessing) return
        this.isInsertLineBreak = event.inputType === 'insertLineBreak';
      }

      handleInput(event) {
        if (this.isProcessing) return
        if (this.isInsertLineBreak || event.inputType === 'insertLineBreak') {
          this.handleListContinuation(event.target);
          this.isInsertLineBreak = false;
        }
      }

      handleListContinuation(textarea) {
        if (this.isProcessing) return

        const result = this.analyzeCurrentLine(
          textarea.value,
          [textarea.selectionStart, textarea.selectionEnd],
        );

        if (result !== undefined) {
          this.isProcessing = true;
          try {
            this.applyTextChange(textarea, result);
          } finally {
            // Ensure we always reset the processing flag
            setTimeout(() => {
              this.isProcessing = false;
            }, 0);
          }
        }
      }

      analyzeCurrentLine(text, [cursorPosition]) {
        if (!cursorPosition || !text) return

        // Get all lines up to cursor
        const lines = text.substring(0, cursorPosition).split('\n');
        const previousLine = lines[lines.length - 2];

        // If no previous line or doesn't match list pattern, do nothing
        const match = previousLine?.match(this.LIST_PATTERN);
        if (!match) return

        const [fullMatch, indentation, listMarker, number, checkbox] = match;

        // Check if previous line was empty (just list marker)
        const previousContent = previousLine.replace(fullMatch, '').trim();
        if (previousContent.length === 0) {
          // Terminate the list by removing the marker
          const start = cursorPosition - `\n${fullMatch}`.length;

          return {
            text: text.substring(0, start) + text.substring(cursorPosition),
            selection: [start, start],
            operation: 'delete',
          }
        }

        // For numbered lists, increment the number
        const newMarker = number ? `${parseInt(number, 10) + 1}.` : listMarker;

        // Maintain checkbox if it was present
        const prefix = `${indentation}${newMarker} ${checkbox ? '[ ] ' : ''}`;

        // Continue the list with the same indentation and style
        return {
          text: text.substring(0, cursorPosition) + prefix + text.substring(cursorPosition),
          selection: [cursorPosition + prefix.length, cursorPosition + prefix.length],
          operation: 'insert',
        }
      }

      applyTextChange(textarea, { text, selection }) {
        // Set new value directly
        textarea.value = text;
        // Set the cursor position
        const [start, end] = selection;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
      }
    }

    return list_continuation_controller;

})();
