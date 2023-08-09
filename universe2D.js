/**
 * @module Universe2D
 * @description 2 dimensional universe.
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

class Universe2D extends Universe {

	//base methods
	
	pushEdges() {

		const geometry = this.classSettings.settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
		
		//Every vertice have max 6 edges
		for (let verticeId = 1; verticeId < position.length; verticeId++)
			edges.push();
		edges.push([position.length - 1, 0]);
		for (let i = 2; i < 4; i++) {

			for (let verticeId = 0; verticeId < position.length; verticeId++){

				
				let verticeIdOpposite = edges[position.length * (i - 2) + verticeId][1] + 1;
//				let verticeIdOpposite = verticeId + i;
				if (verticeIdOpposite >= position.length) verticeIdOpposite = 0;
				edges.push([verticeId, verticeIdOpposite]);
				switch(position.length){

					case 4://tetraedr
						if (edges.length >=6) return;
						break;
					case 6:
						if (edges.length >=15) return;
						break;
						
				}

			}
			
		}
/*		
		for (let i = 1; i < 7; i++) {
			
			for (let verticeId = (i - 1); verticeId < position.length; verticeId++){
	
//				const verticeIdOpposite = verticeId + i;
				const edge = edges[verticeId];
				const verticeIdOpposite = edge ? edge[1] + 1 : verticeId + i;
				if (verticeIdOpposite < position.length) edges.push([verticeId, verticeIdOpposite]);
				else {

					edges.push([verticeIdOpposite - 1, 0]);
					break;

				}
	
			}
			console.log('')
				
		}
*/		
/*
		for (let verticeId = 0; verticeId < (position.length - 1); verticeId++){

			//Every vertice have max 6 edges
			for (let i = 1; i < (7 - verticeId); i++) {
				
				const verticeIdOpposite = verticeId + i;
				if (verticeIdOpposite < position.length) edges.push([verticeId, verticeIdOpposite]);
				else break;

			}
			
		}
*/		
/*		
		for (let verticeId = 1; verticeId < position.length; verticeId++)
			edges.push();
		edges.push([position.length - 1, 0]);
*/  
		
	}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "2D universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Двумерная вселенная';

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
	logUniverse2D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
		
	}

//	project(scene) { }

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 6; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	TestVerticeEdges(vertice){ return (vertice.length === this.verticeEdgesLengthMax) || (vertice.length === 3) ? true : false; }
	get dimension() { return 3; }//space dimension
	get verticesCountMin() { return 4; }

	/**
	 * 2 dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe1D</b> class settings. See <a href="./module-Universe-Universe.html" target="_blank">Universe classSettings</a>.
	 **/
	constructor(options, classSettings) {

		super(options, classSettings);
		this.logUniverse2D();

	}

}
export default Universe2D;
