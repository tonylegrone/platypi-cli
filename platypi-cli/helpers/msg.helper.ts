var colors = require('cmd-colors');

export var label = (labelMsg: string) => {
    var labelColor = new colors().magentaBright;
    process.stdout.write(labelColor(labelMsg) + '\n');
};

export var log = (logMsg: string) => {
    var logColor = new colors().greenBright;
    process.stdout.write(logColor(logMsg) + '\n');
};

export var error = (errorMsg: string) => {
    var errorcolor = new colors().red,
        msgcolor = new colors().magenta;
    process.stdout.write(errorcolor('Platypi-CLI Error: ') + msgcolor(errorMsg.toString()) + '\n');
};

export var warning = (warningMsg: string) => {
    var errorcolor = new colors().blue,
        msgcolor = new colors().magenta;

    process.stdout.write(errorcolor('Platypi-CLI Warning: ') + msgcolor(warningMsg.toString()) + '\n');
};
