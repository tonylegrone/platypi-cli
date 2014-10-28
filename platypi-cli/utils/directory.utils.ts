import path = require('path');

/*
 * Returns the current working directory as an array of strings in order.
 * i.e. /path/to/home/ = ['', 'path', 'to', 'home']
 */
export var dirToArray = (directory?: string): Array<string> => {
    if (directory) {
        return path.normalize(directory).split(path.sep);
    }

    return process.cwd().split(path.sep);
};

/*
 * Returns the directory level above the current working directory as a string.
 */
export var upOneLevel = (directory?: string): string => {
    var c: Array<string> = dirToArray(directory);

    if (c.length > 1) {
        c.slice(0, c.length - 1);
    }

    return c.join(path.sep);
};
