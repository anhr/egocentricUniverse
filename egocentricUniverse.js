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

const debug = true;

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

					case 'edges':
						return _indices[0];
						
				}
				console.error('EgocentricUniverse: indices get: invalid name: ' + name);
				return;// _indices[name];

			},
			set: function (_indices, name, value) {

				switch (name){

					case 'edges':

						if ( debug ) {
							
							if ( _indices[0]) {
	
								console.error('EgocentricUniverse: indices.edges set. duplicate edges');
								return true;
	
							}
	
							if ( !( value instanceof Array ) ){
	
								console.error('EgocentricUniverse: indices.edges set. Invalid edges array: ' + value);
								return true;
	
							}

						}

						function Edge(edge) {

							edge = edge || {};
							//									if ( !edge ) edge = {};
							if (edge.isProxy) {

								console.error('EgocentricUniverse: Edge get. Duplicate proxy');
								return edge;

							}

							//edge vertices
							
							edge.vertices = edge.vertices || [];
							function IdDebug(i) {

								if (!debug) return true;

								if ((i < 0) || (i > 1)) {

									console.error('EgocentricUniverse: Edge.vertices. Vertices index = ' + i + ' is limit from 0 to 1');
									return false;

								}
								return true;

							}
							function VerticeIdDebug(i, verticeId) {

								if (!debug) return true;

								if ( !IdDebug(i) ) return false;

								if (isNaN(parseInt(verticeId))) {

									console.error('EgocentricUniverse: Edge.vertices[' + i + ']. Invalid vertice index = ' + verticeId);
									return false;

								}
								if ((verticeId < 0) || (verticeId >= vertices.length)) {

									console.error('EgocentricUniverse: Edge.vertices[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (vertices.length - 1));
									return false;

								}
								for (let index = 0; index < 2; index++) {

									if (index === i) continue;//не надо сравнивать самого себя

									if (verticeId === edge.vertices[index]) {

										console.error('EgocentricUniverse: Edge.vertices[' + i + ']. Duplicate vertice index = ' + verticeId);
										return false;

									}

								};
								return true;

							}
							for (let i = 0; i < 2; i++) {

								if (edge.vertices[i] === undefined) edge.vertices[i] = i;//default id of vertex.
								VerticeIdDebug(i, edge.vertices[i]);

							}
							edge.vertices = new Proxy(edge.vertices, {

								get: function (_vertices, name) {

									const i = parseInt(name);
									if (!isNaN(i)) {

										IdDebug(i);
										
										return _vertices[i];
/*										
										let vertice = _vertices[i];
										//VerticeIdDebug( i, vertice );//не делаю проверку здесь потому что проверка уже была при установке значений, а проверка прикаждом обращении будет занимать много времен
										return vertice;
*/		  

									}
									switch (name) {

										case 'length':

											if (!debug) break;
											if (_vertices.length > 2) console.error('EgocentricUniverse: Edge.vertices set. Invalid length = ' + _vertices.length);
										//																	_vertices.length = 2;//each edge have two vertices

									}
									return _vertices[name];

								},
								set: function (_vertices, name, value) {

									const i = parseInt(name);
									if ( !isNaN(i) && !VerticeIdDebug(i, value) )
										return true;
									_vertices[name] = value;
									return true;

								},

							});
							return new Proxy(edge, {

								get: function (edge, name) {

									const i = parseInt(name);
									if (!isNaN(i)) {

										if (name >= edge.length)
											console.error('EgocentricUniverse: Edge get. Invalid index = ' + name);
										return edge[name];

									}
									switch (name) {

										case 'isProxy': return true;
										case 'vertices': return edge.vertices;


									}
									return edge[name];

								},
								set: function (edge, name, value) {

									//не понятно зачем вывел эту ошибку
									//console.error('EgocentricUniverse: Edge set. Hidden method: edges[' + name + '] = ' + JSON.stringify(value) );

									edge[name] = value;
									return true;

								},

							});

						}

						//сразу заменяем все ребра на прокси, потому что в противном случае, когда мы создаем прокси ребра в get, каждый раз,
						//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
						//EgocentricUniverse: Edge get. Duplicate proxy
						for ( let i = 0; i < value.length; i ++ )
							value[i] = Edge(value[i]);
						
						_indices[0] = new Proxy(value, {

							get: function (_edges, name) {

								const i = parseInt(name);
								if (!isNaN(i))
									return _edges[i];
									//return Edge(_edges[i]);//не надо в get создавать прокси, потомучто он будет создаваться каждый раз, когда вызывается get, в результате может получться бесконечная вложенная конструкция

								switch (name) {

									case 'push': return (edge) => {

										//console.log('EgocentricUniverse: indices.edges.push(' + JSON.stringify(edge) + ')');
										_edges.push(Edge(edge));

									};

								}
								//									console.error('EgocentricUniverse: indices.edges get: invalid name: ' + name);
								return _edges[name];

							},
							set: function (_edges, name, value) {

								const i = parseInt(name);
								if (!isNaN(i)) {

									console.error('EgocentricUniverse: indices.edges set. Hidden method: edges[' + i + '] = ' + JSON.stringify(value));
									_edges[i] = value;

								}
								return true;

							}

						});
						//value.forEach( edge => indices.edges.push( edge ) )
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

				
						_vertices.push({});

/*
						const verticeIndex = _vertices.push(new Vertice()) - 1;

						//add edge
						if (verticeIndex > 0) {

							//array of edges.
							indices.edges = new Proxy([], {

								get: function (_edges, name) {

									switch (name) {

										case 'push': return (edge) => {

											console.log('EgocentricUniverse: indices.edges.push(' + JSON.stringify(edge) + ')');
											_edges.push(new Proxy(edge, {

												get: function (edge, name) {

													const i = parseInt(name);
													if (!isNaN(i)) {

														if (name >= edge.length)
															console.error('EgocentricUniverse: Edge get. Invalid index = ' + name);
														return edge[name];

													}
													return edge[name];

												},
												set: function (edge, name, value) {

													console.error('EgocentricUniverse: Edge set. Hidden method: edges[' + name + '] = ' + value);
													edge[name] = value;
													return true;

												},

											}));
											
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
									return true;

								}

							});
//const edges = indices[0];
							indices.edges.push({

								vertices: [verticeIndex, verticeIndex - 1],
//								disatance: 1.0,
								
							});
					
						}
*/

					};
/*
					//connect the first vertice to the last
					case 'loop': return () => {

						console.log('connect the first vertice to the last');

					};
*/	 

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

		//n = 1. Одномерная вселенная. Минимаьное количество вершин равно 3, фигура - треугольник, вписанный в окружность
		//n = 2. Двумерная  вселенная. Минимаьное количество вершин равно 4, фигура - тетраэдр tetrahedron или пирамида, вписанная в сферу. https://en.wikipedia.org/wiki/Tetrahedron
		//n = 3. Трехмерная вселенная. Минимаьное количество вершин равно 5, фигура - пятияче́йник 5-cell, или пентахор pentachoron, pentatope, pentahedroid, or tetrahedral pyramid https://en.wikipedia.org/wiki/5-cell, вписанный в трёхмерную сферу или 3-sphere https://en.wikipedia.org/wiki/3-sphere
		for ( let i = 0; i < n + 3; i++ )
			vertices.push();
		switch( n ){

			case 1://1D universe.
				indices.edges = [
					
					{//0
					
						//vertices: [0,2]
						
					},
					//{},//1
								
				];
				indices.edges.push();

				//debug
				
				//indices.edges = [];//test for duplicate edges array
				indices.edges.forEach( ( edge, edgeIndex ) => {

					//indices.edges[0] = edge;
					const edgeVertices = edge.vertices;
					//edge.vertices = edgeVertices;
					const edgeVerticeId = edgeVertices[0];
					edgeVertices.forEach( ( vertice, i ) => console.log( 'indices.edges[' + edgeIndex + '].vertices[' + i + '] = ' + vertice ) );
					edgeVertices[1] = 2;
					
				} );
				
				break;
			default: console.error('Invalid universe dimension n = ' + n);
				return;
				
		}
//let vertice = vertices[0];
//vertices[0] = 5;
//		vertices.loop();
		
		console.log('\nvertices:');
		vertices.forEach((vertice, i) => console.log(vertice));

//indices.edges[0] = 67;
//indices.edges[0].vertices = 35
		console.log('\nindices.edges:');
		indices.edges.forEach((edge, i) => console.log(JSON.stringify( edge )));
		
	}

}

export default EgocentricUniverse;

