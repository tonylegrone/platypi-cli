/*
 * Determines if a platypi.json file is a valid config object.
 */
var isValid = (config: config.IPlatypi): boolean => {

    if (!config.name || config.name === '') {
        return false;
    }

    if (!config.type || config.type === '') {
        return false;
    }

    if (!config.author || config.author === '') {
        return false;
    }

    return true;
};

export = isValid;
