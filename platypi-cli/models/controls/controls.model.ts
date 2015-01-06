import ConfigFinder = require('../../config/project/config.finder');
import GeneratorHandler = require('../../handlers/generator.handler');

class ControlsModel {
    public type: string;
    public name: string;
    public registeredName: string;

    constructor(type: string, name: string, registeredName?: string) {
        this.type = type.toLowerCase().trim();
        this.name = name.trim();
        this.registeredName = (registeredName && registeredName !== '' ? registeredName.trim() : this.name);
    }

}

export = ControlsModel;
