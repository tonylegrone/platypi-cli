/// <reference path='../_references.d.ts' />

import plat = require('platypus');

export class App extends plat.App {
    /**
     * Class for every app. This class contains hooks for Application Lifecycle Events
     * as well as error handling and device-events.
     */
    constructor() {
        super();
    }

    /**
     * Event fired when the app is ready. This method can be used to 
     * configure various settings prior to loading the rest of the application
     * 
     * @param ev The ILifecycleEvent object.
     */
    ready(ev: plat.events.ILifecycleEvent) { }

    /**
     * Event fired when an internal error occurs.
     * 
     * @param ev The IErrorEvent object.
     */
    error(ev: plat.events.IErrorEvent<Error>) {
        // log or handle errors at a global level
        console.log(ev.error);
    }

    /**
     * Event fired when the app is suspended. If running on a device, 
     * this is where you want to save important data and finish ongoing processes.
     * 
     * @param ev The ILifecycleEvent object.
     */
    suspend(ev: plat.events.ILifecycleEvent) { }

    /**
     * Event fired when the app resumes from the suspended state. If running on a device,
     * this is where you want to re-initialize the app state. This is called only when the app was 
     * previously suspended.
     * 
     * @param ev The ILifecycleEvent object.
     */
    resume(ev: plat.events.ILifecycleEvent) { }

    /**
     * Event fired when the device regains connectivity and is now in an online state.
     * 
     * @param ev The ILifecycleEvent object.
     */
    online(ev: plat.events.ILifecycleEvent) { }

    /**
     * Event fired when the device loses connectivity and is now in an offline state.
     * 
     * @param ev The ILifecycleEvent object.
     */
    offline(ev: plat.events.ILifecycleEvent) { }
}

plat.register.app('%name%', App);
