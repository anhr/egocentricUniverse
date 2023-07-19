/**
 * @module Universe
 * @description base class for n dimensional universe.
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

const sUniverse = 'Universe', sOverride = sUniverse + ': Please override the %s method in your child class.';

class Universe {

	//base methods

//	project() { console.error(sOverride.replace('%s', 'project')); }
	name() { console.error(sOverride.replace('%s', 'name')); }
	logUniverse() {

		if (!this.classSettings.debug) return;
		this.classSettings.settings.object.geometry.position.forEach((vertice, i) => console.log('vertice[' + i + '] = ' + JSON.stringify(vertice) +
			' edges = ' + JSON.stringify(vertice.edges)));
		this.classSettings.settings.object.geometry.indices.edges.forEach((edge, i) => console.log('edges[' + i + '] = ' + JSON.stringify(edge)));
		
	}
//	Indices() { console.error(sOverride.replace('%s', 'Indices')); }
	Test(){

		const geometry = this.classSettings.settings.object.geometry;
		geometry.position.test();
		geometry.indices.faces.test();
		
	}

	constructor(options, classSettings={}) {

		const _this = this;
		this.classSettings = classSettings;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
		settings.object.geometry = settings.object.geometry || {};
//		settings.object.geometry.position = new Proxy(settings.object.geometry.position || [],
		const position = new Proxy([], {

			get: function (_position, name) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i > _position.length) console.error(sUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					else if (i === _position.length) {
						

						const randomPosition = () => {
	
							const randomAxis = () => { return Math.random() * 2 - 1; };
							return [randomAxis(), randomAxis()];
							
						}
//						_position.push(randomPosition());
						settings.object.geometry.position.push(randomPosition());

					}
					return _position[i];

				}
				switch (name) {

					case 'push': return (vertice = []) => {

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

										if (!classSettings.debug) {

											console.error(sUniverse + ': vertice.edges. Set debug = true first.');
											return;

										}
										vertice.edges = vertice.edges || new Proxy([], {

											get: (edges, name) => {

												switch (name) {

													case 'push': return (edgeId, verticeId) => {

/*														
														if (typeof edgeId === "object") {

															//find edgeId
															const edges = settings.object.geometry.indices.edges;
															for (let i = 0; i < edges.length; i++) {

																const edge = edges[i];
																if ((edge[0] === edgeId[0]) && (edge[1] === edgeId[1]) || (edge[0] === edgeId[1]) || (edge[1] === edgeId[0])){

																	edgeId = i;
																	break;
																	
																}
																
															}
															
														}
*/														
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

								}
								return vertice[name];

							},

						}));

					};
//						break;
					//for debug
					case 'test': return () => {

						if (!_this.debug) return;

						_position.forEach( ( vertice, verticeId ) => {

							const strVerticeId = 'position[' + verticeId + ']'
							_this.TestVertice( vertice, strVerticeId );
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(sUniverse + ': position.test()', strVerticeId = 'position(' + verticeId + ')' + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

							});

						})
					}
//						break;

				}
				return _position[name];

			},
			set: function (_position, name, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					value.forEach((axis, j) => {

						if (isNaN(axis)) console.error(sUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis);
						else if ((_position[i].push(axis) - 1) != j)
							console.error(sUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis + ' Invalid new axis index = ' + j);

					});

				}
				return true;

			}

		});

		settings.object.geometry.position = settings.object.geometry.position || [];
		
		//convert vertices to Proxy
		settings.object.geometry.position.forEach(vertice => position.push(vertice));
		//if (settings.object.geometry.position) settings.object.geometry.position.forEach();

		settings.object.geometry.position = position;
		
		settings.object.geometry.indices = settings.object.geometry.indices || [];
		if (!(settings.object.geometry.indices instanceof Array)) {

			const indices = [];
			Object.keys(settings.object.geometry.indices).forEach((key) => indices[key] = settings.object.geometry.indices[key]);
			settings.object.geometry.indices = indices;
			
		}
		const indices = settings.object.geometry.indices;
		indices[0] = indices[0] || [];
		if (indices.edges && !(indices.edges instanceof Array)) {

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
				switch (name) {

					case 'push': return (edge=[]) => {

						const position = settings.object.geometry.position;
//						if (edge[0] === undefined) edge[0] = (position.length ? position.length : position.push(randomPosition())) - 1;
						const setVertice = (edgeVerticeId, verticeId) => {

							const vertice = position[verticeId];//push random vertice if not exists
							edge[edgeVerticeId] = verticeId;
							if (classSettings.debug) vertice.edges.push(_edges.length, verticeId);
							
						}
						if (edge[0] === undefined) {

//							position[_edges.length];//push random vertice if not exists
//							edge[0] = _edges.length;
							setVertice(0, _edges.length);

						}
						if (edge[1] === undefined) {

/*							
							const edge1 = _edges.length + 1;
							position[edge1];//push random vertice if not exists
							edge[1] = edge1;
*/	   
							setVertice(1, _edges.length + 1);

						}
						const edgesLength = _edges.push(edge);
						return edgesLength;

					};

				}
				return _edges[name];

			}

		});
		indices.edges.count = indices.edges.count || 3;
		for (let i = 0; i < indices.edges.count - 1; i++) indices.edges.push();
		indices.edges.push([settings.object.geometry.position.length - 1, 0])//loop edges
		this.Indices();
		/**
		 * Projects a circle to the canvas 
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0}] center of the sphere
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
			
			settings.options = options;
			settings.scene = scene;
			new ND(2, settings);

		}
		
	}

}

Universe.ND = ND;

export default Universe;

