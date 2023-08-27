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

//когда хочу вывести на холст точки вместо ребер то использую MyPoints вместо ND
import MyPoints from '../../commonNodeJS/master/myPoints/myPoints.js';

import MyThree from '../../commonNodeJS/master/myThree/myThree.js';
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
	 * @param {float} [classSettings.radius=1.0] Universe start radius.
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
	constructor(options,
//			projectParams,
			classSettings={}) {

		const _this = this;
		if (classSettings.debug) this.timestamp = window.performance.now();
//		this.projectParams = projectParams;
		this.classSettings = classSettings;
		if (classSettings.radius === undefined) classSettings.radius = 1.0;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.options = options;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
		settings.object.geometry = settings.object.geometry || {};
		const randomPosition = () => {

			//Sphere Point Picking
			//https://mathworld.wolfram.com/SpherePointPicking.html
			//Marsaglia (1972) method
			const x = [];
			let sum;

			//Если не делать этот цикл, то некоторые вершины будут иметь значения NaN и появится ошибка:
			//THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values. 
			//но при этом распределение вершин по вселенной все равно будет равномерным.
			//Не разобрался почему так происходит.
			do {

				x.length = 0;
				sum = 0;
				//picking x1 and x2 from independent uniform distributions on(-1, 1)
				for (let i = 0; i < (_this.dimension - 1); i++) {

					const random = Math.random() * 2 - 1;
					sum += random * random;
					x.push(random);

				}

			} while (sum >= 1);//rejecting points for which x1^2+x2^2>=1


			const ret = [];
			for (let i = 0; i < (_this.dimension - 1); i++) ret.push(2 * x[i] * Math.sqrt(1 - sum));
			ret.push(1 - 2 * sum);
			return ret;
/*
		   let x1, x2;
	 
			 //Если не делать этот цикл, то некоторые вершины будут иметь значения NaN и появится ошибка:
			//THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values. 
			 //но при этом распределение вершин по вселенной все равно будет равномерным.
			 //Не разобрался почему так происходит.
			do {

				//picking x1 and x2 from independent uniform distributions on(-1, 1)
				x1 = Math.random() * 2 - 1;
				x2 = Math.random() * 2 - 1;
//				if ((x1 * x1 + x2 * x2) >= 1) console.log('x1 = ' + x1 + ' x2 = ' + x2);
	
			} while ((x1 * x1 + x2 * x2) >= 1);//rejecting points for which x1^2+x2^2>=1

			
		   const sqrt = Math.sqrt(1 - x1 * x1 - x2 * x2);
		   return [
				2 * x1 * sqrt,//x = 2x_1sqrt(1-x_1^2-x_2^2)
				2 * x2 * sqrt,//2x_2sqrt(1-x_1^2-x_2^2)
				1 - 2 * (x1 * x1 + x2 * x2)//1-2(x_1^2+x_2^2)
			];
*/
   
//			return [x1, x2];
/*
			//Каждая вершина педставляет из себя набор углов поворота относительно центра вселенной в радианах для определенного момента времени
			//Центр вселенной это точка большого взрыва когда время равно нулю.
			//Например в одномерной вселенной _this.dimension = 2 каждая вершина это одномерный вектор v, указывающий на положение вершины на окружности.
			//v[0] это угол поворота. v.length = 1
			//Для двумерной вселенной _this.dimension = 3 каждая вершина это двумерный вектор v, указывающий на положение вершины на сфере.
			//v[0] это первый угол поворота.
			//v[2] это второй угол поворота.
			//v.length = 2
			const v = [];
//			for (let i = 0; i < (_this.dimension - 1); i++) v.push(Math.random() - 0.5);
			let radius = 0;
			do {

				v.length = 0;
				for (let i = 0; i < (_this.dimension - 1); i++) {

					let angle = Math.random() - 0.5;// * Math.PI * 2;
//					if (i === 1) angle *= Math.cos(angle);
					v.push(angle);

				}

				 //Для 2D вселенной все вершины должны находиться внутри круга чтобы вершины равномерно распределились по поверхности сферы
				radius = 0;
				v.forEach((angle) => {

//					angle = Math.abs(angle);
//					while(angle > 0.25) angle -= 0.25;
					radius += angle * angle;
				 
				});

			} while(Math.sqrt(radius) > 0.5);
//			v.forEach((angle) => radius += angle * angle);
//			if (Math.sqrt(radius) > 0.5) return;
			//v.forEach((angle, i) => v[i] = (v[i] + 0.5) * Math.PI * 2);
			v.forEach((angle, i) => v[i] = v[i] * Math.PI * 2);
			return v;
*/
/*			
			//Vector length limitation
			let v, ll, rr = classSettings.radius * classSettings.radius;
			do {
				
				const randomAxis = () => { return (Math.random() * 2 - 1) * classSettings.radius; };
				v = [];
				for (let i = 0; i < _this.dimension; i++) v.push(randomAxis());
				
				let vv = 0.0;
				v.forEach(axis => vv += axis * axis);
//								length = Math.sqrt(vv);
				ll = vv;

			}while(ll > rr)
			
			return v;
*/
			
		}

		settings.object.geometry.position = settings.object.geometry.position || {};

		//for debug
		//для 2D вселенной это плотность вероятности распределения вершин по поверхости сферы в зависимости от второго угла поворота вершины vertice.angles[1]
		//Плотности разбил на несколько диапазонов в зависимости от угла поворота vertice.angles[1]
		//Разбил окружность на 8 сегментов от 0 до 7.
		//Верхний предел угла поворота каждого сегмента вычисляю по формуле Math.PI * 2 / 16 * (2 * i + 1)
		//где i - номер сегмента
		const probabilityDensity = classSettings.debug ? [
			0,//0. From 0 to 0.39269908169872414 and 5.890486225480862 to 0
			0,//1. From 0.39269908169872414 to 1.1780972450961724
			0,//2. From 1.1780972450961724 to 1.9634954084936207
			0,//3. From 1.9634954084936207 to 2.748893571891069
			0,//4. From 2.748893571891069 to 3.5342917352885173
			0,//5. From 3.5342917352885173 to 4.319689898685965
			0,//6. From 4.319689898685965 to 5.105088062083414
			0,//7. From 5.105088062083414 to 5.890486225480862
		] : undefined;

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
										const vertice2 = vertice[2];
										return new MyThree.three.THREE.Vector4(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2, 1);

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
/*
										for(let angleId = value.length - 1; angleId > 0; angleId--) {

											const angle = value[angleId];
											if(angleId === 0) {

												const time = 1;
//												vertice = [time * Math.cos(angle), time * Math.sin(angle)];
												vertice.push(time * Math.cos(angle));
												vertice.push(time * Math.sin(angle));

											}
										}
*/													  
/*										
										switch(value.length) {

											case 1://1D universe
												const time = 1, theta = value[0];
												vertice.push(time * Math.cos(theta));
												vertice.push(time * Math.sin(theta));
												break;
											case 2: {//2D universe
												
													let theta = value[1];
													const time = 1;
													const z = time * Math.sin(theta),
														r = time * Math.cos(theta);
													theta = value[0];
													vertice.push(r * Math.cos(theta));
													vertice.push(r * Math.sin(theta));
													vertice.push(z);

												}
												break;
											default: console.error(sUniverse + ': Position set angles. Invalid angles count = ' + value.length);

										}
*/
										vertice.angles = value;
										return true;
										
								}
								vertice[name] = value;
								return true;
				
							}

						});
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

			if (typeof MyPoints === 'undefined') {

				settings.scene = scene;
				const nd = new ND(this.dimension, settings);
				/*				
								const nd = new ND(this.dimension, {
					
									options: settings.options,
									scene: settings.scene,
									object: {
					
										geometry: {
					
											position: settings.object.geometry.position,
					//						indices: [[[0, 1]]],//settings.object.geometry.indices,
											indices: settings.object.geometry.indices,
											
										},
										
									}
									
								});
				*/

				params.center = params.center || {}
				nd.object3D.position.x = params.center.x || 0;
				nd.object3D.position.y = params.center.y || 0;
				nd.object3D.position.z = params.center.z || 0;

			} else {

				let points = settings.object.geometry.position;

				/*
				//for debug
				//Выводим углы вместо вершин. Нужно для отладки равномерного распределения верши во вселенной
				//См. randomPosition()
				points = [];
				settings.object.geometry.position.forEach(vertive => points.push(vertive.angles));
				*/
				
				MyPoints(points, scene, {
					
					pointsOptions: {
						
						//shaderMaterial: false,
						name: settings.object.name,
					
					},
					options: {
						
						point: { size: 0.0 },
						guiSelectPoint: settings.options.guiSelectPoint,
					
					}
					
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
				let positionId = 0;
				for (let i = 0; i < count; i++) {

					const res = position[positionId];//push vertice if not exists//if (!(position[i])) position.push();
					if (res != undefined) positionId++;

				}
				
				if (this.classSettings.debug) {
					
					//для 2D вселенной это плотность вероятности распределения вершин по поверхости сферы в зависимости от второго угла поворота вершины vertice.angles[1]
					//Плотности разбил на несколько диапазонов в зависимости от угла поворота vertice.angles[1]
					//Разбил окружность на 8 сегментов от 0 до 7.
					//Верхний предел угла поворота каждого сегмента вычисляю по формуле Math.PI * 2 / 16 * (2 * i + 1)
					//где i - номер сегмента
					//0. From 0 to 0.39269908169872414 and 5.890486225480862 to 0
					//1. From 0.39269908169872414 to 1.1780972450961724
					//2. From 1.1780972450961724 to 1.9634954084936207
					//3. From 1.9634954084936207 to 2.748893571891069
					//4. From 2.748893571891069 to 3.5342917352885173
					//5. From 3.5342917352885173 to 4.319689898685965
					//6. From 4.319689898685965 to 5.105088062083414
					//7. From 5.105088062083414 to 5.890486225480862
					console.log('');
					console.log('Probability density.');
/*					
					console.table([
							['Equator', ((probabilityDensity[0] + probabilityDensity[4]) / 2)],
						],
						['Segment', 'Count'],
					);
*/
					function Sector(sector, count, angle) {
						
						this.sector = sector;
						this.count = count;
						this.angle = angle;
/*						
						this.angle = i === 0 ?
						  0 ://для нулевого сектора угол равен нулю. Иначе он буде равен минус угол первого сектора
						  Math.PI * 2 / 16 * (2 * i - 1);//угол беру по нижней границе сегмента потому что для полюсов сосинус верхней границы равен нулю и я не смогу поучить плотность вершин в сегменте;
*/		
						this.radius = Math.cos(this.angle);
						this.сircumference = Math.PI * 2 * this.radius;//длинна окружности
						this.density = this.count / this.сircumference;//Плотность вершин в секторе
						
					}
					
//					const tyrone = new Sector("Equator", ((probabilityDensity[0] + probabilityDensity[4]) / 2));
//					const janet = new Sector("Janet", "Smith");
//					const maria = new Sector("Maria", "Cruz");
					
					console.table([
						new Sector("Equator",          ((probabilityDensity[0] + probabilityDensity[4]) / 2),
							(Math.PI * 2 / 16 * (2 * 0 + 1) / 2)),//на экваторе средний угол находтся посередине между экватором и краем сектора
						new Sector("Middle latitudes", ((probabilityDensity[1] + probabilityDensity[3] + probabilityDensity[5] + probabilityDensity[7]) / 4),
							Math.PI * 2 / 16 * (2 * 1 + 0)//угол посередине среднего сектора
						),
						new Sector("Poles",            ((probabilityDensity[2] + probabilityDensity[6]) / 2),
							(Math.PI * 2 / 16 * (2 * 2 - 1) + Math.PI / 2) /2 ),//На полюсе средний угол находится между границей сектора и полюсом (90 градусов)
					], ['sector', "count", 'angle', 'radius', 'сircumference', 'density']);
/*					
					const log = (name, whitespace, count, i = 0) => {
						
//						console.log('  ' + name + ': ' + whitespace + 'count = ' + count + 
//							' angle = ' + Math.PI * 2 / 16 * (2 * i + 0));//угол беру по нижней границе сегмента потому что для полюсов сосинус верхней границы равен нулю и я не смогу поучить плотность вершин в сегменте
						
					}
//					console.log('  Equator: ' + ((probabilityDensity[0] + probabilityDensity[4]) / 2));
					log('Equator', '         ', ((probabilityDensity[0] + probabilityDensity[4]) / 2));
//					console.log('  Middle latitudes: ' + ((probabilityDensity[1] + probabilityDensity[3] + probabilityDensity[5] + probabilityDensity[7]) / 4));
					log('Middle latitudes', '',((probabilityDensity[1] + probabilityDensity[3] + probabilityDensity[5] + probabilityDensity[7]) / 4));
//					console.log('  Poles: ' + ((probabilityDensity[2] + probabilityDensity[6]) / 2));
					log('Poles', '           ', ((probabilityDensity[2] + probabilityDensity[6]) / 2));
*/					
					console.log('');		   
					console.log('time: Push positions. ' + ((window.performance.now() - this.timestamp) / 1000) + ' sec.');

				}				
				if (typeof MyPoints === 'undefined')//Для экономии времени не добавляю ребра если на холст вывожу только вершины
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

