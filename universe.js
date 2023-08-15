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
						if (i === edges.length) progressBar.remove();
						else progressBar.step();
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
	 * @param {object} projectParams Parameters of project the universe onto the canvas.
	 * @param {THREE.Scene} projectParams.scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {object} [projectParams.params={}] The following parameters are available
	 * @param {object} [projectParams.params.center={x: 0.0, y: 0.0, z: 0.0}] center of the universe
	 * @param {float} [projectParams.params.center.x=0.0] X axis of the center
	 * @param {float} [projectParams.params.center.y=0.0] Y axis of the center
	 * @param {float} [projectParams.params.center.z=0.0] Y axis of the center
	 * @param {object} [classSettings] <b>Universe</b> class settings.
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
	 * @param {function} classSettings.continue Callback function that called after universe edges was created.
	 **/
	constructor(options, projectParams, classSettings={}) {

		const _this = this;
		this.projectParams = projectParams;
		this.classSettings = classSettings;
		if (classSettings.radius === undefined) classSettings.radius = 1.0;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.options = options;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
		settings.object.geometry = settings.object.geometry || {};
		const randomPosition = () => {

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
			
		}

		settings.object.geometry.position = settings.object.geometry.position || {};
		const position = new Proxy([], {

			get: (_position, name) => {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i > _position.length) console.error(sUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					else if (i === _position.length) {

						settings.object.geometry.position.push();//randomPosition());

					}
					return _position[i];

				}
				switch (name) {

					case 'push': return (vertice = randomPosition()) => {

						return _position.push(new Proxy(vertice, {

							get: (vertice, name) => {

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

								}
								return vertice[name];

							},

						}));

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
				if (!isNaN(i)) {

					const vertice = _position[i];
					vertice.forEach((axis, axisId) => {
	
						vertice[axisId] = value[axisId];
	
					});

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
				for (let i = 0; i < count; i++) position[i];//push vertice if not exists//if (!(position[i])) position.push();
				
				this.pushEdges();
				break;
				
			case 1: indices.edges.pushEdges(); break;//push edges. сначала добавляются ребра а потом уже создаются вершины для них
			default: console.error(sUniverse + ': Unknown mode: ' + classSettings.mode); return;
				
		}
		
//		this.Indices();
		/* *
		 * Projects the universe onto the canvas 
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0}] center of the universe
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
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
			
//			settings.options = options;
			settings.scene = scene;
			const nd = new ND(this.dimension, settings);
			
			params.center = params.center || {}
			nd.object3D.position.x = params.center.x || 0;
			nd.object3D.position.y = params.center.y || 0;
			nd.object3D.position.z = params.center.z || 0;

			options.onSelectScene = (index, t) => {

				if (index === 0) return;
				let progressBar, verticeId = 0;
				const geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
				if ((typeof WebGPU != 'undefined') && WebGPU.isSupportWebGPU()){

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
					timestamp = window.performance.now(),
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

		}
		
	}

}

Universe.ND = ND;

export default Universe;

