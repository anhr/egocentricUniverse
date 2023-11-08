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


//import Universe from './universe.js';
import Universe1D from './universe1D.js';
import ProgressBar from '../../commonNodeJS/master/ProgressBar/ProgressBar.js'
import three from '../../commonNodeJS/master/three.js'

const sUniverse2D = 'Universe2D';

class Universe2D extends Universe1D {

	//base methods
	
	get cookieName(){ return '2DUniverse'; }
	get probabilityDensity() {

		return {

			sectorValueName: 'sectorSquare',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.t, hb = sector.hb, ht = sector.ht;
				
				//Площадь сегмента
				//https://allll.net/wiki/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%BF%D0%BE%D0%B2%D0%B5%D1%80%D1%85%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%88%D0%B0%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE_%D1%81%D0%B5%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D0%B0
				sector[this.probabilityDensity.sectorValueName] = 2 * Math.PI * r * (ht - hb);
				return sector[this.probabilityDensity.sectorValueName];

			},

		}

	}
	defaultAngles() { return { count: 4, } }//random pyramid
	pushRandomAngle(verticeAngles) {


		//добиваемся равномерного распределения вершин по поверхности сферы
		verticeAngles.push(Math.acos(Math.random() * (Math.random() > 0.5 ? 1: -1)));//θ
		
		verticeAngles.push(super.randomAngle());//φ

	}
	pushEdges() {

		const settings = this.classSettings.settings, geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
			
		//Localization
		
		const lang = { progressTitle: 'Creating edges.<br>Phase %s from 3', };

		switch (settings.options.getLanguageCode()) {

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

				if (this.classSettings.debug)
					this.classSettings.debug.logTimestamp('Push edges. phase ' + phase + '. ');

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
					switch (position.length) {

						case 4://tetraedr
							if (edges.length >= 6) {

								stop();
								return;

							}
							break;
						case 5://pentahedroid https://en.wikipedia.org/wiki/5-cell
							if (edges.length >= 10) {

								stop();
								return;

							}
							break;
						case 6://устраняет ошибку
							//Universe: edges[12]. Duplicate edge[3,0]
							if (edges.length >= 15) {

								stop();
								return;

							}
							break;
					}

					progressBar.value = verticeId;
					verticeId++;
					if (verticeId === position.length) {

						if (this.classSettings.debug)
							this.classSettings.debug.logTimestamp('Push edges. phase ' + phase + '. ');

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

		}
		return lang.name;
		
	}
	logUniverse2D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
		
	}

	intersection(color) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			t = classSettings.t,
			mesh = new THREE.GridHelper(2 * t, 10, color, color);
		mesh.rotation.x = Math.PI / 2;
		mesh.position.copy(new THREE.Vector3(0, 0, classSettings.intersection.position * t));
		return mesh;

	}

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

		classSettings.continue = () => this.logUniverse2D();
		super(options, classSettings);
//		this.logUniverse2D();

	}

}
export default Universe2D;
