/**
 * This is the entry-point for Browserify. This file can maintain references to all your 
 * custom controls, injectables, and other files that won't necessarily be loaded from files
 * included in this file.
 */

// polyfills
require('./polyfills');

// scripts
require('./scripts');

// app
require('./app/app');

// viewcontrols
require('./viewcontrols/home/home.viewcontrol');
