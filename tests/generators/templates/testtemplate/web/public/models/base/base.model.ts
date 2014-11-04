/// <reference path="../../_references.d.ts" />

import plat = require('platypus');

class BaseFactory<PM extends models.IBaseModel, SM extends server.models.IBaseModel> {
    utils = plat.acquire(plat.IUtils);

    all(data: Array<SM>): Array<PM> {
        if (!this.utils.isArray(data)) {
            data = [];
        }

        return this.utils.map(data, (value) => {
            return this.create(value);
        });
    }

    create(data: SM): PM;
    create(data: PM, forServer: boolean): SM;
    create(data: any, forServer?: boolean): any {
        if (!this.utils.isObject(data)) {
            return data;
        }

        if (this.utils.isBoolean(forServer) && forServer) {
            return this.createForServer(data);
        }

        return this.createForClient(data);
    }

    update(data: PM): SM {
        return this.create(data, true);
    }

    createForServer(data: PM): SM {
        return <any>{
            id: data.id
        };
    }

    createForClient(data: SM): PM {
        return <any>{
            id: data.id
        };
    }
}

export = BaseFactory;
