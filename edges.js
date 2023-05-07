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

	//Overridden methods from base class

	//Project universe into 3D space
	project(
		scene,
		n = 2//universe dimension
	) {

		//remove previous universe
		this.remove( scene );

/*
		if (!this.settings.edgesId) {

			this.settings.edgesId = [];
			this.settings.edges.forEach( ( edge, i ) => this.settings.edgesId.push( i ) );

		}
*/
		const THREE = three.THREE, indices = this.settings.object.geometry.indices;
			
		//universe length
		let l = 0;
		indices.faceEdges.forEach( edge => l += edge.distance );
//		indices.edges.forEach( edge => l += edge.distance );
//		this.settings.object.geometry.indices.faces[this.settings.faceId].forEach( edgeId => l += this.settings.object.geometry.indices.edges[edgeId].distance );

		const r = l / ( 2 * Math.PI ),
			center = new THREE.Vector2( 0.0, 0.0 ),
			axis = new THREE.Vector3( 0, 0, 1 ),
			points = [
				new THREE.Vector3( 0, -r, 0 ),//point0,//0
			],
			delta = 2 * Math.PI / l;
		let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
//		for ( let i = 1; i < indices.edges.length; i++ )
		for ( let i = 1; i < indices.faceEdges.length; i++ ) {

//			angle += indices.edges[i].distance * delta;
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
/*		
		const settings = {

			object: {

				name: this.settings.object.name,
				geometry: {

					position: this.settings.object.geometry.position,
					boRememberPosition: false,//Не запоминать позицию вершины в settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись позицию вершин в 3D
					indices: [[]],
					
				}

			},
			
		}
		settings.object.geometry.indices[0] = this.settings.object.geometry.indices.edges;
		settings.object.geometry.indices[1] = this.settings.object.geometry.indices.faces;
		settings.scene = scene;
*/		
		this.settings.scene = scene;
//const edge1 = this.settings.object.geometry.indices.edges[1];
		
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
		
		const settings = this.settings,
//			vertices = settings.vertices;
			position = settings.object.geometry.position;
		const debug = this.debug;

		if (!isEdgesIndicesProxy) {
			
			settings.object.geometry.indices = new Proxy( settings.object.geometry.indices, {

				get: function (_indices, name) {
	
					switch (name) {
	
						case 'edges': 
//							_indices[0] = _indices[0] || _indices.edges || [];
							_indices[0] = _indices[0] || [];
							delete _indices.edges;
							return _indices[0];

						case 'faceEdges': return new Proxy(_indices[0], {
			
							get: function (_edges, name) {
			
								const i = parseInt(name);
								if (!isNaN(i)) {
			
									const edgeId = indices.faces[settings.faceId][i];
									let edge = _edges[edgeId];
									return edge;
			
								}
								switch (name) {
			
									case 'length': return indices.faces[settings.faceId].length;
			
								}
								return _edges[name];
			
							},
							set: function (_edges, name, value) {
			
								const i = parseInt(name);
								if (!isNaN(i)) _edges[indices.faces[settings.faceId][i]] = value;
			
								return true;
			
							}
			
						});

							
						case 'faces':
							_indices[1] = _indices[1] || [];
							if (_indices[1].length === 0) _indices[1].push( [0, 1, 2] );
							return _indices[1];
						case 'count': return _indices.count( sEdges + ': Minimal edges count is ' );
/*							
							const edgesCount = 3;
							if (_indices.count === undefined) _indices.count = edgesCount;
							if (_indices.count < edgesCount) {
					
								console.error( sEdges + ': Minimal edges count is ' + edgesCount );
								_indices.count = edgesCount;
								
							}
							return _indices.count;
*/	   
						
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
		
		let edgesCount = settings.object.geometry.indices.count;//default is triangle
/*		
		let edgesCount = settings.object.geometry.indices.count != undefined  ? settings.object.geometry.indices.count : 3;//default is triangle
		if (edgesCount < 3) {

			console.error( sEdges + ': Minimal edges count is 3' );
			edgesCount = 3;
			
		}
*/
//		for ( let i = settings.edges.length; i < edgesCount; i++ ) settings.edges.push( {} );
		
		settings.object.geometry.indices[1] = settings.object.geometry.indices[1] || settings.object.geometry.indices.faces || [];
		delete settings.object.geometry.indices.faces;

//		if (settings.object.geometry.indices.edges) return;
		
		const indices = settings.object.geometry.indices;//, edges = indices.edges;

		const face = indices.faces[settings.faceId];
		for ( let i = face.length; i < edgesCount; i++ ) face.push( i + 1 );
		
		//у треугольника ребер не должно быть меньше 3
		for ( let i = indices.edges.length; i < edgesCount; i++ ) indices.edges.push({});
//		for ( let i = settings.edges.length; i < settings.count; i++ ) settings.edges.push({});
		
//		const faces = indices[1];
//		const faces = indices.faces;
//		if (faces.length === 0) faces.push( [0, 1, 2] );
		
		const sIndicesEdgesSet = ': indices.edges set. ';
/*		
		settings.count = settings.count || 3;
		settings.edges = settings.edges || settings.count;

		if (!(settings.edges instanceof Array)) {

			if (typeof settings.edges === "number") {

				const edges = [];
				for (let i = 0; i < settings.edges; i++) edges.push({});
				settings.edges = edges;

			} else {

				console.error(sEdges + sIndicesEdgesSet + 'Invalid edges array: ' + value);
				return true;

			}

		}
*/
		function Edge( edgeSettings = {} ) {

			const sEdge = sEdges + ': ' + (edgeSettings.edgeId === undefined ? 'Edge' : 'edges[' + edgeSettings.edgeId + ']'),
				sVertices = sEdge + '.vertices';
/*			
			edgeSettings.edges = edgeSettings.edges || edgeSettings.this.settings.object.geometry.indices.edges;
			edgeSettings.edge = edgeSettings.edge || edgeSettings.edges[edgeSettings.edgeId] || {};
*/   
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
//					(edgeSettings.edgeId != (edgeSettings.edges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
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
//							(i === 1) && (edgeSettings.edgeId === edgeSettings.edges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
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
//			edgeSettings.edges = edgeSettings.edges || indices.edges;
			edgeSettings.faceEdges = edgeSettings.faceEdges || indices.edges;
			if (debug)

//				for (let edgeCurId = (edgeSettings.edgeId === undefined) ? 0 : edgeSettings.edgeId; edgeCurId < edgeSettings.edges.length; edgeCurId++)
				for (let edgeCurId = (edgeSettings.edgeId === undefined) ? 0 : edgeSettings.edgeId; edgeCurId < edgeSettings.faceEdges.length; edgeCurId++) {

					if ((edgeSettings.edgeId != undefined) && (edgeSettings.edgeId === edgeCurId)) continue;//Не сравнивать одно и тоже ребро

					const //edgeCur = edgeSettings.edges[edgeCurId],
						edgeCur = edgeSettings.faceEdges[edgeCurId],
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

//				const newEdgeId = edgeSettings.edges.length;
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
//						case 'vertices': break;
						case 'distance': {

							//distance between edge vertices
//							if (edge.distance === undefined) edge.distance = 2 * Math.PI / edgeSettings.edges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
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

		if (!indices.edges.isEdgesProxy) {

			indices.edges =
				new Proxy(indices.edges, {

				get: function (_edges, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

//						const edge = _edges[settings.object.geometry.indices.faces[settings.faceId][i]];
						
//						const edgeId = indices.faces[settings.faceId][i];//uncompatible with ND
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

							indices.faces[settings.faceId].push( _edges.push(Edge({ edge: edge, edges: settings.object.geometry.indices.edges } ) ) - 1 );
//							settings.object.geometry.indices.faces[settings.faceId].push( _edges.push(Edge({ edge: edge, edges: settings.object.geometry.indices.edges } ) ) - 1 );

						};
//						case 'length': return indices.faces[settings.faceId].length;

					}
					return _edges[name];

				},

			});
/*			
			indices.faceEdges =
				new Proxy(indices.edges, {

				get: function (_edges, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						const edgeId = indices.faces[settings.faceId][i];
						let edge = _edges[edgeId];
						return edge;

					}
					switch (name) {

						case 'length': return indices.faces[settings.faceId].length;

					}
					return _edges[name];

				},
				set: function (_edges, name, value) {

					const i = parseInt(name);
					if (!isNaN(i)) _edges[indices.faces[settings.faceId][i]] = value;

					return true;

				}

			});
*/			

//			indices.edges.forEach( ( edge, i ) => indices.edges[i] = Edge( { this: this, edgeId: i } ) );
			indices.faceEdges.forEach( ( edge, i ) => indices.faceEdges[i] = Edge( { this: this, edgeId: i } ) );

		}
//		delete settings.edges;

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
	 * @param {object} [settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 * @param {number} [settings.count=3] 1D Universe edges count. Default universe is triangle with 3 edges.
	 * @param {Array} [settings.edges] Edges array. Default edges count is <b>settings.count</b>.
	 * @param {object} [settings.edges.edge] Edges array item is edge.
	 * @param {Array} [settings.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [settings.edges.edge.distance] Edge length. Distance between edge vertices.
	 * @param {number} [settings.faceId=0] Identifier of the array of the edges ids in the <b>settings.object.geometry.indices.faces array</b>.
	 **/
	constructor( options, settings={} ) {

		if (settings.faceId === undefined) settings.faceId = 0;
		
//		super( scene, options, settings );
		super( options, settings );

		this.pushEdge = ( edge ) => {
			
			settings.object.geometry.indices.edges.push( edge );
//			this.project();
			
		}

	}

}

export default Edges;
