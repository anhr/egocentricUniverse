/**
 * @module Universe3D
 * @description 3 dimensional universe.
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
import ProgressBar from '../../commonNodeJS/master/ProgressBar/ProgressBar.js'

class Universe3D extends Universe {

	//base methods

	setW() {

		const classSettings = this.classSettings, w = classSettings.settings.options.scales.w;
		w.min = -classSettings.t;
		w.max = classSettings.t;
		
	};
	get probabilityDensity() {

		const _this = this;
		return {

			sectorValueName: 'sectorVolume',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.t, hb = sector.hb, ht = sector.ht;
				
				//объем сегмента
				//https://en.wikipedia.org/wiki/Sphere
				//https://www.sjsu.edu/faculty/watkins/ndim.htm сводная таблица площади и объема для сфер разной размерности
//				sector[this.probabilityDensity.sectorValueName] = 2 * Math.PI * r * (ht - hb);
				sector[this.probabilityDensity.sectorValueName] = Math.PI * Math.PI * r * r * (ht - hb);
				return sector[this.probabilityDensity.sectorValueName];

			},
			get unverseValue() {
				
				//https://www.sjsu.edu/faculty/watkins/ndim.htm
				//Dimension = 4. Bounding Area = 2ππRRR
				const r = _this.classSettings.t;
				return 2 * Math.PI * Math.PI * r * r * r//Bounding Area

			}

		}

	}

	pushEdges() {

		const settings = this.classSettings.settings, geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
		const lang = { progressTitle: 'Creating edges.<br>Phase %s from 3', };
		switch ( settings.options.getLanguageCode() ) {

			case 'ru'://Russian language

				lang.progressTitle = 'Создание ребер.<br>Фаза %s из 3';

				break;

		}
		let phase = 1, verticeId = 1;
		const progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {

			edges.push();	
			progressBar.value = verticeId;
			verticeId++;
			if (verticeId === position.length) {

				edges.push([position.length - 1, 0]);
				
				if (this.classSettings.debug) console.log('time: Push edges. phase ' + phase + '. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');
				
				phase++;
				progressBar.title(lang.progressTitle.replace('%s', phase));
				verticeId = 0;
				progressBar.newStep(() => {
					
					let verticeIdOpposite = edges[position.length * (phase - 2) + verticeId][1] + 1;
					if (verticeIdOpposite >= position.length) verticeIdOpposite = 0;
					edges.push([verticeId, verticeIdOpposite]);
					const stop = () => {
						
						progressBar.remove();
						if (this.classSettings.continue) this.classSettings.continue();
						if (this.classSettings.projectParams) this.project(this.classSettings.projectParams.scene, this.classSettings.projectParams.params);
					
					}
					switch(position.length){
	
						case 4://tetraedr
							if (edges.length >=6) {

								stop();
								return;

							}
							break;
						case 6://устраняет ошибку
							//Universe: edges[12]. Duplicate edge[3,0]
							if (edges.length >=15){

								stop();
								return;

							}
							break;
					}
					
					progressBar.value = verticeId;
					verticeId++;
					if (verticeId === position.length) {

						if (this.classSettings.debug) console.log('time: Push edges. phase ' + phase + '. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');
				
						phase++;
						if (phase > 3) stop();
						else {
							
							progressBar.title(lang.progressTitle.replace('%s', phase));
							verticeId = 0;
							progressBar.step();

						}
						
					} else progressBar.step();
					
				});
				
			}
			progressBar.step();
			
		}, {

			sTitle: lang.progressTitle.replace('%s', phase),
			max: position.length,

		});

/*		
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
*/		
		
	}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "3D universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Трехмерная вселенная';

				break;

		}
		return lang.name;
		
	}
/*
	Indices() {

		const settings = this.classSettings.settings,
			debug = this.classSettings.debug;//_this = this, 

	}
*/
/*
	logUniverse2D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
		
	}
*/

//	project(scene) { }

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 6; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	TestVerticeEdges(vertice){ return (vertice.length === this.verticeEdgesLengthMax) || (vertice.length === 3) || (vertice.length === 4) ? true : false; }
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }

	/**
	 * 3 dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe1D</b> class settings. See <a href="./module-Universe-Universe.html" target="_blank">Universe classSettings</a>.
	 **/
	constructor(options, classSettings) {

//		classSettings.continue = () => this.logUniverse();
		super(options, classSettings);
		this.logUniverse();

	}

}
export default Universe3D;
