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

class Universe3D extends Universe2D {

	//base methods

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
	randomPosition(params) {

		//Hypersphere Point Picking
		//https://mathworld.wolfram.com/HyperspherePointPicking.html
		//Marsaglia (1972)
		const ret = params.ret, x = params.x, randomArray = params.randomArray;

		//set x - random array
		let sum = randomArray(2);
		const sum1 = sum, x2 = [];
		sum = randomArray(2, x2);
		x2.forEach(item => x.push(item));

		ret.push(x[0]);//x	=	x_1	
		ret.push(x[1]);//y	=	x_2	
		const sqrt = Math.sqrt((1 - sum1) / sum);//sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2)
		ret.push(x[2] * sqrt);//z	=	x_3sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2))	
		ret.push(x[3] * sqrt);;//w	=	x_4sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2))

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

/*		
		lights[0].position.set(0, 200, 0);
		lights[1].position.set(100, 200, 100);
		lights[2].position.set(- 100, - 200, - 100);
*/  
		/*
		lights[0].position.set(-200, 0, 0);
		lights[1].position.set(0, -200, 0);
		lights[2].position.set(0, 0, -200);
		*/
		lights[0].position.set(200, 0, 0);
		lights[1].position.set(0, 200, 0);
		lights[2].position.set(0, 0, 200);
		lights[3].position.set(-200, 0, 0);
		lights[4].position.set(0, -200, 0);
		lights[5].position.set(0, 0, -200);

		for (let i = 0; i < lightsCount; i++) scene.add(lights[i]);
/*		
		scene.add(lights[0]);
		scene.add(lights[1]);
		scene.add(lights[2]);
*/  

		return mesh;
		
	}

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

		super(options, classSettings);
		this.logUniverse();

	}

}
export default Universe3D;
