/// <reference path="../../_references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base/base.viewcontrol');

class HomeViewControl extends BaseViewControl {
    templateUrl = this.getTemplateUrl(__filename);

    context = {};
}

plat.register.viewControl('home-viewcontrol', HomeViewControl, null, [
    '/'
]);

export = HomeViewControl;
