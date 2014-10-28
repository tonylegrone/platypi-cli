var colors = require('cmd-colors');

export var error = (errorMsg: string) => {
    var errorcolor = new colors().red,
        msgcolor = new colors().magenta;

    process.stdout.write(errorcolor('\r\nPlatypi-CLI Error: ') + msgcolor(errorMsg));
};

export var warning = (warningMsg: string) => {
    var errorcolor = new colors().blue,
        msgcolor = new colors().magenta;

    process.stdout.write(errorcolor('\r\nPlatypi-CLI Warning: ') + msgcolor(warningMsg));
};
