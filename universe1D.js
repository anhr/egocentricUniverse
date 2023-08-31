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

const sUniverse1D = 'Universe1D';

class Universe1D extends Universe {

	//base methods

	get probabilityDensity(){
		
		return {

			sectorValue: (probabilityDensity, i) => {
				
				//Длинна дуги сегмента по формуле Гюйгенса
				//https://mnogoformul.ru/dlina-dugi#:~:text=%D0%94%D0%BB%D0%B8%D0%BD%D0%B0%20%D0%B4%D1%83%D0%B3%D0%B8%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%B9%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D1%80%D0%B0%D0%B2%D0%BD%D0%B0,%2C%20%D0%B3%D0%B4%D0%B5%20r%20%2D%20%D1%80%D0%B0%D0%B4%D0%B8%D1%83%D1%81%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8.
				const sector = probabilityDensity[i], r = probabilityDensity.options.r, hb = sector.hb, ht = sector.ht,
					arcLength = (hb) => {

					const M = Math.sqrt(r * r - hb * hb) * 2,
						abs = r - Math.abs(hb),
//						abs = r - hb,
						m = Math.sqrt((M * M) / 4 + abs * abs);
					return 2 * m + ((2 * m - M) / 3);
					
				}
				sector.arcLength = Math.abs(arcLength(hb) - arcLength(ht));

				return sector.arcLength;
				
			},
			
		}
		
	}
	
	pushEdges() {

		const geometry = this.classSettings.settings.object.geometry, edges = geometry.indices.edges, position = geometry.position;
		for (let verticeId = 1; verticeId < position.length; verticeId++) edges.push();
		edges.push([position.length - 1, 0]);
		
		if (this.classSettings.debug) console.log('time: Push edges. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');
		
	}
	name(getLanguageCode) {

		//Localization
		
		const lang = {

			name: "1D universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Одномерная вселенная';

				break;
			/*guiParams is undefined
			default://Custom language
				if ((guiParams.lang === undefined) || (guiParams.lang.languageCode != _languageCode))
					break;

				Object.keys(guiParams.lang).forEach((key) => {

					if (lang[key] === undefined)
						return;
					lang[key] = guiParams.lang[key];

				});
			*/

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
	TestVerticeEdges(vertice){ return vertice.length === this.verticeEdgesLengthMax ? true : false; }
	get dimension() { return 2; }//space dimension
	get verticesCountMin() { return 3; }

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
