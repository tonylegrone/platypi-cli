/// <reference path="../../_references.d.ts" />

import plat = require('platypus');

import BaseFactory = require('../../models/base/base.model');
import BaseService = require('../../services/base/base.service');

class BaseRepository<PM extends models.IBaseModel, SM extends server.models.IBaseModel> {
    Promise = plat.acquire(plat.async.IPromise);
    utils = plat.acquire(plat.IUtils);

    constructor(public Factory: BaseFactory<PM, SM>, public service: BaseService<SM>) {

    }

    create(model: PM): plat.async.IThenable<PM> {
        var m = this.Factory.create(model, true);

        return this.service.create(m).then((id: string) => {
            model.id = id;
            return model;
        });
    }

    all(): plat.async.IThenable<Array<PM>> {
        return this.service.all().then((results: Array<SM>) => {
            return this.Factory.all(results);
        });
    }

    read(id: string): plat.async.IThenable<PM> {
        if (!this.utils.isString(id)) {
            return this.Promise.resolve(null);
        }

        return this.service.read(id).then((result: SM) => {
            return this.Factory.create(result);
        });
    }

    update(model: PM): plat.async.IThenable<boolean> {
        var m = this.Factory.update(model);
        return this.service.update(m);
    }

    destroy(id: string): plat.async.IThenable<void> {
        if (!this.utils.isString(id)) {
            return this.Promise.resolve(null);
        }

        return this.service.destroy(id);
    }
}

export = BaseRepository;
