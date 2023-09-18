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

//не используется
//import ColorPicker from '../../commonNodeJS/master/colorpicker/colorpicker.js';

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

//	project() { console.error(sOverride.replace('%s', 'project')); }
	name() { console.error(sOverride.replace('%s', 'name')); }
	logUniverse() {

		if (!this.classSettings.debug) return;
/*		
		geometry.position.forEach((vertice, i) => console.log('vertice[' + i + '] = ' + JSON.stringify(vertice) +
			' edges = ' + JSON.stringify(vertice.edges)));
		geometry.indices.edges.forEach((edge, i) => console.log('edges[' + i + '] = ' + JSON.stringify(edge)));
*/  
		let i = 0, progressBarValue = 0,
			log = 0;//position log
		const settings = this.classSettings.settings, geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges,
			sLogUniverse = sUniverse + ': logUniverse()',
			progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {

				switch (log){
					case 0://position log
						const vertice = position[i];
						console.log('vertice[' + i + '] = ' + JSON.stringify(vertice) + ' edges = ' + JSON.stringify(vertice.edges));
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
							if (this.classSettings.debug) console.log('time: Geometry log. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');
							
						} else progressBar.step();
						break;
					default: console.error(sLogUniverse + '. Invalid log = ' + log);
				}
/*				
				if (i === position.length) progressBar.remove();
				else progressBar.step();
*/	
				
			}, {

			sTitle: 'Geometry log',
//					max: (position.length - 1) * 2,
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
//	Indices() { console.error(sOverride.replace('%s', 'Indices')); }

	/**
	 * Base class for n dimensional universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe</b> class settings.
	 * @param {object} [classSettings.projectParams] Parameters of project the universe onto the canvas.
	 * @param {THREE.Scene} classSettings.projectParams.scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {object} [classSettings.projectParams.params={}] The following parameters are available
	 * @param {object} [classSettings.projectParams.params.center={x: 0.0, y: 0.0, z: 0.0}] center of the universe
	 * @param {float} [classSettings.projectParams.params.center.x=0.0] X axis of the center
	 * @param {float} [classSettings.projectParams.params.center.y=0.0] Y axis of the center
	 * @param {float} [classSettings.projectParams.params.center.z=0.0] Y axis of the center
	 * @param {float} [classSettings.t=1.0] Universe start time. Time is the radius of the Universe.
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] Universe object.
	 * @param {String} [classSettings.settings.object.name] name of universe.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Universe geometry.
	 * @param {array|object} [classSettings.settings.object.geometry.position] n-dimensional universe vertices.
	 * <pre>
	 * array - array of vertices.
	 *	Every item of array is n-dimensional vector of vertice of object.
	 *	Example of 1D universe with three vertices:
	 *	<b>classSettings.settings.object.geometry.position: [
	 *		[0, -1],//0
	 *		[0.8660254037844388, 0.5],//1
	 *		[-0.8660254037844384, 0.5]//2
	 *	]//triangle</b>,
	 * object - see below:
	 * </pre>
	 * @param {number} [classSettings.settings.object.geometry.position.count=3] vertices count.
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
	 * @param {boolean} [classSettings.debug=false] Debug mode. Diagnoses your code and display detected errors in console
	 * @param {function} [classSettings.continue] Callback function that called after universe edges was created.
	 **/
	constructor(options, classSettings={}) {

		const _this = this;
		if (classSettings.debug) this.timestamp = window.performance.now();
		this.classSettings = classSettings;
		if (classSettings.edges != false) classSettings.edges = classSettings.edges || {};
		if (classSettings.t === undefined) classSettings.t = 1.0;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.options = options;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
  
		//не получается сменить имя оси
		//if (options.scales.w.name === 'w') options.scales.w.name = 't';
  
		settings.object.geometry = settings.object.geometry || {};
		const randomPosition = () => {

			const ret = [],
				x = [];//random array
			let sum;

			const
				randomArray = (length = (_this.dimension - 1) * 2, array) => {

					//Если не делать этот цикл, то некоторые вершины будут иметь значения NaN и появится ошибка:
					//THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values. 
					//но при этом распределение вершин по вселенной все равно будет равномерным.
					//Не разобрался почему так происходит.
					do {

						if (!array) x.length = 0;
						sum = 0;
						if (array) array.length = 0;
						//picking x1 and x2 from independent uniform distributions on(-1, 1)
						for (let i = 0;
							i < length;
							//					i < 2;
							i++) {

							const random = Math.random() * 2 - 1;
							sum += random * random;
							(array || x).push(random);

						}

					} while (sum >= 1);//rejecting points for which x1^2+x2^2>=1

				},
				push0 = () => {

					randomArray();
/*
					//Если не делать этот цикл, то некоторые вершины будут иметь значения NaN и появится ошибка:
					//THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values. 
					//но при этом распределение вершин по вселенной все равно будет равномерным.
					//Не разобрался почему так происходит.
					do {

						x.length = 0;
						sum = 0;
						//picking x1 and x2 from independent uniform distributions on(-1, 1)
						for (let i = 0;
							i < (_this.dimension - 1) * 2;
							//					i < 2;
							i++) {

							const random = Math.random() * 2 - 1;
							sum += random * random;
							x.push(random);

						}

					} while (sum >= 1);//rejecting points for which x1^2+x2^2>=1
*/

					//ret.push((x[0] * x[0] + x[3] * x[3] - (x[1] * x[1] + x[2] * x[2])) / sum);//z	=	(x_0^2+x_3^2-x_1^2-x_2^2)/(x_0^2+x_1^2+x_2^2+x_3^2)
					let positive = x[0] * x[0], negative = x[1] * x[1];
					for (let i = 0; i < (_this.dimension - 2); i++) {

						const p = x[_this.dimension - i], n = x[2 + i];
						positive += p * p;
						negative += n * n;

					}
					ret.push((positive - negative) / sum);

				}
   
			switch(_this.dimension) {

				case 2://1D universe

					//Circle Point Picking
					//https://mathworld.wolfram.com/CirclePointPicking.html
//					ret.push((x[0] * x[0] - x[1] * x[1]) / sum);//x	=	(x_1^2-x_2^2)/(x_1^2+x_2^2)	
					push0();
					ret.push(2 * x[0] * x[1] / sum);//y	=	(2x_1x_2)/(x_1^2+x_2^2)
					break;
				case 3://2D universe
					
					//Sphere Point Picking
					//https://mathworld.wolfram.com/SpherePointPicking.html
					//Cook (1957) extended a method of von Neumann (1951)
//					ret.push((x[0] * x[0] + x[3] * x[3] - x[1] * x[1] - x[2] * x[2]) / sum);//z	=	(x_0^2+x_3^2-x_1^2-x_2^2)/(x_0^2+x_1^2+x_2^2+x_3^2)
					push0();
					ret.push(2 * (x[0] * x[1] - x[2] * x[3]) / sum);//y	=	(2(x_2x_3-x_0x_1))/(x_0^2+x_1^2+x_2^2+x_3^2)	
					ret.push(2 * (x[1] * x[3] + x[0] * x[2]) / sum);//x	=	(2(x_1x_3+x_0x_2))/(x_0^2+x_1^2+x_2^2+x_3^2)	
	 
					//Marsaglia (1972) method
//					for (let i = 0; i < (_this.dimension - 1); i++) ret.push(2 * x[i] * Math.sqrt(1 - sum));
//					ret.push(1 - 2 * sum);
	 
					 break;
				case 4://3D universe

//					randomArray(3, ret);
					
					//Hypersphere Point Picking
					//https://mathworld.wolfram.com/HyperspherePointPicking.html
					//Marsaglia (1972)

					//set x - random array
					randomArray(2);
					const sum1 = sum, x2 = [];
					randomArray(2, x2);
					x2.forEach(item => x.push(item));

					ret.push(x[0]);//x	=	x_1	
					ret.push(x[1]);//y	=	x_2	
					const sqrt = Math.sqrt((1 - sum1) / sum);//sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2)
					ret.push(x[2] * sqrt);//z	=	x_3sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2))	
					ret.push(x[3] * sqrt);;//w	=	x_4sqrt((1-x_1^2-x_2^2)/(x_3^2+x_4^2))
					
					break;
				default: console.error(sUniverse + ': randomPosition. Invalid universe dimension = ' + _this.dimension);

			}

			sum = 0;
			ret.forEach((axis, i) => {

				sum += ret[i] * ret[i]; 
				ret[i] *= classSettings.t
			
			});
			if (classSettings.debug && (Math.abs(sum - 1) > 7.0e-16)) console.error(sUniverse + ': randomPosition. Vertice[' + ret + '] is not situated at a constant distance 1. Real distance is ' + sum)
			return ret;
			
		}

		settings.object.geometry.position = settings.object.geometry.position || {};

		//for debug
		//для 2D вселенной это плотность вероятности распределения вершин по поверхости сферы в зависимости от третьей координаты вершины z = vertice.[2]
		//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
		//Разбил сферу на sc = 5 сегментов от 0 до 4.
		//Границы сегментов вычисляю по фомулам:
		//Высота сегмента hs = d / sc = 2 / 5 = 0.4
		//Нижняя граница сегмента hb = hs * i - r
		//Верхняя граница сегмента ht = hs * (i + 1) - r
		//где r = 1 - радиус сферыб d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
		const probabilityDensity = classSettings.debug
//			&& _this.dimension < 4//Для 3D вселенной плотность не вычисляю так как с этим нет проблем 
			?
			[
				/*
				{ count: 0, },//0. From -1 to -0.6
				{ count: 0, },//1. From -0.6 to -0.2
				{ count: 0, },//2. From -0.2 to 0.2
				{ count: 0, },//3. From 0.2 to 0.6
				{ count: 0, },//4. From 0.6 to 1
				*/
			] : undefined;
		if (probabilityDensity) {
			
			for (let i = 0; i < 5; i++) probabilityDensity.push({

				count: 0,
//				get density() { return 22; },
				
			});
			probabilityDensity.options = {

//				r: classSettings.t,
				d: classSettings.t * 2,

			};
//			probabilityDensity.options.d = probabilityDensity.options.r * 2;
			probabilityDensity.options.sc = probabilityDensity.length;//Количество сегментов
			probabilityDensity.options.hs = probabilityDensity.options.d / probabilityDensity.options.sc;//Высота сегмента
//			let segmentsSquare = 0;
			let sectorsValue = 0;
			probabilityDensity.forEach((sector, i) => {

				sector.hb = probabilityDensity.options.hs * i - classSettings.t;//Нижняя граница сегмента
				sector.ht = probabilityDensity.options.hs * (i + 1) - classSettings.t;//Верхняя граница сегмента
/*				
				sector.hb = probabilityDensity.options.hs * i - probabilityDensity.options.r;//Нижняя граница сегмента
				sector.ht = probabilityDensity.options.hs * (i + 1) - probabilityDensity.options.r;//Верхняя граница сегмента
*/	
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
/*
		//для 2D вселенной это плотность вероятности распределения вершин по поверхости сферы в зависимости от второго угла поворота вершины vertice.angles[1]
		//Плотности разбил на несколько диапазонов в зависимости от угла поворота vertice.angles[1]
		//Разбил сферу на 8 сегментов от 0 до 7.
		//Верхний предел угла поворота каждого сегмента вычисляю по формуле Math.PI * 2 / 16 * (2 * i + 1)
		//где i - индекс сегмента
		const probabilityDensity = classSettings.debug ?
		[
			0,//0. From 0 to 0.39269908169872414 and 5.890486225480862 to 0
			0,//1. From 0.39269908169872414 to 1.1780972450961724
			0,//2. From 1.1780972450961724 to 1.9634954084936207
			0,//3. From 1.9634954084936207 to 2.748893571891069
			0,//4. From 2.748893571891069 to 3.5342917352885173
			0,//5. From 3.5342917352885173 to 4.319689898685965
			0,//6. From 4.319689898685965 to 5.105088062083414
			0,//7. From 5.105088062083414 to 5.890486225480862
		] : undefined;
*/

		const position = new Proxy([], {

			get: (_position, name) => {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i > _position.length) console.error(sUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					else if (i === _position.length) settings.object.geometry.position.push();
					return _position[i];

				}
				switch (name) {

					case 'push': return (position = randomPosition()) =>//(angles = randomPosition()) =>
						{

//						if (angles === undefined) return;
						
						const proxy = new Proxy(position, {

							get: (vertice, name) => {

/*								
								const i = parseInt(name);
								if (!isNaN(i)) {
												
									//https://observablehq.com/@thuvee0pan/cartesian-and-polar-coordinates
									const time = 1, theta = vertice[0];
									switch(i){
																			
										case 0: return time * Math.cos(theta);
										case 1: return time * Math.sin(theta);
																			
									}
									console.error(sUniverse + ': get vertice[' + i + '] failed.')
									return;
												
								}
*/
								switch (name) {

/*See ND distanceTo
									case 'distanceTo': return (verticeTo) => {

										if (vertice.length != verticeTo.length) {

											console.error(sUniverse + ': settings.object.geometry.position[i].distanceTo(...). vertice.length != verticeTo.length');
											return;

										}
										//const distance = new three.THREE.Vector3(vertice[0], vertice[1], vertice[2], ).distanceTo(new three.THREE.Vector3(verticeTo[0], verticeTo[1], verticeTo[2], ));
										let sum = 0;
										vertice.forEach((axis, i) => {

											const d = axis - verticeTo[i];
											sum += d * d;

										})
										return Math.sqrt(sum);
									}
*/										
									case 'edges':

										//										if (!classSettings.debug && !verticeEdges)
										if (!classSettings.debug) {

											console.error(sUniverse + ': vertice.edges. Set debug = true first.');
											return;

										}
										vertice.edges = vertice.edges || new Proxy([], {

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
										return vertice.edges;

									case 'oppositeVerticesId':
										vertice.oppositeVerticesId = vertice.oppositeVerticesId || [];
										break;
/*
									case 'length':
										//в декартовой системе коодинат количество осей на единицу больше количества углов в полярной системе координат
										return vertice.length + 1;
*/
									case 'vector':
										//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
										const vertice2 = vertice[2], vertice3 = vertice[3];
										return new three.THREE.Vector4(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2, vertice3 === undefined ? 1 : vertice3);
									case 'w':
										//для совместимости с Player.getColors. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
										return vertice[3];

								}
								return vertice[name];

							},
							set: (vertice, name, value) => {
				
								switch (name) {
					
									case 'angles':
/*										
										//https://observablehq.com/@thuvee0pan/cartesian-and-polar-coordinates
										// Given an object in Polar coordiantes { r: …, theta: … } 
										// compute its Cartesian coordinates { x: …, y: … }
										function polar_to_cartesian({ r, theta }) {
						
											return [r * Math.cos(theta), r * Math.sin(theta)];
											
										}
										vertice = polar_to_cartesian({ r: 1, theta: value[0] });
*/
/*Сейчас probabilityDensity вычисляю сразу после создания этого Proxy
										if (classSettings.debug) {

											let boDetected = false;
											const angle = value[1];
											for (let i = 0; i < 8; i++) {

												if (Math.PI * 2 / 16 * (2 * i + 1) > angle) {

													probabilityDensity[i]++;
													boDetected = true;
													break;

												}
											}
											if (!boDetected) {

												probabilityDensity[0]++;
												//console.error(sUniverse + ': Set angles. Probability density. Angle = ' + angle + '. Segment is not detected');

											}

										}
*/								
/*
										vertice.length = 0;
										
										//https://observablehq.com/@thuvee0pan/cartesian-and-polar-coordinates
										value.forEach((angle, angleId) => {

											const time = 1;
											if(angleId === 0) {

//												vertice = [time * Math.cos(angle), time * Math.sin(angle)];
												vertice.push(time * Math.cos(angle));
												vertice.push(time * Math.sin(angle));

											} else {

												const r = Math.cos(angle);
												if (classSettings.debug) {
													
													let boDetected = false;
													for (let i = 0; i < 8; i++){
	
														if (Math.PI * 2 / 16 * (2 * i + 1) > angle) {
	
															probabilityDensity[i]++;
															boDetected = true;
															break;
															
														}
													}
													if (!boDetected) {

														probabilityDensity[0]++;
														//console.error(sUniverse + ': Set angles. Probability density. Angle = ' + angle + '. Segment is not detected');

													}
													
												}
												vertice.forEach((axis, axisId) => vertice[axisId] = axis * r);
												vertice.push(time * Math.sin(angle));
												
											}
										});
*/
										vertice.angles = value;
										return true;
										
								}
								vertice[name] = value;
								return true;
				
							}

						});

						if (probabilityDensity) {
							
							//Для 2D вселенной.
							//Плотность вероятности распределения вершин по поверхости сферы в зависимости от третьей координаты вершины z = vertice.[2]
							//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
							//Разбил сферу на sc = probabilityDensity.length = 5 сегментов от 0 до 4.
							//Границы сегментов вычисляю по фомулам:
							//Высота сегмента hs = d / sc = 2 / 5 = 0.4
							//Нижняя граница сегмента hb = hs * i - r
							//Верхняя граница сегмента ht = hs * (i + 1) - r
							//где r = 1 - радиус сферы, d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
							const z = position[position.length - 1];
							let boDetected = false;
							for (let i = 0; i < probabilityDensity.options.sc; i++) {

								const segment = probabilityDensity[i];
								if (
									(segment.hb <= z) &&//Нижняя граница сегмента
									(segment.ht > z)//Верхняя граница сегмента
								) {

									segment.count++;
									boDetected = true;
									break;
									
								}
								
							}
							if (!boDetected) {

								//probabilityDensity[0]++;
								console.error(sUniverse + ': add vertice. Probability density. z = ' + z + '. Segment is not detected');

							}
							
						}
							
/*							
						//используется для вычисления плотности вероятности распределения вершин по поверхости сферы probabilityDensity
						proxy.angles = [
							Math.acos(position[0]),
							Math.asin(position[2])
						];
*/	  
//						proxy.angles = angles;
						return _position.push(proxy);

					};

					//for debug
					case 'test': return () => {

						if (!classSettings.debug) return;

						_position.forEach( ( vertice, verticeId ) => {

							const strVerticeId = 'vertice[' + verticeId + ']'
							_this.TestVertice( vertice, strVerticeId );
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
				if ( !isNaN(i)) {

					if (value instanceof Array === true) {//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
						
						const vertice = _position[i];
						vertice.forEach((axis, axisId) => {
		
							vertice[axisId] = value[axisId];
		
						});

					}

				} else {

					_position[name] = value;

				}
				return true;

			}

		});
		
		if(!(settings.object.geometry.position instanceof Array))
			Object.keys(settings.object.geometry.position).forEach((key) => position[key] = settings.object.geometry.position[key]);

		//convert vertices to Proxy
		else settings.object.geometry.position.forEach(vertice => position.push(vertice));

		settings.object.geometry.position = position;
		
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
//					if (classSettings.debug || verticeEdges)
					if (classSettings.debug)
						vertice.edges.push(edgeId === undefined ? _edges.length : edgeId, verticeId);
					
				}
				switch (name) {

					case 'push': return (edge=[]) => {

						const position = settings.object.geometry.position;
						setVertice(edge, 0, edge[0] === undefined ? _edges.length : edge[0]);
						setVertice(edge, 1, edge[1] === undefined ? _edges.length + 1 : edge[1]);
						if (classSettings.debug) _edges.forEach((edgeCur, i) => { if (((edgeCur[0] === edge[0]) && (edgeCur[1] === edge[1])) || ((edgeCur[0] === edge[1]) && (edgeCur[1] === edge[0]))) console.error(sUniverse + ': edges[' + i + ']. Duplicate edge[' + edge + ']') });

/*						
						position[edge[0]].oppositeVertices.push(position[edge[1]]);
						position[edge[1]].oppositeVertices.push(position[edge[0]]);
*/
						position[edge[0]].oppositeVerticesId.push(edge[1]);
						position[edge[1]].oppositeVerticesId.push(edge[0]);

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
					scene.remove(child);
					if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);

				}

			}
			this.remove(scene);

			this.Test();

			if (this.setW) this.setW();

			if ((classSettings.edges != false) && (classSettings.edges.project === undefined)) classSettings.edges.project = true;
//			if (typeof MyPoints === 'undefined')
			if ((classSettings.edges != false) && classSettings.edges.project) {

				settings.scene = scene;
				if ((settings.object.geometry.position[0].length > 3 ) && (!settings.object.color)) settings.object.color = {};//Color of vertice from palette
				const nd = new ND(this.dimension, settings);

				params.center = params.center || {}
				nd.object3D.position.x = params.center.x || 0;
				nd.object3D.position.y = params.center.y || 0;
				nd.object3D.position.z = params.center.z || 0;

			} else {

				let points = settings.object.geometry.position;

				//for debug
				//Выводим углы вместо вершин. Нужно для отладки равномерного распределения верши во вселенной
				//См. randomPosition()
				/*
				points = [];
				settings.object.geometry.position.forEach(vertive => points.push(vertive.angles));
				*/

		
				MyPoints(points, scene, {
					
					pointsOptions: {
						
						//shaderMaterial: false,
						name: settings.object.name,
					
					},
					options: settings.options,
					
				});

			}

			options.onSelectScene = (index, t) => {

				if (index === 0) return;
				let progressBar, verticeId = 0;
				const geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
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

							const vertice = position[verticeId];
							vertices.push([]);
							/*						
													const oppositeVertices = [];
													vertice.edges.forEach(edgeId => {
													
														const edge = edges[edgeId],
															verticeIdOpposite = edge[0] === verticeId ? edge[1] : edge[1] === verticeId ? edge[0] : undefined;
														if (verticeIdOpposite === undefined) console.error(sUniverse + ': options.onSelectScene. Invalid opposite verticeId');
														oppositeVertices.push(position[verticeIdOpposite]);
													
													});
							*/
							const oppositeVerticesId = vertice.oppositeVerticesId;

							//find middle point between opposite vertices
							const middlePoint = [];
							vertice.forEach((axis, axisId) => {

								middlePoint.push(0);
								const middlePointAxisId = middlePoint.length - 1;
								//								oppositeVertices.forEach(oppositeVertice => middlePoint[middlePointAxisId] += oppositeVertice[axisId]);
								oppositeVerticesId.forEach(verticeIdOpposite => middlePoint[middlePointAxisId] += position[verticeIdOpposite][axisId]);
								//						vertice[axisId] = middlePoint[middlePointAxisId] / vertice.length;
								vertices[verticeId][axisId] = middlePoint[middlePointAxisId] / vertice.length;

							});
							verticeId += 1;
							if (verticeId >= position.length) {

								//							if (classSettings.debug) console.log('time: Copy vertices. ' + ((window.performance.now() - timestamp) / 1000) + ' sec.');
								progressBar.remove();

								for (verticeId = 0; verticeId < (position.length - 1); verticeId++) {

									position[verticeId] = vertices[verticeId];//Обновление текущей верщины без обновления холста для экономии времени								

								}

								//Последнюю вершину обновляю отдельно по каждой оси, потому что так ND обновляет холст
								verticeId = position.length - 1;
								const vertice = position[verticeId];
								vertice.forEach((axis, axisId) => {

									vertice[axisId] = vertices[verticeId][axisId];

								});

								if (classSettings.debug) console.log('time: ' + ((window.performance.now() - timestamp) / 1000) + ' sec.');
								options.player.continue();
								return true;

							}

						}
						/*						
												let stop = false;
												for (let i = 0; i < 10; i++) {
						
													stop = stepItem();
													if (stop) break;
												
												}
												if (!stop) progressBar.step();
						*/
						if (!stepItem()) progressBar.step();

					};
				progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

					sTitle: 't = ' + t + '<br> Take middle vertices',
					//					max: (position.length - 1) * 2,
					max: position.length - 1,

				});
				return true;//player pause

			}
			if (classSettings.debug) console.log('time: Project. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');

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
				for (let i = 0; i < count; i++) position[i];//push vertice if not exists
				
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
						sectorValueName,//'square',
						'density']);
					console.log('');		   
					console.log('time: Push positions. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');

				}				
//				if (typeof MyPoints === 'undefined')//Для экономии времени не добавляю ребра если на холст вывожу только вершины
				if (classSettings.edges)//Для экономии времени не добавляю ребра если на холст вывожу только вершины
					this.pushEdges();
				else if (this.classSettings.projectParams) this.project(this.classSettings.projectParams.scene, this.classSettings.projectParams.params);
				
				break;
				
			case 1: indices.edges.pushEdges(); break;//push edges. сначала добавляются ребра а потом уже создаются вершины для них
			default: console.error(sUniverse + ': Unknown mode: ' + classSettings.mode); return;
				
		}
		
//		this.Indices();
		
	}

}

Universe.ND = ND;

export default Universe;

