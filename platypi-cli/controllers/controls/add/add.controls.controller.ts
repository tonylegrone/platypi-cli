/// <reference path="../../../_references.d.ts" />
import ConfigFinder = require('../../config/project/config.finder');
import GeneratorHandler = require('../../handlers/generator.handler');
import Model = require('../../models/controls/controls.model');

class AddControlsController implements IController {
    public model;

    constructor(public view: IView, type: string, name: string, registeredName?: string) {
        this.model = new Model(type, name, registeredName);
    }

    create(): Thenable<string> {
        // TODO: get rid of finder constructor
        var finder = new ConfigFinder();
        return finder.findConfig().then((config) => {
            var generator = GeneratorHandler.getGenerator(this.model.type, this.model.name, this.model.registeredName, config.type);
            return generator.generate(config);
        });
    }

    getResponsaeView(): Thenable<IView> {
        return this.create().then((path) => {
           this.view.responseText = path;
           return this.view;
        }, (err) => {
            this.view.responseText = err;
            return this.view;
        });
    }
}

export = AddControlsController;
