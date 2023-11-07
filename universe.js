/**
 * @module Universe
 * @description Base class for n dimensional universe.
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


import ND from '../../commonNodeJS/master/nD/nD.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if (ND.default) ND = ND.default;

//Когда хочу вывести на холст точки вместо ребер то использую MyPoints вместо ND
//При этом ребра не создаются что дает экономию времени
import MyPoints from '../../commonNodeJS/master/myPoints/myPoints.js';
import ColorPicker from '../../commonNodeJS/master/colorpicker/colorpicker.js';

//Получаю ошибку
//myThree: duplicate myThree. Please use one instance of the myThree class.
//если на веб странце импортировать import MyThree from '../../../commonNodeJS/master/myThree/build/myThree.module.js';
//import MyThree from '../../commonNodeJS/master/myThree/myThree.js';
import three from '../../commonNodeJS/master/three.js'

import ProgressBar from '../../commonNodeJS/master/ProgressBar/ProgressBar.js'
//import WebGPU from '../../WebGPU/master/WebGPU.js';

const sUniverse = 'Universe', sOverride = sUniverse + ': Please override the %s method in your child class.';
//	verticeEdges = true;//Эту константу добавил на случай если захочу не включать индексы ребер в вершину если classSettings.debug != true

class Universe {

	//base methods

	randomAngle(n=2) { return Math.random() * Math.PI * n; }
	color() { if (this.classSettings.settings.object.color === undefined) this.classSettings.settings.object.color = 'lime'; }
	name() { console.error(sOverride.replace('%s', 'name')); }
	logUniverse() {

		if (!this.classSettings.debug) return;
		let i = 0, progressBarValue = 0,
			log = 0;//position log
		const settings = this.classSettings.settings, geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges,
			sLogUniverse = sUniverse + ': logUniverse()',
			progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {

				switch (log){
					case 0://position log
						const vertice = position[i];
						console.log('vertice[' + i + '] = ' + JSON.stringify(vertice) + ' angles = ' + JSON.stringify(vertice.angles) + ' edges = ' + JSON.stringify(vertice.edges));
						break;
					case 1://edges log
						const edge = edges[i];
						console.log('edges[' + i + '] = ' + JSON.stringify(edge))
						break;
					default: console.error(sLogUniverse + '. Invalid log = ' + log);
				}
				progressBar.value = progressBarValue;
				progressBarValue++;
				i++;
				switch (log){
					case 0://position log
						if (i === position.length) {
							
							log++;//edges log
							i = 0;

						}
						progressBar.step();
						break;
					case 1://edges log
						if (i >= edges.length) {
							
							progressBar.remove();
							if (this.classSettings.debug)
								this.classSettings.debug.logTimestamp('Geometry log. ');
								//console.log('time: Geometry log. ' + ((window.performance.now() - this.classSettings.debug.timestamp) / 1000) + ' sec.');
							
						} else progressBar.step();
						break;
					default: console.error(sLogUniverse + '. Invalid log = ' + log);
				}
				
			}, {

			sTitle: 'Geometry log',
			max: position.length - 1 + edges.length - 1,

		});
		
	}
	Test(){

		if (!this.classSettings.debug) return;
		
		const geometry = this.classSettings.settings.object.geometry;
		geometry.position.test();

		//for future using
		if (geometry.indices.faces) geometry.indices.faces.test();
		
	}
	TestVertice(vertice, strVerticeId){
		
		if (!this.TestVerticeEdges(vertice))
			console.error(sUniverse + ': Test(). Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	angles2Vertice(angles) {

		const a2v = (angles) => {

/*
			//1D universe			
			const θ = angles[0];//, r = this.classSettings.t;//радиус потом вычисляю
			return [
				Math.cos(θ),// * r,//x
				Math.sin(θ)// * r//y
			];

			//3D universe
			//angles2Vertice from Universe3D
			vertice[0] = [0,0,0,1]
			vertice[1] = [0,0,0.8660254037844387,-0.4999999999999998]
			vertice[2] = [0.6495190528383291,-0.3749999999999999,-0.4330127018922192,-0.4999999999999998]
			vertice[3] = [-0.6495190528383288,-0.37499999999999994,-0.43301270189221974,-0.4999999999999998]
			vertice[4] = [-9.184850993605146e-17,0.7499999999999998,-0.43301270189221974,-0.4999999999999998]

			//angles2Vertice from Universe
			vertice[0] = [1,0,0,0]
		   vertice[1] = [-0.4999999999999998,0.8660254037844387,0,0]
		   vertice[2] = [-0.4999999999999998,-0.4330127018922192,-0.3749999999999999,0.6495190528383291]
		   vertice[3] = [-0.4999999999999998,-0.43301270189221974,-0.37499999999999994,-0.6495190528383288]
		   vertice[4] = [-0.4999999999999998,-0.43301270189221974,0.7499999999999998,-9.184850993605146e-17]
*/   
			//https://en.wikipedia.org/wiki/N-sphere#Spherical_coordinates
			const n = this.dimension, φ = angles, x = [], cos = Math.cos, sin = Math.sin;

			//добавляем оси
//			for (let i = 0; i < n; i++)
			//поменял расположение осей в массиве x
			//для того что бы в 3D последняя ось указывала на цвет точки
			for (let i = n - 1; i >= 0; i--) {

				let axis = 1.0;

				const mulCount = //количество множителей для данной оси
					i < (n - 1) ?
						i + 1: //на один больше порядкового номера оси
						i;//или равно порядковому номеру оси если это последняя ось
				for (let j = 0; j < mulCount; j++) {

					if(j === (mulCount - 1)){

						//Это последний множитель для текущей оси
						if (i != (n - 1)) {
							
							//Это не последняя ось
							axis *= cos(φ[j]);
							continue;

						}
						
					}
					axis *= sin(φ[j]);
/*					
					axis *= (j != (n - 1)) &&//Это последний множитель
						(j != i) ?//и это не последняя ось
					cos(φ[j]) ://косинус только если это последний множитель и не последняя ось
					sin(φ[j]);
*/	 

				}
				x.push(axis);

			}
/*
			for(let i = 0; i < n; i++) {
	
				let axis = i < (n - 1) ? cos(φ[i]) : sin(φ[i - 1]);
				let mul = 1;
				if (i > 0) {
					
					for(let j = 0; j < i; j++) mul *= 1;

				}
				x.push(axis * mul);
				
			}
*/
			return x;

		}
		const vertice = a2v(angles);
		if (this.classSettings.debug && this.classSettings.debug.testVertice){

			const vertice2angles = this.vertice2angles(vertice),
				angles2vertice = a2v(vertice2angles);
			const value = vertice;
			if (angles2vertice.length != value.length) console.error(sUniverse + ': Set vertice failed. angles2vertice.length = ' + angles2vertice.length + ' is not equal value.length = ' + value.length);
			const d = 6e-16;
			angles2vertice.forEach((axis, i) => { if(Math.abs(axis - value[i]) > d) console.error(sUniverse + ': Set vertice failed. axis = ' + axis + ' is not equal to value[' + i + '] = ' + value[i]) } );
			
		}
		return vertice;

	}
	vertice2angles(vertice) {

		if (!this.classSettings.debug) console.warn(sUniverse + ': Use vertice2angles in debug version only');
		//https://en.wikipedia.org/wiki/N-sphere#Spherical_coordinates
		//тангенс — отношение стороны противолежащего катета vertice[1] к стороне прилежащегоvertice[0], (tg или tan);
		const x = [], n = this.dimension - 1, φ = [], atan2 = Math.atan2, sqrt = Math.sqrt;

		//меняем местами оси координат, потому что в 3D последняя кооддината должна указывать на цвет точки
		for (let k = (vertice.length - 1); k >= 0; k--) x.push(vertice[k]);
		
		for (let i = 0; i < n; i++) {

			const axes = {};
			if (i === (n - 1)) {
				
				axes.y = x[n]; axes.x = x[n - 1];
				
			} else {
				
				let sum = 0;
				for(let j = (i + 1); j <= n; j++) sum += x[j] * x[j];
				axes.y = sqrt(sum); axes.x = x[i];

			}
			φ.push(atan2(axes.y, axes.x));
			
		}
/*		
		for(let i = 0; i < n; i++) {

			const axes = {};
			if (i === (n - 1)) {

//				φ.push(atan2(x[n], x[n - 1]));
//				continue;
				axes.y = x[n]; axes.x = x[n - 1];
				
			} else {
				
				let sum = 0;
				for(let j = (i + 1); j <= n; j++) sum += x[j] * x[j];
//				φ.push(atan2(sqrt(sum), x[i]));
				axes.y = sqrt(sum); axes.x = x[i];

			}
			φ.push(atan2(axes.y, axes.x));
//			φ.push(atan2(axes.x, axes.y));
			
		}
*/  
/*
		for(let i = 0; i < n; i++) {

			if (i === (n - 1)) {

				φ.push(atan2(x[n], x[n - 1]));
				continue;
				
			}
			let sum = 0;
			for(let j = (i + 1); j <= n; j++) sum += x[j] * x[j];
			φ.push(atan2(sqrt(sum), x[i]));
			
		}
*/		
		return φ;

	}

	/**
	 * Base class for n dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe</b> class settings.
	 * @param {object} [classSettings.intersection] Universe intersection.
	 * <pre>
	 *	For 1D universe intersector is line.
	 *	For 2D universe intersector is plane.
	 *	For 1D universe intersector is sphere.
	 * </pre>
	 * @param {float} [classSettings.intersection.position=0.0] Position of the intersector.
	 * <pre>
	 *	For 1D universe <b>position</b> is Y coordinate of the intersection line.
	 *	For 2D universe <b>position</b> is Z coordinate of the intersection plane.
	 *	For 3D universe <b>position</b> is radius of the intersection sphere.
	 * </pre>
	 * @param {number|string} [classSettings.intersection.color=0x0000FF] Color of the intersector. Example: 'red'.
	 * @param {object} [classSettings.projectParams] Parameters of project the universe onto the canvas.
	 * @param {THREE.Scene} classSettings.projectParams.scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {object} [classSettings.projectParams.params={}] The following parameters are available
	 * @param {object} [classSettings.projectParams.params.center={x: 0.0, y: 0.0, z: 0.0}] center of the universe
	 * @param {float} [classSettings.projectParams.params.center.x=0.0] X axis of the center
	 * @param {float} [classSettings.projectParams.params.center.y=0.0] Y axis of the center
	 * @param {float} [classSettings.projectParams.params.center.z=0.0] Y axis of the center
	 * @param {float} [classSettings.t=1.0] Universe start time. Time is the radius of the Universe.
	 * @param {boolean|object} [classSettings.edges={}] Universe edges
	 * <pre>
	 *	false - Doesn't create edges to reduce the creation time of the universe
	 * </pre>
	 * @param {boolean} [classSettings.edges.project=true] false - Doesn't project edges onto canvas
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] Universe object.
	 * @param {String} [classSettings.settings.object.name] name of universe.
	 * @param {String|number} [classSettings.settings.object.color='lime'] color of edges or vertices.
	 * <pre>
	 * String - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file.
	 * number - color [Hex triplet]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet}. Example: 0x0000ff - blue color.
	 * <pre>
	 * @param {object} [classSettings.settings.object.geometry] Universe geometry.
	 * @param {array|object} [classSettings.settings.object.geometry.angles] n-dimensional universe vertice angles.
	 * <pre>
	 * array - array of vertex angles.
	 *	Every item of array is n-dimensional array of vertex angles.
	 *	For <b><a href="module-Universe1D.html" target="_blank">Universe1D</a></b> every item is array of one vertex angle.
	 *		Vertex angle is angle of rotation around of Z axis in 3D space
	 *		in the range from <b>0</b> to <b>2 * Math.PI</b>.
	 *		Angle is begin from X axis.
	 *		Every vertex is <b>[
				Math.cos(θ),//x
				Math.sin(θ)//y
			]</b> array. <b>θ</b> is vertex angle.
	 *		Example of 1D universe with three vertices is triangle:
	 *		<b>classSettings.settings.object.geometry.angles: [
	 *			[0],//vertice[0] = [1,0]
	 *			[Math.PI * 2 / 3],//vertice[1] = [-0.4999999999999998,0.8660254037844387]
	 *			[Math.PI * 2 *2 / 3]//vertice[2] = [-0.5000000000000004,-0.8660254037844384]
	 *		]</b>,
	 *	For <b><a href="module-Universe2D.html" target="_blank">Universe2D</a></b> every item is array of two vertex angle.
	 *		The first vertex angle <b>θ</b> is a cross section of the 2D universe
	 *		in the XY plane in the range from <b>0</b> to <b>2 * Math.PI</b>.
	 *		
	 *		The second vertex angle <b>φ</b> is a cross section of the 2D universe across the center of the universe
	 *		in the range from <b>0</b> to <b>2 * Math.PI</b>.
	 *		The second vertex angle is angle of rotation of the cross section around of Z axis.
	 *		Cross section is parallel to the XZ plane if second vertex angle is 0 radians.
	 *		Cross section is parallel to the YZ plane if second vertex angle is <b>Math.PI / 2</b> radians.
	 *		
	 *		Position of vertex is array of the three axiz:
	 *		<b>[
	 *			Math.sin(θ) * Math.cos(φ),//x
	 *			Math.sin(θ) * Math.sin(φ),//y
	 *			Math.cos(θ),//z
	 *		]</b>
	 *		as described in [Cartesian coordinates]{@link https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates}.
	 *		<b>θ</b> is first angle of the vertex and <b>φ</b> is second angle of the vertex.
	 *		
	 *		Example of 2D universe with 4 vertices is pyramid:
	 *		<b>classSettings.settings.object.geometry.angles: [
	 *		
	 *			//vertice[0] = [0,0,1]
	 *			[Math.PI * 0 * 1 / 3, Math.PI * 0 * 2 / 3],
	 *			
	 *			//vertice[1] = [0.8660254037844387,0,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 0 * 2 / 3],
	 *			
	 *			//vertice[2] = [-0.4330127018922192,0.7500000000000001,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 1 * 2 / 3],
	 *			
	 *			//vertice[3] = [-0.43301270189221974,-0.7499999999999998,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 2 * 2 / 3],
	 *		]</b>,
	 *	For <b><a href="module-Universe3D.html" target="_blank">Universe3D</a></b> every item is array of three vertex angle.
	 *		The first vertex angle <b>ψ</b> defines the sphere that across the 3D universe in the range from <b>0</b> to <b>Math.PI</b>.
	 *		
	 *		Position of vertex is array of the 4 axiz:
	 *		<b>[
	 *			Math.sin(ψ) * Math.sin(θ) * Math.sin(φ),//x
	 *			Math.sin(ψ) * Math.sin(θ) * Math.cos(φ),//y
	 *			Math.sin(ψ) * Math.cos(θ),//z
	 *			Math.cos(ψ),//w
	 *		]</b>
	 *		as described in [Hyperspherical coordinates]{@link https://en.wikipedia.org/wiki/3-sphere#Hyperspherical_coordinates}.
	 *		<b>ψ</b> is first angle of the vertex.
	 *		<b>θ</b> is second angle of the vertex.
	 *		<b>φ</b> is third angle of the vertex.
	 *		
	 *		Example of 3D universe with 5 vertices is [pentahedroid]{@link https://en.wikipedia.org/wiki/5-cell}:
	 *		<b>classSettings.settings.object.geometry.angles: [
	 *		
	 *			//vertice[0] = [0,0,0,1]
	 *			[],
	 *			
	 *			//vertice[1] = [0,0,0.8660254037844387,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3],
	 *			
	 *			//vertice[2] = [0.6495190528383291,-0.3749999999999999,-0.4330127018922192,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 1 * 2 / 3, Math.PI * 2 * 1 / 3],
	 *			
	 *			//vertice[3] = [-0.6495190528383288,-0.37499999999999994,-0.43301270189221974,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 2 * 2 / 3, Math.PI * 2 * 1 / 6],
	 *			
	 *			//vertice[4] = [-9.184850993605146e-17,0.7499999999999998,-0.43301270189221974,-0.4999999999999998]
	 *			[Math.PI * 2 * 1 / 3, Math.PI * 2 * 2 / 3, Math.PI * 2 * 3 / 6],
	 *		]</b>,
	 * object - see below:
	 * </pre>
	 * @param {number} [classSettings.settings.object.geometry.angles.count=3|4|5] Count of vertices with random position.
	 * <pre>
	 * Default values:
	 *	3 for <b><a href="module-Universe1D.html" target="_blank">Universe1D</a></b> - triangle.
	 *	4 for <b><a href="module-Universe2D.html" target="_blank">Universe2D</a></b> - pyramid.
	 *	5 for <b><a href="module-Universe3D.html" target="_blank">Universe3D</a></b> - [pentahedroid]{@link https://en.wikipedia.org/wiki/5-cell}.
	 * </pre>
	 * @param {array} [classSettings.settings.object.geometry.opacity] array of opacities of each vertice. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of edges of universe.
	 * @param {array|object} [classSettings.settings.object.geometry.indices.edges] Universe edges.
	 * <pre>
	 * array - array of edges.
	 *	Every edge is array of indices of vertices from
	 *	<b>classSettings.settings.object.geometry.position</b>
	 *	Example: <b>[[0,1], [1,2], [2,0]],//triangle</b>
	 * object - see below:
	 * </pre>
	 * @param {number} [classSettings.settings.object.geometry.indices.edges.count=3] edges count.
	 * @param {boolean|object} [classSettings.debug=false] Debug mode.
	 * <pre>
	 *	true - Diagnoses your code and display detected errors to console.
	 *	object - Diagnoses your code and display detected errors to console.
	 * </pre>
	 * @param {boolean|Array} [classSettings.debug.probabilityDensity=[]] Probability density of distribution of vertices over the surface of the universe.
	 * <pre>
	 *	false - do not calculate probability density.
	 *	[] - calculate probability density.
	 * </pre>
	 * @param {function} [classSettings.continue] Callback function that called after universe edges was created.
	 **/
	constructor(options, classSettings={}) {

		const _this = this, THREE = three.THREE;
		if (classSettings.debug === true) classSettings.debug = {};
//		if (classSettings.debug) this.timestamp = window.performance.now();
		if (classSettings.debug) {
			
			classSettings.debug.timestamp = window.performance.now();
			classSettings.debug.logTimestamp = (text = '', timestamp) =>
				console.log('time: ' + text + ((window.performance.now() - (timestamp ? timestamp : classSettings.debug.timestamp)) / 1000) + ' sec.');
			if (classSettings.debug.testVertice != false) classSettings.debug.testVertice = true;

		}
		this.classSettings = classSettings;

		const cookie = options.dat.cookie,
			cookieName = options.dat.getCookieName(sUniverse),
			cookieOptions = {};
		cookie.getObject(cookieName, cookieOptions);
		classSettings.edges = cookieOptions.edges === false ? false : cookieOptions.edges || classSettings.edges;
		if (classSettings.edges != false) classSettings.edges = classSettings.edges || {};
		if ((classSettings.edges != false) && (classSettings.edges.project === undefined)) classSettings.edges.project = true;

		if (classSettings.t === undefined) classSettings.t = 1.0;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.options = options;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
  
		//не получается сменить имя оси
		//if (options.scales.w.name === 'w') options.scales.w.name = 't';
  
		settings.object.geometry = settings.object.geometry || {};

		//for debug
		//для 2D вселенной это плотность вероятности распределения вершин по поверхности сферы в зависимости от третьей координаты вершины z = vertice.[2]
		//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
		//Разбил сферу на sc = 5 сегментов от 0 до 4.
		//Границы сегментов вычисляю по фомулам:
		//Высота сегмента hs = d / sc = 2 / 5 = 0.4
		//Нижняя граница сегмента hb = hs * i - r
		//Верхняя граница сегмента ht = hs * (i + 1) - r
		//где r = 1 - радиус сферыб d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
		if (classSettings.debug && (classSettings.debug.probabilityDensity != false)) classSettings.debug.probabilityDensity = [
			
				/*
				{ count: 0, },//0. From -1 to -0.6
				{ count: 0, },//1. From -0.6 to -0.2
				{ count: 0, },//2. From -0.2 to 0.2
				{ count: 0, },//3. From 0.2 to 0.6
				{ count: 0, },//4. From 0.6 to 1
				*/
			
		];
//		const probabilityDensity = classSettings.debug ? [] : undefined;
		const probabilityDensity = classSettings.debug.probabilityDensity;
		if (probabilityDensity) {
			
			for (let i = 0; i < 5; i++) probabilityDensity.push({ count: 0, });
			probabilityDensity.options = { d: classSettings.t * 2, };
			probabilityDensity.options.sc = probabilityDensity.length;//Количество сегментов
			probabilityDensity.options.hs = probabilityDensity.options.d / probabilityDensity.options.sc;//Высота сегмента
			let sectorsValue = 0;
			probabilityDensity.forEach((sector, i) => {

				sector.hb = probabilityDensity.options.hs * i - classSettings.t;//Нижняя граница сегмента
				sector.ht = probabilityDensity.options.hs * (i + 1) - classSettings.t;//Верхняя граница сегмента
				sectorsValue += _this.probabilityDensity.sectorValue(probabilityDensity, i);

			});
			let unverseValue = this.probabilityDensity.unverseValue;
			if (unverseValue === undefined) {
				
				unverseValue = Math.PI;
				const r = classSettings.t;//probabilityDensity.options.r;
				for (let i = 0; i < (_this.dimension - 1); i++) unverseValue *= 2 * r;

			}
			if (unverseValue != sectorsValue) console.error(sUniverse + ': Unverse value = ' + unverseValue + '. Sectors value = ' + sectorsValue);
		
		}

//		settings.object.geometry.angles = settings.object.geometry.angles || { count: 3, };
		settings.object.geometry.angles = settings.object.geometry.angles || this.defaultAngles();
		if(!(settings.object.geometry.angles instanceof Array)) {

			const angles = [];
			Object.keys(settings.object.geometry.angles).forEach((key) => angles[key] = settings.object.geometry.angles[key]);
			settings.object.geometry.angles = angles;
			
		}
		const angles = settings.object.geometry.angles;
		if (angles.count != undefined)
			for (let i = angles.length; i < angles.count; i++){
	
				const verticeAngles = [];
//				verticeAngles.push(Math.random() * Math.PI * 2);
				this.pushRandomAngle(verticeAngles);
				angles.push(verticeAngles);
				
			}
		settings.object.geometry.position = new Proxy(angles, {

			get: (_position, name) => {

				const i = parseInt(name);
//				let verticeId;
				if (!isNaN(i)) {

					if (i > _position.length) console.error(sUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					else if (i === _position.length) settings.object.geometry.position.push();
					const _vertice = _position[i];
//					verticeId = i;
					const angle2Vertice = () => {

						const vertice = _this.angles2Vertice(new Proxy(_vertice, {

								get: (angles, name) => {

									const i = parseInt(name);
									if (!isNaN(i)) {

										if (i >= angles.length) return 0.0;
										
									}
									return angles[name];

								},
							})							
						), r = classSettings.t;
						//Эта проверка не проходит для Universe3D
						if (classSettings.debug) {

							let sum = 0;
							vertice.forEach(axis => sum += axis * axis);
							if (Math.abs((sum - 1)) > 4.5e-16) console.error(sUniverse + ': Invalid vertice[' + i + '] sum = ' + sum);
							
						}
						vertice.forEach((axis, i) => vertice[i] *= r);
						return vertice;
						
					}
					return new Proxy(angle2Vertice(), {

						get: (vertice, name) => {

							switch (name) {

								case 'edges':

/*//vertice.edges используется во время обновления сцены options.onSelectScene
									if (!classSettings.debug) {

										console.error(sUniverse + ': vertice.edges. Set debug = true first.');
										return;

									}
*/		 
									_vertice.edges = _vertice.edges || new Proxy([], {

										get: (edges, name) => {

											switch (name) {

												case 'push': return (edgeId, verticeId) => {

													const sPush = sUniverse + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';

													if (edges.length >= _this.verticeEdgesLengthMax) {

														console.error(sPush + ' invalid edges.length = ' + edges.length);
														return;

													}
													//find for duplicate edgeId
													for (let j = 0; j < edges.length; j++) {

														if (edges[j] === edgeId) {

															console.error(sPush + ' duplicate edgeId: ' + edgeId);
															return;

														}

													}

													edges.push(edgeId);

												}

											}
											return edges[name];

										},
									});
									return _vertice.edges;

/*
								case 'oppositeVerticesId':
									_vertice.oppositeVerticesId = _vertice.oppositeVerticesId || [];
									return _vertice.oppositeVerticesId;
*/
/*									
								case 'angles':
									return (angles) => angles.forEach((angle, i) => _vertice[i] = angle);
*/		 
								case 'angles': return _vertice;
								case 'vector':
									//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
									const vertice2 = vertice[2], vertice3 = vertice[3];
									//Если вернуть THREE.Vector4 то будет неправильно отображаться цвет точки
									if (vertice3 === undefined)
										return new three.THREE.Vector3(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2);
									return new three.THREE.Vector4(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2, vertice3 === undefined ? 1 : vertice3);
								case 'x': return vertice[0];
								case 'y': return vertice[1];
								case 'z': return vertice[2];
								case 'w':
									//для совместимости с Player.getColors. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
									return vertice[3];

							}
							return vertice[name];

						},
						set: (vertice, name, value) => {

							vertice[name] = value;
							return true;

						}

					});

				}
				switch (name) {

					case 'angles': return new Proxy(_position, {

						get: (angles, name) => {

							const verticeId = parseInt(name);
							if (isNaN(verticeId)) {

								console.error(sUniverse + ': Get vertice angles failed. Invalid verticeId = ' + verticeId);
								return;
								
							}
							return new Proxy(angles[name], {
								
								get: (angles, name) => {
		
									switch (name) {
											
										//идентификаторы всех вершин, которые связаны с текущей вершиной через ребра
										case 'oppositeVerticesId': return new Proxy(angles.edges, {

											get: (verticeEdges, name) => {

												const i = parseInt(name);
												if (!isNaN(i)) {
			
													const edge = settings.object.geometry.indices.edges[verticeEdges[i]];
													if (verticeId === edge[0]) return edge[1];
													if (verticeId === edge[1]) return edge[0];
													console.error(sUniverse + ': Get oppositeVerticesId failed.');
													return;
													
												}
/*												
												switch (name) {

													//почему то не работает
													//case 'forEach': return vertice.edges.forEach;
														
													case 'length': return vertice.edges.length;
														
												}
*/												
												return verticeEdges[name];
											
											}
												
										});
/*											
											angles.oppositeVerticesId = angles.oppositeVerticesId || [];
											return angles.oppositeVerticesId;
*/		   
											
									}
									return angles[name];
									
								},
//								set: (angles, name, value) => {
		
//									angles[name] = value;
//									return true;
		
//								}
							
							});
							
						},
						set: (angles, name, value) => {

							const i = parseInt(name);
							if (!isNaN(i)) {
								
								const verticeAngles = angles[i];
								if (classSettings.debug && ((verticeAngles.length != (_this.dimension - 1)) || (value.length != (_this.dimension - 1)))) console.error(sUniverse + ': Set vertice[' + i + '] angles failed. Invalid angles count.')
								for(let j = 0; j < value.length; j++) verticeAngles[j] = value[j];

							} else angles[name] = value;
							return true;

						}
					});
					case 'count': return _position.count === undefined ? _position.length : _position.count;
					case 'push': return (position = randomPosition()) => {

						console.error(sUniverse + ': deprecated push vertice');

					};

					//for debug
					case 'test': return () => {

						if (!classSettings.debug) return;

						_position.forEach((angle, verticeId) => {

							const vertice = settings.object.geometry.position[verticeId], strVerticeId = 'vertice[' + verticeId + ']'
							_this.TestVertice(vertice, strVerticeId);
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(sUniverse + ': position.test()', strVerticeId = 'position(' + verticeId + ')' + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

							});

						})
					}

				}
				return _position[name];

			},
			set: (_position, name, value) => {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (value instanceof Array === true) {//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND

						console.warn(sUniverse + ': Set vertice was deprecated. Use set angle instead.')
/*						
						//https://en.wikipedia.org/wiki/N-sphere#Spherical_coordinates
						const x = value, n = this.dimension - 1, φ = [], atan2 = Math.atan2, sqrt = Math.sqrt;
						for(let i = 0; i < n; i++) {

							if (i === (n - 1)) {

								φ.push(atan2(x[n], x[n - 1]));
								continue;
								
							}
							let sum = 0;
							for(let j = (i + 1); j <= n; j++) sum += x[j] * x[j];
							φ.push(atan2(sqrt(sum), x[i]));
							
						}
*/
						const angles = this.vertice2angles(value);
						if(classSettings.debug) {

							const angles2vertice = this.angles2Vertice(angles);
//							const vertice2angles = this.vertice2angles(value);
							if (angles2vertice.length != value.length) console.error(sUniverse + ': Set vertice failed. angles2vertice.length = ' + angles2vertice.length + ' is not equal value.length = ' + value.length);
							const d = 0;
							angles2vertice.forEach((axis, i) => { if(Math.abs(axis - value[i]) > d) console.error(sUniverse + ': Set vertice failed. axis = ' + axis + ' is not equal to value[' + i + '] = ' + value[i]) } );
							
						}
						settings.object.geometry.position[i].angles(angles);
//						settings.object.geometry.position[i].angles(this.vertice2angles(value));

					}

				} else {

					_position[name] = value;

				}
				return true;

			}

		});
/*
		if(!(settings.object.geometry.position instanceof Array))
			Object.keys(settings.object.geometry.position).forEach((key) => position[key] = settings.object.geometry.position[key]);
		else settings.object.geometry.position.forEach(vertice => {

			const newVertice = [], bColor = (this.classSettings.settings.object.color != undefined) || (this.classSettings.settings.object.geometry.colors != undefined);
			vertice.forEach((axis, i) => {
				
				//решил что цвета всех точек или цвет каждой точки будут в приоритете перед цветом из палитры цветов
				if (!bColor || (i < 3))
					newVertice.push(axis * classSettings.t);//scale vertice
				
			});
			position.push(newVertice);
		
		});//scale and convert vertices to Proxy

		settings.object.geometry.position = position;
*/		
		const position = settings.object.geometry.position;
		
		settings.object.geometry.indices = settings.object.geometry.indices || [];
		if (!(settings.object.geometry.indices instanceof Array)) {

			const indices = [];
			Object.keys(settings.object.geometry.indices).forEach((key) => indices[key] = settings.object.geometry.indices[key]);
			settings.object.geometry.indices = indices;
			
		}
		const indices = settings.object.geometry.indices;
		indices[0] = indices[0] || [];
		if (indices.edges)
			if(indices.edges instanceof Array) {
				
				indices[0] = indices.edges;
				indices[0].count = indices.edges.length;
				
			} else {

				const edges = indices[0];
				Object.keys(indices.edges).forEach((key) => edges[key] = indices.edges[key]);
				indices.edges = edges;
				
			}
		indices.edges = new Proxy(indices[0], {
			
			get: (_edges, name) => {

				const edgeId = parseInt(name);
				if (!isNaN(edgeId)) {

					let edge = _edges[edgeId];
					return edge;
					
				}
				const setVertice = (edge, edgeVerticeId, verticeId, edgeId) => {

					const vertice = position[verticeId];//push random vertice if not exists
					edge[edgeVerticeId] = verticeId;

					//vertice.edges используется во время обновления сцены options.onSelectScene
//					if (classSettings.debug)
						vertice.edges.push(edgeId === undefined ? _edges.length : edgeId, verticeId);
					
				}
				switch (name) {

					case 'push': return (edge=[]) => {

						setVertice(edge, 0, edge[0] === undefined ? _edges.length : edge[0]);
						setVertice(edge, 1, edge[1] === undefined ? _edges.length + 1 : edge[1]);
						if (classSettings.debug) _edges.forEach((edgeCur, i) => { if (((edgeCur[0] === edge[0]) && (edgeCur[1] === edge[1])) || ((edgeCur[0] === edge[1]) && (edgeCur[1] === edge[0]))) console.error(sUniverse + ': edges[' + i + ']. Duplicate edge[' + edge + ']') });

/*						
						const position = settings.object.geometry.position;
						position[edge[0]].oppositeVerticesId.push(edge[1]);
						position[edge[1]].oppositeVerticesId.push(edge[0]);
*/	  

						return _edges.push(edge);

					}
					case 'pushEdges': return (edge=[]) => {

						_edges.count = _edges.count || 3;
						for (let i = 0; i < _edges.count; i++) {
							
							const edge = _edges[i];
							if (edge){

								setVertice(edge, 0, edge[0], i);
								setVertice(edge, 1, edge[1], i);

							} else {
								
								if(i === (_edges.count - 1)) indices.edges.push([settings.object.geometry.position.length - 1, 0])//loop edges
								else indices.edges.push();

							}

						}
						
					}

				}
				return _edges[name];

			}

		});

		//Эту функцию надо содать до вызова this.pushEdges(); потому что когда используется MyPoints для вывода на холст вершин вместо ребер,
		//вызывается this.project вместо this.pushEdges()
		/**
		 * Projects the universe onto the canvas 
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0, z: 0.0}] center of the universe
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
		 * @param {float} [params.center.z=0.0] Z axis of the center
		 */
		this.project = (scene, params = {}) => {

			//remove previous universe
			this.remove = (scene) => {

				for (var i = scene.children.length - 1; i >= 0; i--) {

					const child = scene.children[i];
					this.remove(child);
					scene.remove(child);
					if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);

				}

			}
			this.remove(scene);

			this.Test();

			this.color();

			if (this.setW) this.setW();
			let nd, myPoints;
			this.projectGeometry = () => {

				const intersection = (parent) => {

					if (!classSettings.intersection) return;

					if (classSettings.intersection.position === undefined) classSettings.intersection.position = 0;
					const mesh = this.intersection(classSettings.intersection.color === undefined ? "lightgray" ://0x0000FF : //blue
						classSettings.intersection.color, scene);

					//Localization

					const lang = {

						intersector: "Intersector",

					};

					switch (options.getLanguageCode()) {

						case 'ru'://Russian language

							lang.intersector = "Сечение";

							break;

					}
					mesh.name = lang.intersector;
					parent.add(mesh);
					if (options.guiSelectPoint) options.guiSelectPoint.addMesh(mesh);

				}

				const guiSelectPoint = settings.options.guiSelectPoint;
				if ((classSettings.edges != false) && classSettings.edges.project) {
	
					if (myPoints) {
						
						myPoints.visible = false;
						if (guiSelectPoint) {
							
							guiSelectPoint.removeMesh(myPoints, false);
							myPoints.children.forEach(child => guiSelectPoint.removeMesh(child, false));
						}

					}
					if (nd) {
						
						nd.object3D.visible = true;
						if (guiSelectPoint) {
							
							guiSelectPoint.addMesh(nd.object3D);
							nd.object3D.children.forEach(child => guiSelectPoint.addMesh(child));

						}
						
					} else {
						
						settings.scene = scene;
						if (settings.object.geometry.indices.edges.length === 0 ) this.pushEdges();
						else {
							
							if ((settings.object.geometry.position[0].length > 3 ) && (!settings.object.color)) settings.object.color = {};//Color of vertice from palette
							nd = new ND(this.dimension, settings);
			
							params.center = params.center || {}
							nd.object3D.position.x = params.center.x || 0;
							nd.object3D.position.y = params.center.y || 0;
							nd.object3D.position.z = params.center.z || 0;
							
							intersection(nd.object3D);

							if (this.onSelectScene) this.onSelectScene();

						}

					}
	
				} else {
	
					if (nd) {
	
						nd.object3D.visible = false;
						if (guiSelectPoint) {
							
							guiSelectPoint.removeMesh(nd.object3D);
							nd.object3D.children.forEach(child => guiSelectPoint.removeMesh(child, false));

						}
	
					}
					if (myPoints) {

						if (myPoints.visible != true) {
							
							myPoints.visible = true;
							if (guiSelectPoint) {
								
								guiSelectPoint.addMesh(myPoints);
								myPoints.children.forEach(child => guiSelectPoint.addMesh(child));
	
							}

						}
						
					} else {
						
						let points = settings.object.geometry.position;
		
						//for debug
						//Выводим углы вместо вершин. Нужно для отладки равномерного распределения верши во вселенной
						//См. randomPosition()
						/*
						points = [];
						settings.object.geometry.position.forEach(vertive => points.push(vertive.angles));
						*/

						if (
							(classSettings.settings.object.color != undefined) &&
							(typeof classSettings.settings.object.color != "object")
							//&& (classSettings.settings.object.geometry.position[0].length < 4)//цвет для всех вершин одновременно задается только если коодинаты вершин не содержат индекс цвета палитры. Другими словами если нет координаты w
						) {

							const color = new three.THREE.Color(classSettings.settings.object.color);
							classSettings.settings.options.setPalette(new ColorPicker.palette( { palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255, },] } ));
							
						}
				
						MyPoints(points, scene, {
							
							pointsOptions: {
								
								//shaderMaterial: false,
								name: settings.object.name,
								color: settings.object.color,
								colors: settings.object.geometry.colors,
								opacity: settings.object.geometry.opacity,
								onReady: (points) => {
									
									myPoints = points;
									intersection(points);
								
								}
							
							},
							options: settings.options,
							
						});
		
					}
					
				}

			}
			this.projectGeometry();

			options.onSelectScene = (index, t) => {

				if (index === 0) return;
				const geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
				if (edges.length === 0) {

					//Create edges
					this.onSelectScene = () => {
						
						options.onSelectScene(index, t);
						delete this.onSelectScene;
					
					}
					cEdges.setValue(true);
/*
					classSettings.edges = cookieOptions.edgesOld;//{ project: true };//edgesOld;
//					this.pushEdges();
//					displayEdge();
					_this.projectGeometry();
//					setCockie();
*/					
					return;

				}
				let progressBar, verticeId = 0;
				if ((typeof WebGPU != 'undefined') && WebGPU.isSupportWebGPU()) {

					const firstMatrix = [
						[1, 2, 3, 4],
						[5, 6, 7, 8]
					],
						secondMatrix = [
							[1, 2],
							[3, 4],
							[5, 6],
							[7, 8],
						];
					new WebGPU({

						input: { matrices: [firstMatrix, secondMatrix] },

						//shaderCode: shaderCode,
						shaderCodeFile: '../Shader.c',

						results: [

							{

								count: firstMatrix.length * secondMatrix[0].length +

									//result matrix has reserved three elements in the head of the matrix for size of the matrix.
									//First element is dimension of result matrix.
									//Second element is rows count of the matrix.
									//Third element is columns count of the matrix.
									//See settings.size of out2Matrix method in https://raw.githack.com/anhr/WebGPU/master/jsdoc/module-WebGPU-WebGPU.html
									3,
								out: out => {

									console.log('out:');
									console.log(new Float32Array(out));
									const matrix = WebGPU.out2Matrix(out);
									console.log('matrix:');
									console.log(matrix);

								}

							},
						],

					});

				}
				const vertices = [],
					timestamp = classSettings.debug ? window.performance.now() : undefined,
					step = () => {

						progressBar.value = verticeId;
						const stepItem = () => {

							const vertice = position.angles[verticeId];
							vertices.push([]);
							const oppositeVerticesId = vertice.oppositeVerticesId;

							//find middle point between opposite vertices
							const middlePoint = [];
							vertice.forEach((angle, angleId) => {

								middlePoint.push(0);
								const middlePointAngleId = middlePoint.length - 1;
/*								
								for (let i = 0; i < oppositeVerticesId.length; i ++) {

									const verticeIdOpposite = oppositeVerticesId[i];
									middlePoint[middlePointAngleId] += position[verticeIdOpposite].angles[angleId];
									
								}
*/								
								oppositeVerticesId.forEach(verticeIdOpposite => {
									
//									middlePoint[middlePointAngleId] += position[verticeIdOpposite].angles[angleId];
									let angle2OppositeVertice = position[verticeIdOpposite].angles[angleId] - angle;
									while(angle2OppositeVertice < -Math.PI) angle2OppositeVertice += 2 * Math.PI;
									while(angle2OppositeVertice > Math.PI) angle2OppositeVertice -= 2 * Math.PI;
									middlePoint[middlePointAngleId] += angle2OppositeVertice;
										
								});
								vertices[verticeId][angleId] = middlePoint[middlePointAngleId] / oppositeVerticesId.length + angle;

							});
							verticeId += 1;
							if (verticeId >= position.length) {

								progressBar.remove();

								for (verticeId = 0; verticeId < position.length; verticeId++) 
									position.angles[verticeId] = vertices[verticeId];//Обновление текущей верщины без обновления холста для экономии времени								
//									position[verticeId] = vertices[verticeId];//Обновление текущей верщины без обновления холста для экономии времени								

								//обновляю позицию первой вершины что бы обновить холст
								position[0][0] = position[0][0];
/*								
								//Последнюю вершину обновляю отдельно по каждой оси, потому что так ND обновляет холст
								verticeId = position.length - 1;
								//const vertice = position.angles[verticeId];
const vertice = position[verticeId];
								vertice.forEach((axis, axisId) => { vertice[axisId] = vertices[verticeId][axisId]; });
*/		

								if (classSettings.debug) {
									
									classSettings.debug.logTimestamp('Play step. ', timestamp);
//									console.log('time: ' + ((window.performance.now() - timestamp) / 1000) + ' sec.');
									this.logUniverse();

								}
								options.player.continue();
								return true;

							}

						}
						if (!stepItem()) progressBar.step();

					};
				progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

					sTitle: 't = ' + t + '<br> Take middle vertices',
					max: position.length - 1,

				});
				return true;//player pause

			}

			if (classSettings.debug)
				classSettings.debug.logTimestamp('Project. ');
				//console.log('time: Project. ' + ((window.performance.now() - this.classSettings.debug.timestamp) / 1000) + ' sec.');

		}
		if (classSettings.mode === undefined) classSettings.mode = 0;//решил оставить режим, в котором сначала добавляются ребра а потом уже создаются вершины для них
		switch(classSettings.mode) {

			//connect vertices by edges
			case 0:

				//default vertices
				if (this.verticesCountMin === undefined) {

					console.error(sUniverse + ': Please define verticesCountMin in your child class.');
					break;

				}
				const count = position.count === undefined ? this.verticesCountMin : position.count;
				if (count < 2) {

					console.error(sUniverse + ': Invalid classSettings.settings.object.geometry.position.count < 2');
					return;

				}
//				for (let i = 0; i < count; i++) position[i];//push vertice if not exists
				
				if (probabilityDensity) {
					
					//для 2D вселенной это плотность вероятности распределения вершин по поверхости сферы в зависимости от третьей координаты вершины z = vertice.[2]
					//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
					//Разбил сферу на sc = 5 сегментов от 0 до 4.
					//Границы сегментов вычисляю по фомулам:
					//Высота сегмента hs = d / sc = 2 / 5 = 0.4
					//Нижняя граница hb = hs * i - r
					//Верхняя граница ht = hs * (i + 1) - r
					//где r = 1 - радиус сферыб d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
					//0. From -1 to -0.6
					//1. From -0.6 to -0.2
					//2. From -0.2 to 0.2
					//3. From 0.2 to 0.6
					//4. From 0.6 to 1
					console.log('');
					console.log('Probability density.');
					const table = [];
					probabilityDensity.forEach((segment, segmentId) => {

						segment.density = segment.count / segment[_this.probabilityDensity.sectorValueName];//segment.square;
						segment.height = segment.ht - segment.hb;
						table.push(segment);
					
					})
					const sectorValueName = _this.probabilityDensity.sectorValueName;
					if (!sectorValueName) console.error(sUniverse + ': Invalid sectorValueName = ' + sectorValueName);
					console.table(table, ['count', 'hb', 'ht', 'height',
						sectorValueName,
						'density']);
					console.log('');
					classSettings.debug.logTimestamp('Push positions. ');
//					console.log('time: Push positions. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');

				}				
				if (classSettings.edges)//Для экономии времени не добавляю ребра если на холст вывожу только вершины
					this.pushEdges();
				else if (this.classSettings.projectParams) this.project(this.classSettings.projectParams.scene, this.classSettings.projectParams.params);
				
				break;
				
			case 1: indices.edges.pushEdges(); break;//push edges. сначала добавляются ребра а потом уже создаются вершины для них
			default: console.error(sUniverse + ': Unknown mode: ' + classSettings.mode); return;
				
		}

		let cEdges;
		if ( options.dat.gui ) {

			const getLanguageCode = options.getLanguageCode;
			
			//Localization
			
			const lang = {
	
				edges: 'Edges',
				edgesTitle: 'Create Edges',
	
				edge: 'Edge',
	
				project: 'Project',
				projectTitle: 'Project edges onto canvas',

			};
	
			const _languageCode = getLanguageCode();
	
			switch (_languageCode) {
	
				case 'ru'://Russian language
	
					lang.edges = 'Ребра';
					lang.edgesTitle = 'Создать ребра';
	
					lang.edge = 'Ребро';
					
					lang.project = 'Отображать';
					lang.projectTitle = 'Отображать ребра на холсте';

					break;
	
			}
			
			const cookieOptions = {};
			cookie.getObject(cookieName, cookieOptions);
			let edgesOld = cookieOptions.edgesOld || { project: true, };
			classSettings.edges = cookieOptions === false ? false : cookieOptions.edges || classSettings.edges;
			
			const fUniverse = options.dat.gui.addFolder(this.name( getLanguageCode )),
				objectEdges = { boEdges: ((typeof classSettings.edges) === 'object') || (classSettings.edges === true) ? true : false},
				setCockie = () => { cookie.setObject(cookieName, { edges: classSettings.edges, edgesOld: edgesOld, }); };
			cEdges = fUniverse.add( objectEdges, 'boEdges' ).onChange((boEdges) => {

					if (boEdges) {
						
						classSettings.edges = edgesOld;
						cProject.setValue(classSettings.edges.project);
						
					} else {

						edgesOld = classSettings.edges;
						classSettings.edges = false;
						
					}

					displayEdge();
					_this.projectGeometry();
					setCockie();
				
				} );
			const fEdge = fUniverse.addFolder(lang.edge),
				objectEdge = { boProject: ((typeof classSettings.edges) === 'object') ? classSettings.edges.project : false},
				cProject = fEdge.add( objectEdge, 'boProject' ).onChange((boProject) => {

					if (classSettings.edges.project === boProject) return;
					classSettings.edges.project = boProject;
					_this.projectGeometry();
					setCockie();
				
				} ),
				displayEdge = () => { fEdge.domElement.style.display = classSettings.edges === false ? 'none' : 'block'; };
			displayEdge();
			three.dat.controllerNameAndTitle( cEdges, lang.edges, lang.edgesTitle );
			three.dat.controllerNameAndTitle( cProject, lang.project, lang.projectTitle );
			
		}
		
	}

}

Universe.ND = ND;

export default Universe;

