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
import three from '../../commonNodeJS/master/three.js'

const sUniverse1D = 'Universe1D';

class Universe1D extends Universe {

	//base methods

	get cookieName(){ return '1DUniverse'; }
	get probabilityDensity(){
		
		return {

			sectorValueName: 'sectorLength',
			sectorValue: (probabilityDensity, i) => {
				
				const sector = probabilityDensity[i], r = this.classSettings.t, hb = sector.hb, ht = sector.ht,
					angle = (hb) => {

						const M = Math.sqrt(r * r - hb * hb);//Прилежащий катет прямоугольного треугольника
							return Math.atan(hb / M);//угол прямоугольного треугольника https://poschitat.online/ugly-pryamougolnogo-treugolnika						
						
					}
				sector[this.probabilityDensity.sectorValueName] = Math.abs(r * (angle(hb) - angle(ht)) * 2);//длинна дуги сектора https://mnogoformul.ru/dlina-dugi#:~:text=%D0%94%D0%BB%D0%B8%D0%BD%D0%B0%20%D0%B4%D1%83%D0%B3%D0%B8%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%B9%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D1%80%D0%B0%D0%B2%D0%BD%D0%B0,%2C%20%D0%B3%D0%B4%D0%B5%20r%20%2D%20%D1%80%D0%B0%D0%B4%D0%B8%D1%83%D1%81%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8.
				return sector[this.probabilityDensity.sectorValueName];
				
			},
			
		}
		
	}
	defaultAngles() { return { count: 3, } }//random triangle
	pushRandomAngle(verticeAngles) { verticeAngles.push(this.randomAngle()); }
/*
	pushEdges() {

		const geometry = this.classSettings.settings.object.geometry, edges = geometry.indices.edges, position = geometry.position;
		for (let verticeId = 1; verticeId < position.length; verticeId++) edges.push();
		edges.push([position.length - 1, 0]);
		if (this.projectGeometry) this.projectGeometry();
		
		if (this.classSettings.debug)
			this.classSettings.debug.logTimestamp('Push edges. ');
		
	}
*/	
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

		}
		return lang.name;
		
	}
	logUniverse1D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
		
	}

	intersection(color) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			settings = classSettings.settings,
			options = settings.options,
			t = classSettings.t,
			ip = classSettings.intersection.position,//координата сечения
			mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
				new THREE.Vector3( options.scales.x.min * t, 0, 0 ), new THREE.Vector3( options.scales.x.max * t, 0, 0 )
			] ), new THREE.LineBasicMaterial( { color: color } ) ),
			vectors = settings.object.geometry.position;
		mesh.position.copy(new THREE.Vector3(0, ip * t, 0));

		//длинна дуги
		const angle = (leg) => Math.asin(leg / t),
			ai = angle(ip);//угол наклона точки пересечения окружности с линией сечения
		vectors.forEach(vector => {

			const a = angle(vector.y) - ai;//угол между векторами текущей вершины и точки пересечения
			console.log(a);
		})
		return mesh;
		
	}

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 5/*2*/; }//нельзя добавлть новое ребро если у вершины уже 2 ребра
/*
	TestVerticeEdges(vertice){ return vertice.length === this.verticeEdgesLength ? //this.verticeEdgesLengthMax ?
		true : false; }
*/
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
