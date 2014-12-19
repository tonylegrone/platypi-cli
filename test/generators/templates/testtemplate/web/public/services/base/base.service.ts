/// <reference path="../../_references.d.ts" />

import plat = require('platypus');

class BaseService<SM extends server.models.IBaseModel> {
    http = plat.acquire(plat.async.IHttp);
    Promise = plat.acquire(plat.async.IPromise);
    utils = plat.acquire(plat.IUtils);

    host: string;
    baseRoute: string;

    constructor(host?: string, baseRoute?: string) {
        if (!this.utils.isString(host)) {
            host = '';
        }

        if (host[0] === '/') {
            host = host.substr(1);
        }

        if (host.length > 0 && host[host.length - 1] !== '/') {
            host = host + '/';
        }

        if (!this.utils.isString(baseRoute)) {
            baseRoute = '';
        }

        if (baseRoute[0] === '/') {
            baseRoute = baseRoute.substr(1);
        }

        this.host = host;
        this.baseRoute = baseRoute;
    }

    create(data: SM, contentType?: string): plat.async.IThenable<string> {
        return this._post<string>({
            contentType: contentType || this.http.contentType.JSON,
            data: data
        });
    }

    all(): plat.async.IThenable<Array<SM>> {
        return this._get<Array<SM>>();
    }

    read(id: string): plat.async.IThenable<SM> {
        return this._get<SM>(id);
    }

    update(data: SM, contentType?: string): plat.async.IThenable<boolean> {
        return this._put<boolean>({
            contentType: contentType || this.http.contentType.JSON,
            data: data
        }, data.id);
    }

    destroy(id: string): plat.async.IThenable<void> {
        return this._delete<void>(id);
    }

    _get<T>(...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _get<T>(...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _get<T>(options?: ajax.IHttpConfig, ...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _get<T>(options?: ajax.IHttpConfig, ...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _get<T>(options?: any, ...urlParams: Array<any>): plat.async.IAjaxThenable<T> {
        return this._do<T>('GET', options, urlParams);
    }

    _put<T>(...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _put<T>(...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _put<T>(options?: ajax.IHttpConfig, ...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _put<T>(options?: ajax.IHttpConfig, ...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _put<T>(options?: any, ...urlParams: Array<any>): plat.async.IAjaxThenable<T> {
        return this._do<T>('PUT', options, urlParams);
    }

    _post<T>(...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _post<T>(...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _post<T>(options?: ajax.IHttpConfig, ...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _post<T>(options?: ajax.IHttpConfig, ...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _post<T>(options?: any, ...urlParams: Array<any>): plat.async.IAjaxThenable<T> {
        return this._do<T>('POST', options, urlParams);
    }

    _delete<T>(...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _delete<T>(...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _delete<T>(options?: ajax.IHttpConfig, ...urlParams: Array<string>): plat.async.IAjaxThenable<T>;
    _delete<T>(options?: ajax.IHttpConfig, ...urlParams: Array<number>): plat.async.IAjaxThenable<T>;
    _delete<T>(options?: any, ...urlParams: Array<any>): plat.async.IAjaxThenable<T> {
        return this._do<T>('DELETE', options, urlParams);
    }

    _do<T>(method: string, urlParam?: string, urlParams?: Array<string>): plat.async.IAjaxThenable<T>;
    _do<T>(method: string, options?: ajax.IHttpConfig, urlParams?: Array<string>): plat.async.IAjaxThenable<T>;
    _do<T>(method: string, options?: any, urlParams: Array<string> = []): plat.async.IAjaxThenable<T> {
        if (!this.utils.isObject(options)) {
            if (!this.utils.isUndefined(options)) {
                urlParams.unshift(options);
            }

            options = {};
        }

        return this._json<T>(this.utils.extend({
            url: this._buildUrl.apply(this, urlParams),
            method: method
        }, options));
    }

    _json<T>(options: plat.async.IHttpConfig): plat.async.IAjaxThenable<T> {
        return this.http.json<ajax.IResponseBody>(options).then((result) => {
            return result.response.data;
        }, (result) => {
            this._handleError(result.response);
        });
    }

    _handleError(response: ajax.IResponseBody) {
        switch (response.status) {
            case 'fail':
                throw response.data;
            case 'error':
                console.log(response.message);
                break;
        }
    }

    /**
     * Builds a url with the arguments joined with '/'
     */
    _buildUrl(...args: Array<any>) {
        var url = this.host + this.baseRoute;

        this.utils.forEach(args, (path) => {
            if (path[0] === '?' || path[0] === '&') {
                url += path;
                return;
            }

            url += '/' + path;
        });

        return url;
    }
}

export = BaseService;
