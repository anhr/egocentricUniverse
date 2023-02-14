/**
 * @module EgocentricUniverse
 * @description Egocentric universe
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


//import ND from '../../commonNodeJS/master/nD/nD.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
//if (ND.default) ND = ND.default;

class EgocentricUniverse {

	/**
	 * Egocentric universe.
	 * */
	constructor() {

		const n = 1;//Universe dimension

		/**
		 * @description Array of <b>indices</b> of vertices of the n-dimensional universe.
		 * <pre>
		 * <b>Indices</b> is divided to segments:
		 * 
		 * <b>indices[0]</b> is edges. Every edge is two indexes of the edge's vertices. Used in 1D universe and higher.
		 * <b>indices[1]</b> is faces. Every face is three indexes of the edges from <b>indices[0]</b>. Used in 2D objects and higher.
		 * <b>indices[2]</b> is bodies. Every bodie is four face indexes from <b>indices[1]</b>. Used in 3D objects and higher.
		 * For example:
		 * 
		 * <b>n</b> = 1 universe is line.
		 * vertices = [
		 *	0: Vertice {}//First vertice
		 *	1: Vertice {}//Second vertice
		 *	2: Vertice {}//third vertice
		 * ]
		 * indices[0] = [
		 *	//3 edges
		 *	0: {
		 *		//First edge
		 *		disatance: 1,
		 *		vertices: [
		 *			1,//index of the second vertice
		 *			0,//index of the first vertice
		 *		]
		 *	},
		 *	1: {
		 *		//Second edge
		 *		disatance: 1,
		 *		vertices: [
		 *			2,//index of the third vertice
		 *			1,//index of the second vertice
		 *		]
		 *	},
		 *	2: {
		 *		//third edge
		 *		disatance: 1,
		 *		vertices: [
		 *			2,//index of the third vertice
		 *			0,//index of the first vertice
		 *		]
		 *	},
		 * ]
		 * </pre>
		 */
		const indices = new Proxy([], {

			get: function (_indices, name) {

/*
				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i >= _indices.length)
						console.error('EgocentricUniverse: indices get. Invalid index = ' + i + ' indices.length = ' + _indices.length);
					return _indices[i];

				}
*/
				switch (name) {

					case 'edges': return _indices[0];
						
				}
				console.error('EgocentricUniverse: indices get: invalid name: ' + name);
				return;// _indices[name];

			},
			set: function (_indices, name, value) {

				switch (name){

					case 'edges':
						if (_indices[0] === undefined)
							_indices[0] = value;
						break;
					default: console.error('EgocentricUniverse: indices set: invalid name: ' + name);
					
				}
				return true;

			}

		});

		/**
		 * @description array of edges.
		 * */
		//const edges = [];

		/**
		 * @description array of Vertices.
		 **/
		const vertices = new Proxy([], {

			get: function (_vertices, name) {

				const i = parseInt(name);
				if (!isNaN(i)) {

/*					
					console.error('EgocentricUniverse: vertices get. Hidden method: vertices[' + i + ']');
					return;
*/	 
					if (i >= _vertices.length)
						console.error('EgocentricUniverse: vertices get. Invalid index = ' + i + ' vertices.length = ' + _vertices.length);
					return _vertices[i];

				}
				switch (name) {

					case 'push': return () => {

						//vertices.push(new Vertice(verticeEdges);//не хочу добавлять new Vertice(value) непосредственно в vertices потомучто хочу иметь одно место где создается new Vertice

//						vertices[_vertices.length] = verticeEdges;

						class Vertice {


							/**
							* @description Universe point is array of edge indices to other nearest universe vertices.
							* @param {Array|number} [verticeEdges=0] Array - array of edge indices to other nearest universe vertices.
							* <pre>
							* number - distance between this vertice and first nearest vertice.
							* </pre>
							*/
							constructor() {

		//						if (!(verticeEdges instanceof Array)) verticeEdges = [verticeEdges];
		/*						
								const verticeEdgesCount = n === 1 ? 2 : undefined;
								for ( let i = 0; i < verticeEdgesCount; i++ ) {

									let verticeEdge = verticeEdges[i];
									verticeEdge = verticeEdge || {};
									if ( verticeEdge.d === undefined ) verticeEdge.d = 1.0;
							
									edges.push( verticeEdge.d );
							
								}
		*/
		/*
								return new Proxy(verticeEdges, {

									get: function (verticeEdges, name) {

										const i = parseInt(name);
										if (!isNaN(i)) {

											if (name >= points.length)
												console.error('EgocentricUniverse: Vertice get. Invalid index = ' + name);
											const vertice = new VectorWebGPU(this.out, i);

											return vertice;

										}
										switch (name) {

											case 'length': console.error('EgocentricUniverse: Vertice get. Invalid ' + name); break;

										}

										return verticeEdges[name];

									},
									set: function (verticeEdges, name, value) {
										const i = parseInt(name);
										if (!isNaN(i)) {

											if (name >= points.length)
												console.error('EgocentricUniverse: Vertice set. Invalid index = ' + name);

										}
										verticeEdges[name] = value;
										return true;

									},

								});
		*/

							}

						}
		/*						
						if ((value === undefined) || !value.isVertice) value = new Vertice(value);
						array[name] = value;
		*/						
				
						const verticeIndex = _vertices.push(new Vertice()) - 1;

						//add edge
						if (verticeIndex > 0) {

							/**
							 * @description array of edges.
							 * */
/*							
indices[0] = [];
							indices.edges = indices[0];
*/
							indices.edges = new Proxy([], {

								get: function (_edges, name) {

					/*
									const i = parseInt(name);
									if (!isNaN(i)) {
									
										if (i >= _edges.length)
											console.error('EgocentricUniverse: indices.edges get. Invalid index = ' + i + ' indices.edges.length = ' + _edges.length);
										return _edges[i];
									
									}
					*/
									switch (name) {

										case 'push': return (edge) => {

											console.log('EgocentricUniverse: indices.edges.push(' + edge + ')');
											class Edge {

												constructor(edge) {

													console.log('EgocentricUniverse: indices.edges Edge: ');
													console.log(edge);

													return new Proxy(edge, {

														get: function (edge, name) {

															const i = parseInt(name);
															if (!isNaN(i)) {

																if (name >= edge.length)
																	console.error('EgocentricUniverse: Edge get. Invalid index = ' + name);
																return edge[name];

															}
/*
															switch (name) {

																case 'length': console.error('EgocentricUniverse: Vertice get. Invalid ' + name); break;

															}
*/
															return edge[name];

														},
														set: function (edge, name, value) {
/*
															const i = parseInt(name);
															if (!isNaN(i)) {

																if (name >= edge.length)
																	console.error('EgocentricUniverse: Edge set. Invalid index = ' + name);

															}
*/
															console.error('EgocentricUniverse: Edge set. Hidden method: edges[' + name + '] = ' + value);
															edge[name] = value;
															return true;

														},

													});

												}
											}
											_edges.push(new Edge(edge));
											
										};

									}
//									console.error('EgocentricUniverse: indices.edges get: invalid name: ' + name);
									return _edges[name];

								},
								set: function (_edges, name, value) {

									const i = parseInt(name);
									if (!isNaN(i)) {
					
										console.error('EgocentricUniverse: indices.edges set. Hidden method: edges[' + i + '] = ' + value);
										_edges[i] = value;
					
									}
/*
									switch (name) {

										case 'edges':
											break;
										default: console.error('EgocentricUniverse: indices.edges set: invalid name: ' + name);

									}
*/
									return true;

								}

							});
//const edges = indices[0];
							indices.edges.push({

								vertices: [verticeIndex, verticeIndex - 1],
//								disatance: 1.0,
								
							});
					
						}

					};

					//connect the first vertice to the last
					case 'loop': return () => {

						console.log('connect the first vertice to the last');

					};

				}
//				console.error('EgocentricUniverse: Vertice get: invalid name: ' + name);
				return _vertices[name];

			},
			set: function (_vertices, name, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					console.error('EgocentricUniverse: vertices set. Hidden method: vertices[' + i + '] = ' + value);
					_vertices[i] = value;
/*					
					if (i >= _vertices.length)
						console.error('EgocentricUniverse: vertices get. Invalid index = ' + i + ' vertices.length = ' + _vertices.length);
					return _vertices[i];
*/	 

				}
/*
				switch (name) {

					case 'edges':
						if (_indices[0] === undefined)
							_indices[0] = value;
						break;
					default: console.error('EgocentricUniverse: indices set: invalid name: ' + name);

				}
*/
				return true;

			}

		});

		vertices.push();
		vertices.push();
		vertices.push();
//let vertice = vertices[0];
//vertices[0] = 5;
		vertices.loop();
		
		console.log('\nvertices:');
		vertices.forEach((vertice, i) => console.log(vertice));

//indices.edges[0] = 67;
//indices.edges[0].vertices = 35
		console.log('\nindices.edges:');
		indices.edges.forEach((edge, i) => console.log(edge));
		
	}

}

export default EgocentricUniverse;

