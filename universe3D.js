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


//import Universe from './universe.js';
import Universe2D from './universe2D.js';
import three from '../../commonNodeJS/master/three.js'
import FibonacciSphereGeometry from '../../commonNodeJS/master/FibonacciSphere/FibonacciSphereGeometry.js'

const sUniverse3D = 'Universe3D';

class Universe3D extends Universe2D {

	//base methods

	get axes() { return {

			//порядок размещения осей в декартовой системе координат
			//нужно что бы широта двигалась по оси y а долгота вращалась вокруг y
			indices: [3, 1, 2, 0],
//			indices: [2, 3, 1, 0],//широта и долгота перепутаны. Высота работает
//			indices: [3, 2, 1, 0],//широта и долгота перепутаны. Высота работает
//			indices: [0, 1, 2, 3],широта и долгота перепутаны. Высота не работает
//			indices: [1, 0, 3, 2],широта и долгота правильно. Высота не работает
/*		
			swap: (vertice) => {
	
				const length = vertice.length, axis = vertice[length - 2];
				vertice[length - 2] = vertice[length - 3];
				vertice[length - 3] = axis;
				
			},
			restore: (vertice) => {

				const axis = vertice[1];
				vertice[1] = vertice[2];
				vertice[2] = axis;
				
			},
*/			
			name: (i, getLanguageCode) => {

				const lang = super.axes.names(getLanguageCode);
				
				switch(i) {

					case 0: return lang.altitude;
					case 1: return lang.latitude;
					case 2: return lang.longitude;
					default: console.error(sUniverse3D + '.axes.name(' + i + '): Invalid index.')
						
				}
				
			},

		}
		
	}
	newUniverse(options, classSettings) { return new Universe3D(options, classSettings); }
	get cookieName(){ return '3DUniverse' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	setW() {

		const classSettings = this.classSettings, w = classSettings.settings.options.scales.w;
		w.max = classSettings.t;
		w.min = -classSettings.t;
		
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
	defaultAngles() { return { count: 5, } }//random pentachoron https://en.wikipedia.org/wiki/5-cell

	pushRandomAngle(verticeAngles) {

		//https://en.wikipedia.org/wiki/3-sphere#Hyperspherical_coordinates
		//verticeAngles.push(this.randomAngle());//ψ range 0 to π,
		
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение в ядре шара
		verticeAngles.push(Math.acos(Math.random() * (Math.random() > 0.5 ? 1: -1)));//ψ
		
		
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение на оси через полюса по оси Z
//		verticeAngles.push(Math.acos(Math.random() * (Math.random() > 0.5 ? 1: -1)));//θ
		this.pushRandomLatitude(verticeAngles);
		
		verticeAngles.push(this.randomAngle());//φ range 0 to 2π,

	}
	color() {}
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

	intersection(color, scene) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			mesh = new THREE.Mesh(new FibonacciSphereGeometry(((classSettings.intersection.position + 1) / 2) * classSettings.t, 320),
				//new THREE.MeshBasicMaterial( { color: color, wireframe: true } )//сетка
				new THREE.MeshLambertMaterial( {//полупрозрачные грани

					color: color,//"lightgray",
					opacity: 0.2,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

				} )
			);
		
		const lights = [], lightsCount = 6;
		for (let i = 0; i < lightsCount; i++) lights.push(new THREE.DirectionalLight(color, i > 2 ? 1 : 0.5));

		lights[0].position.set(200, 0, 0);
		lights[1].position.set(0, 200, 0);
		lights[2].position.set(0, 0, 200);
		lights[3].position.set(-200, 0, 0);
		lights[4].position.set(0, -200, 0);
		lights[5].position.set(0, 0, -200);

		for (let i = 0; i < lightsCount; i++) scene.add(lights[i]);

		return mesh;
		
	}

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 4/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }

	/**
	 * 3 dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe1D</b> class settings. See <a href="./module-Universe-Universe.html" target="_blank">Universe classSettings</a>.
	 **/
	constructor(options, classSettings) {

		super(options, classSettings);
		this.logUniverse();

	}

}
export default Universe3D;
