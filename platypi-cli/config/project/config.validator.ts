/*
 * Determines if a platypi.json file is a valid config object.
 */
var isValid = (config: config.IPlatypi): boolean => {
    if (!config.type || config.type === '') {
        return false;
    }

    return true;
};

export = isValid;
