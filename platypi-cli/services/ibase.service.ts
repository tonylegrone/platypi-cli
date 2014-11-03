interface IBaseService {
    _get(host: string, path: string, authToken?: string): Thenable<any>;
    _downloadFile(url: string, savePath: string, authToken?: string): Thenable<any>;
    getRelease(version: string, savePath: string): Thenable<string>;
}
