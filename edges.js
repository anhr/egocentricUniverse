/**
 * @module Edges
 * @description 1D universe or universe edges.
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

import EgocentricUniverse from './egocentricUniverse.js';
import three from '../../commonNodeJS/master/three.js'

const sEdges = 'Edges';
let isEdgesIndicesProxy = false;

class Edges extends EgocentricUniverse {

	_edgesSettings;
	
	//Overridden methods from base class

	log() {

		if (!this.debug) return;
		this.settings.object.geometry.position.forEach((vertice, i) => console.log('position[' + i + ']. ' + JSON.stringify( vertice )));
		this.settings.object.geometry.indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + ']. ' + JSON.stringify( edge )));
		this.settings.object.geometry.indices.faces.forEach((face, i) => console.log('indices.faces[' + i + ']. ' + JSON.stringify( face )));
		
	}

	//Project universe into 3D space
	project(
		scene,
		n = 2,//universe dimension
		bLog = true//log positions and indices to cnosole 
	) {

		//remove previous universe
		this.remove( scene );

		const THREE = three.THREE, indices = this.settings.object.geometry.indices;
			
		//universe length
		let l = 0;
		indices.faceEdges.forEach( edge => l += edge.distance );
		if (isNaN( l )){

			console.error( sEdges + ': project(...). Invalid universe length = ' + l );
			return;
			
		}

		const r = l / ( 2 * Math.PI ),
			center = new THREE.Vector2( 0.0, 0.0 ),
			axis = new THREE.Vector3( 0, 0, 1 ),
			points = [
				new THREE.Vector3( 0, -r, 0 ),//point0,//0
			],
			delta = 2 * Math.PI / l;
		let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
		for ( let i = 1; i < indices.faceEdges.length; i++ ) {

			angle += indices.faceEdges[i].distance * delta;
			points.push( new THREE.Vector3().copy( points[0] ).applyAxisAngle( axis, angle ) );

		}

		points.forEach( ( point, i ) => {
			
			//this.settings.object.geometry.position[i].positionWorld = undefined;//если не удалять positionWorld то вместо новых координат вершин будут браться старые
			//Это не позволяет добавлять новые вершины в объект
			//Никак не могу придумать как удалять positionWorld внутри ND когда у вершины устанвливаются новые координаты
			//Сейчас вместо этого использую settings.object.geometry.boRememberPosition: false,//Не запоминать позицию вершины в settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись позицию вершин в 3D
			this.settings.object.geometry.position[i] = point.toArray();
			
		} );
		this.settings.scene = scene;
		
		if (bLog) this.log();
		
		this.display( n, this.settings, this.debug ?
			new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				r, r,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }))
			: undefined
		);

	}
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 3 ребра
	Test( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 2)
			console.error(sEdges + ': Test(). Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices() {
		
		const _this = this, settings = this.settings,
			position = settings.object.geometry.position;
		const debug = this.debug;

		if (settings.object.geometry.indices.count != undefined) {

			settings.object.geometry.indices[0].count = settings.object.geometry.indices.count;
			delete settings.object.geometry.indices.count;
			
		}

		if (!isEdgesIndicesProxy) {
			
			settings.object.geometry.indices = new Proxy( settings.object.geometry.indices, {

				get: function ( _indices, name ) {
	
					switch (name) {
	
						case 'edges': 
							if (!_indices[0].isEdgesProxy) {
								
								_indices[0] = new Proxy(_indices[0] || [], {
			
									get: function (_edges, name) {
					
										const i = parseInt(name);
										if (!isNaN(i)) {
					
											const edgeId = i;
											let edge = _edges[edgeId];
											if (!edge) {
					
												if (edgeId != _edges.length) console.error( sEdges + ': get indices.edges: invalid edgeId = ' + edgeId );//добавлять только то ребро, индекс которого в конце массива _edges
												else {
													
													edge = {};
													_edges.push( edge );
					
												}
					
											}
											return edge;
					
										}
										switch (name) {
					
											case 'isEdgesProxy': return true;
											case 'push': return (edge={}) => {
					
												indices.faces[_this.classSettings.faceId].push( _edges.push(Edge({ edge: edge, edges: settings.object.geometry.indices.edges } ) ) - 1 );
					
											};
					
										}
										return _edges[name];
					
									},
					
								});
								indices.faceEdges.forEach( ( edge, i ) => indices.faceEdges[i] = Edge( { this: _this, edgeId: i } ) );

							}
							return _indices[0];
						case 'faceEdges': return new Proxy(_indices[0], {
			
								get: function (_edges, name) {
				
									const i = parseInt(name);
									if (!isNaN(i)) {

										return _edges[indices.faces[_this.classSettings.faceId][i]];
/*										
										const edge = _edges[indices.faces[_this.classSettings.faceId][i]];
										if ( edge.indices ) return edge.indices;//После вызова ND массив edge преобразуется в обект, коромо массив оказывается в edge.indices
										return edge;
*/		  
/*										
										const edgeId = indices.faces[_this.classSettings.faceId][i];
										let edge = _edges[edgeId];
										return edge;
*/		  
				
									}
									switch (name) {
				
										case 'isFaceEdgesProxy': return true;
										case 'length': return indices.faces[_this.classSettings.faceId].length;
				
									}
									return _edges[name];
				
								},
								set: function (_edges, name, value) {
				
									const i = parseInt(name);
									if (!isNaN(i)) _edges[indices.faces[_this.classSettings.faceId][i]] = value;
				
									return true;
				
								}
				
							});
						case 'faces':
							if (!_indices[1].isFacesProxy) {
								
								_indices[1] = new Proxy(_indices[1] || [], {
			
									get: function (_faces, name) {

										const i = parseInt(name);
										if (!isNaN(i)) {
					
											_faces[i] = _faces[i] || [];
											if (!_faces[i].isFaceProxy){

												_faces[i] = new Proxy( _faces[i], {

													get: (_face, name) => {

														switch (name) {
									
															case 'isFaceProxy': return true;
															case 'push': return ( edgeId ) => {

																if (debug) for ( let i = 0; i < _face.length; i++ ) {

																	if (_face[i] === edgeId ) {
																		
																		console.error( sEdges + ': Duplicate face edgeId = ' + edgeId );
																		return;

																	}
																	
																}
																_face.push( edgeId );
																const edges = _indices[0];
																if(edges[edgeId] === undefined) edges[edgeId] = {};
																	
															}
									
														}
														return _face[name];
														
													},
													
												} );
												
											}
											return _faces[i];
					
										}
										switch (name) {
					
											case 'isFacesProxy': return true;
					
										}
										return _faces[name];
					
									},
					
								});
								const edges = _indices[0];
								_indices[1].forEach( face => face.forEach( edgeId => edges[edgeId] = edges[edgeId] || {} ) );
								for ( let i = 0; i < edges.length; i++ ) edges[i] = edges[i] || {};

							}
							return _indices[1];
						
					}
					return _indices[name];
	
				},
				set: function (_indices, name, value) {
	
					switch (name) {
	
						case 'edges': _indices[0] = value; return true;
						
					}
					_indices[name] = value;
					return true;
	
				},
	
			});
			isEdgesIndicesProxy = true;

		}
		
		const edgesCount = settings.object.geometry.indices[0].count || 3,//default is triangle
			indices = settings.object.geometry.indices,
			face = indices.faces[this.classSettings.faceId],

			//Тут какая то странная логическая ошибка.
			//Если надо добавлять в пустой массив face, то индекс ребра равен i
			//Если массив face не пустой то индекс ребра на 1 больше
			//Для проверки settings.object.geometry.indices.count = 10
			//settings.object.geometry.indices.faces сделать пустым а потом добавить несколько индексов ребер
			a = face.length === 0 ? 0 : 1;
		
		for ( let i = face.length; i < edgesCount; i++ ) face.push( i + a );
		
		indices.edges;//Convert edges items to Proxy
		
		//у треугольника ребер не должно быть меньше 3
//		for ( let i = indices.edges.length; i < edgesCount; i++ ) indices.edges.push();
		
		//const sIndicesEdgesSet = ': indices.edges set. ';
		function Edge( edgeSettings = {} ) {

			const sEdge = sEdges + ': ' + (edgeSettings.edgeId === undefined ? 'Edge' : 'edges[' + edgeSettings.edgeId + ']'),
				sVertices = sEdge + '.vertices';
			edgeSettings.faceEdges = edgeSettings.edges || edgeSettings.this.settings.object.geometry.indices.faceEdges;
			edgeSettings.edge = edgeSettings.edge || edgeSettings.faceEdges[edgeSettings.edgeId] || {};
			
			if (edgeSettings.edge.isProxy) return edgeSettings.edge;

			//edge vertices

			edgeSettings.edge.vertices = edgeSettings.edge.vertices || [];
			if (debug) {

				if (edgeSettings.edge instanceof Array) {

					console.error(sEdge + '. Invalid edge instance');
					return false;

				}
				if (!(edgeSettings.edge.vertices instanceof Array)) {

					console.error(sEdge + '. Invalid edge.vertices instance');
					return false;

				}

			}
			function IdDebug(i) {

				if (!debug) return true;

				if ((i < 0) || (i > 1)) {

					console.error(sVertices + '. Vertices index = ' + i + ' is limit from 0 to 1');
					return false;

				}
				return true;

			}
			function VerticeIdDebug(i, verticeId) {

				if ((verticeId === position.length) && (//этой вершины нет списке вершин
					(edgeSettings.edgeId === undefined) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
					(edgeSettings.edgeId != (edgeSettings.faceEdges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
				)
				)
					position.push();//{edgeId: edgeIndex});

				if (!debug) return true;

				if (!IdDebug(i)) return false;

				if (isNaN(parseInt(verticeId))) {

					console.error(sVertices + '[' + i + ']. Invalid vertice index = ' + verticeId);
					return false;

				}
				if ((verticeId < 0) || (verticeId >= position.length)) {

					console.error(sVertices + '[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (position.length - 1));
					return false;

				}
				for (let index = 0; index < 2; index++) {

					if (index === i) continue;//не надо сравнивать самого себя

					if (verticeId === edgeSettings.edge.vertices[index]) {

						console.error(sVertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
						return false;

					}

				};
				return true;

			}
			for (let i = 0; i < 2; i++) {//у каждого ребра 2 вершины

				if (edgeSettings.edge.vertices[i] === undefined) {

					edgeSettings.edge.vertices[i] = (
						position.length === 0) ||//первая вершина первого ребра
						((edgeSettings.edgeId != undefined) &&//ребро из массива ребер
							(i === 1) && (edgeSettings.edgeId === edgeSettings.faceEdges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
						0 :
						edgeSettings.edgeId != undefined ?
							position.length + (i === 0 ? -1 : 0) : //ребро из массива ребер
							//Новое ребро добавляется при помощи edges.push()
							i === 0 ? position.length : //первая вершина
								0//Соеденить последнюю вершину нового ребра с первой першиной первого ребра
						;

				}
				VerticeIdDebug(i, edgeSettings.edge.vertices[i]);

			}
			edgeSettings.faceEdges = edgeSettings.faceEdges || indices.edges;
			if (debug)

				for (let edgeCurId = (edgeSettings.edgeId === undefined) ? 0 : edgeSettings.edgeId; edgeCurId < edgeSettings.faceEdges.length; edgeCurId++) {

					if ((edgeSettings.edgeId != undefined) && (edgeSettings.edgeId === edgeCurId)) continue;//Не сравнивать одно и тоже ребро

					const edgeCur = edgeSettings.faceEdges[edgeCurId],
						verticesCur = edgeCur.vertices;
					if (!verticesCur) continue;//в данном ребре еще нет вершин
					const vertices = edgeSettings.edge.vertices;
					if (
						(vertices[0] === verticesCur[0]) && (vertices[1] === verticesCur[1]) ||
						(vertices[1] === verticesCur[0]) && (vertices[0] === verticesCur[1])
					)
						console.error(sEdges + ': Duplicate edge. Vertices = ' + vertices);

				}
			edgeSettings.edge.vertices = new Proxy(edgeSettings.edge.vertices, {

				get: function (_vertices, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						IdDebug(i);

						return _vertices[i];

					}
					switch (name) {

						case 'length':

							if (!debug) break;
							if (_vertices.length > 2) console.error(sVertices + ' set. Invalid length = ' + _vertices.length);
							break;

					}
					return _vertices[name];

				},
				set: function (_vertices, name, value) {

					const i = parseInt(name);
					if (!isNaN(i) && !VerticeIdDebug(i, value))
						return true;
					_vertices[name] = value;
					return true;

				},

			});


			if (edgeSettings.edgeId === undefined) {

				//если вставляем новое ребро с помощью edges.push()
				//надо последнюю вершину последнего ребра заменить на новую вершину
				settings.object.geometry.indices.edges[settings.object.geometry.indices.edges.length - 1][1] = position.length - 1;

			}

			//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
			//что бы потом проверить в vertices.test();
			if (debug) {

				const newEdgeId = edgeSettings.faceEdges.length;
				edgeSettings.edge.vertices.forEach(verticeId => {

					const edges = position[verticeId].edges;
					if (edgeSettings.edgeId === undefined) {

						//новое ребро добавляется с помощю push
						if (verticeId === 0)
							//в первой вершине заменяем последнее ребро на новое ребро
							edges[1] = newEdgeId
						//В последнюю вершину добавляем новое ребро
						else edges.push(newEdgeId,
							verticeId//for debug
						);

					} else edges.push(edgeSettings.edgeId,
						verticeId//for debug
					);

				});

			}

			//заменяем объект edgeSettings.edge на массив edgeSettings.edge.vertices для совместимости с ND
			//Сразу делать edgeSettings.edge как массив вершин не стал, потомучто будет неудобно делать edgeSettings.edges аргумент в конструкторе Edges
			Object.keys( edgeSettings.edge ).forEach( key => {

				if ( key !== 'vertices' ) {
					
					edgeSettings.edge.vertices[key] = edgeSettings.edge[key];
					delete edgeSettings.edge[key];

				}

			} );
			return new Proxy(edgeSettings.edge.vertices, {

				get: function (edge, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						if (name >= edge.length)
							console.error(sEdge + ' get. Invalid index = ' + name);
						return edge[name];

					}
					switch (name) {

						case 'isProxy': return true;
						case 'distance': {

							//distance between edge vertices
							if (edge.distance === undefined) edge.distance = 2 * Math.PI / edgeSettings.faceEdges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
							return edge.distance;

						}


					}
					return edge[name];

				},
				set: function (edge, name, value) {

					//не понятно зачем вывел эту ошибку
					//console.error(sEdge + ' set. Hidden method: edges[' + name + '] = ' + JSON.stringify(value) );

					edge[name] = value;
					return true;

				},

			});

		}


		if ( debug ) {
		
			//test for duplicate vertice.edges edgeId
			//indices.edges[0].vertices[0] = 1;//error: EgocentricUniverse: Edge.vertices[0]. Duplicate vertice index = 1
			//vertices[1].edges[0] = 1;//на данный момент в vertice.edges можно иметь несколько ссылок на одно ребро потому что это не влияет на результат
			
			//indices.edges.push({});//Error: EgocentricUniverse: Duplicate edge. Vertices = 0,1
			//indices.edges.push({ vertices: [1,0] });//Error: EgocentricUniverse: Duplicate edge. Vertices = 1,0
			//indices.edges.push({ vertices: [1,2] });
			//indices.edges = [];//Error: EgocentricUniverse: indices.edges set. duplicate edges
			//indices.edges[0] = {};//Error: EgocentricUniverse: indices.edges set. Hidden method: edges[0] = {}
			/*
			indices.edges.forEach( ( edge, edgeIndex ) => {

				//indices.edges[0] = edge;//Error: Edges: indices.edges set. Hidden method: edges[0] = {"vertices":[0,1]}
				//indices.edges.push(edge);//Error: Edges: Edge. Duplicate proxy
				//const edgeVertices = edge.vertices;
				//edge.vertices = edgeVertices;
//					const edgeVerticeId = edgeVertices[0];
				//edgeVertices.forEach( ( vertice, i ) => console.log( 'indices.edges[' + edgeIndex + '].vertices[' + i + '] = ' + vertice ) );
				//edgeVertices[1] = 0;//Error: Edges: edges[0].vertices[1]. Duplicate vertice index = 0
			
			} );
		   */

		}
		
	}
	/**
	 * 1D universe or universe edges.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Edges class settings.
	 * @param {number} [classSettings.faceId=0] Identifier of the array of the edges ids in the <b>classSettings.settings.object.geometry.indices.faces</b> array.
	 * @param {object} [classSettings.settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 * @param {object} [classSettings.settings.object] edges object.
	 * @param {String} [classSettings.settings.object.name='Universe'] name of universe.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Universe geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges and faces of universe.
	 * @param {number} [classSettings.settings.object.geometry.indices.count=3] 1D Universe edges count. Default universe is triangle with 3 edges.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges=[{}, {}, {}]] Edges array. Default edges count is <b>classSettings.settings.object.geometry.indices.count</b>.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=1.0] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces=[[0, 1, 2]]] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * <pre>
	 * Example:
	 * [[0, 2, 3]]
	 * universe contains three edges with 0, 2 and 3 indice.
	 * </pre>
	 **/
	constructor( options, classSettings={} ) {

		const settings = classSettings.settings || {};
		if (classSettings.faceId === undefined) classSettings.faceId = 0;
		
		super( options, classSettings );

		this.pushEdge = ( edge ) => {
			
			settings.object.geometry.indices.edges.push( edge );
			
		}

	}

}

export default Edges;
