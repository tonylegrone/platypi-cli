/// <reference path="../../_references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base/base.viewcontrol');

class %name%ViewControl extends BaseViewControl {
    /**
     * This is the property that indicates where the template HTML for this control exists.
     */
    templateUrl = this.getTemplateUrl(__filename);

    /**
     * The context variable on a control corresponds to what can be used 
     * for data binding in the view.
     */
    context = { };

    /**
     * This is the initialize event method for a control. In this method a control 
     * should initialize all the necessary variables. This method is typically only 
     * necessary for view controls. If a control does not implement plat.ui.IViewControl 
     * then it is not safe to access, observe, or modify the context property in this 
     * method. A view control should call services/set context in this method in order 
     * to fire the loaded event. No control will be loaded until the view control has 
     * specified a context.
     */
    initialize() { }

    /**
     * This event is fired after all of the child controls of this control have loaded.
     * Since this is a view control, setting its context kicks off the binding and loading 
     * phases.
     */
    loaded() { }

    /**
     * This event is fired when this control is navigated to directly using the 
     * navigator.navigate method on a view control. The parameter corresponds to 
     * an object sent from the previous view control during navigation.
     */
    navigatedTo(parameter) { }

    /**
     * This event is fired when you are navigating away from this view control to another 
     * view control.
     */
    navigatingFrom() { }

    /**
     * The dispose event is called when a control is being removed from memory. A control 
     * should release all of the memory it is using, including DOM event and property 
     * listeners.
     */
    dispose() { }
}

plat.register.viewControl('%registername%', %name%ViewControl);

export = %name%ViewControl;
