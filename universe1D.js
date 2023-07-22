/**
 * @module Universe1D
 * @description 1 dimensional universe.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/


import Universe from './universe.js';

class Universe1D extends Universe {

	//base methods
	
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "1D universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Одномерная вселенная';

				break;
			default://Custom language
				if ((guiParams.lang === undefined) || (guiParams.lang.languageCode != _languageCode))
					break;

				Object.keys(guiParams.lang).forEach((key) => {

					if (lang[key] === undefined)
						return;
					lang[key] = guiParams.lang[key];

				});

		}
		return lang.name;
		
	}
/*
	Indices() {

		const settings = this.classSettings.settings,
			debug = this.classSettings.debug;//_this = this, 

	}
*/
	logUniverse1D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
//		this.classSettings.settings.object.geometry.indices.bodies.forEach((body, i) => console.log('indices.bodies[' + i + '] = ' + JSON.stringify( body )));
		
	}

//	project(scene) { }

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 2 ребра
	get dimension() { return 2; }//space dimension

	/**
	 * 1 dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe1D</b> class settings. See <a href="./module-Universe-Universe.html" target="_blank">Universe classSettings</a>.
	 **/
	constructor(options, classSettings) {

		super(options, classSettings);
		this.logUniverse1D();

	}

}
export default Universe1D;
