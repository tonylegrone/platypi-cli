import fs = require('fs');
import promises = require('es6-promise');

var Promise = promises.Promise;

export var writeFile = (filename: string, data: any): Thenable<string> => {
    return asyncCall((resolver) => {
        fs.writeFile(filename, data, resolver);
    });
};

export var readFile = (filename: string, options?: { encoding?: string; flag?: string; }): Thenable<any> => {
    return asyncCall((resolver) => {
        fs.readFile(filename, options, resolver);
    });
};

export var deleteFile = (location: string): Thenable<any> => {
    return asyncCall((resolver) => {
        fs.unlink(location, resolver);
    });
};

export var appendFIle = (location: string, data: string): Thenable<any> => {
    return asyncCall((resolver) => {
        fs.appendFile(location, data, resolver);
    });
};

export var appendFileAt = (location: string, index: number, toAppend: string): Thenable<any> => {
    return readFile(location, { encoding = 'utf8' }).then((data: string) => {
        var newData = data.substring(0, index) + toAppend + data.substring(index, data.length);
        return writeFile(location, newData);
    });
};

export var stat = (location: string): Thenable<fs.Stats> => {
    return asyncCall((resolver) => {
        fs.stat(location, resolver);
    });
};

export var readdir = (path: string): Thenable<Array<string>> => {
    return asyncCall((resolver) => {
        fs.readdir(path, resolver);
    });
};

export var mkdir = (path: string, mode?: any) => {
    if (!mode) {
        mode = parseInt('0777', 8) & (~process.umask());
    }

    return asyncCall((resolver) => {
        fs.mkdir(path, mode, resolver);
    });
};

function asyncCall(method: (resolver: (err: NodeJS.ErrnoException, data?: any) => void) => void) {
    return new Promise((resolve, reject) => {
        method(resolver(resolve, reject));
    });
}

function resolver(resolve: (data?: any) => void, reject: (err?: any) => void) {
    return (err: NodeJS.ErrnoException, data?: any) => {
        if (err) {
            return reject(err);
        }

        resolve(data);
    };
}
