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

class Edges extends EgocentricUniverse {

	//Overridden methods from base class

	//Project universe into 3D space
	project() {

//		const indices = this.settings.indices, scene = this.scene;//, options = this.options;

		//remove previous universe
		for (var i = this.scene.children.length - 1; i >= 0; i--)
			this.scene.remove(this.scene.children[i]);
		//remove previous vertices position
		this.settings.vertices.forEach( vertice => vertice.length = 0 );

		if (!this.settings.edgesId) {

			this.settings.edgesId = [];
			this.settings.edges.forEach( ( edge, i ) => this.settings.edgesId.push( i ) );

		}
		
		//universe length
		let l = 0;
		this.settings.indices.edges.forEach( edge => { l += edge.distance; } );

		const THREE = three.THREE,
			r = l / ( 2 * Math.PI ),
			center = new THREE.Vector2( 0.0, 0.0 );

		if ( this.debug ) {

			//https://stackoverflow.com/questions/13756112/draw-a-circle-not-shaded-with-three-js

			//https://stackoverflow.com/a/70466408/5175935
			this.scene.add( new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				r, r,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256) ), new THREE.LineBasicMaterial( { color: 'blue' } ) ) );
			
		}
		const //point0 = new THREE.Vector3( 0, -r, 0 ),
			axis = new THREE.Vector3( 0, 0, 1 ),
			points = [
				new THREE.Vector3( 0, -r, 0 ),//point0,//0
			];
		let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
		const delta = 2 * Math.PI / l;
//		this.settings.indices.edges.forEach( edge =>
		for ( let i = 1; i < this.settings.indices.edges.length; i++ ) {

			angle += this.settings.indices.edges[i].distance * delta;
//			angle += edge.distance * delta;
			points.push( new THREE.Vector3().copy( points[0] ).applyAxisAngle( axis, angle ) );

		}

//		this.settings.vertices[0] = [0, -r, 0];
		points.forEach( ( point, i ) => {
			
			//this.settings.vertices[i].positionWorld = undefined;//если не удалять positionWorld то вместо новых координат вершин будут браться старые
																//Это не позволяет добавлять новые вершины в объект
																//Никак не могу придумать как удалять positionWorld внутри ND когда у вершины устанвливаются новые координаты
			this.settings.vertices[i] = point.toArray();
			
		} );
		
		const settings = {

			object: {

				geometry: {

					position: this.settings.vertices,
					boRememberPosition: false,//Не запоминать позицию вершины в settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись позицию вершин в 3D
					indices: [[]],
					
				}

			},
			scene: this.scene,
			options: this.options,
			
		}
		settings.object.geometry.indices[0] = this.settings.indices.edges;
/*		
		this.settings.indices.edges.forEach( edge => {

//			edge.vertices.forEach( ( vertice => index.push( vertice ) ) );
			settings.object.geometry.indices[0].push( [edge.vertices[0], edge.vertices[1]] );
			
		} );
*/  
/*		
		const universe3D = new THREE.LineSegments( new THREE.BufferGeometry().setFromPoints(points).setIndex( index ),
										  new THREE.LineBasicMaterial( { color: 'green', } ) );
		this.scene.addUniverse( universe3D );
		if ( options.guiSelectPoint ) {
			
			if ( universe3D.name === '' ) universe3D.name = this.lang.universe;
			options.guiSelectPoint.addMesh( universe3D );

		}
*/  

//		points.forEach(point => settings.object.geometry.position.push(point.toArray()));

/*		
		//debug
		const position = [];
		points.forEach(point => position.push(point.toArray()));
*/  
		
		new EgocentricUniverse.ND(2, settings);
//		settings.object.geometry.position.reset();//удалить settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись координаты вершин в 3D

	}
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 3 ребра
	Test( vertice, str1, strVerticeId ){
		
		if (vertice.edges.length !== 2)
			console.error(str1 + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices() {

		const settings = this.settings, indices = settings.indices, vertices = settings.vertices;
		const debug = this.debug;

		const sIndicesEdgesSet = ': indices.edges set. ',
			_indices = indices._indices;
		settings.count = settings.count || 3;
		//		let value = settings.edges || settings.count;
		settings.edges = settings.edges || settings.count;
		if (debug) {

/*			
			if ( _indices[0]) {
			
				console.error(sEdges + sIndicesEdgesSet + 'duplicate edges');
				return true;
			
			}
*/

		}

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

		function Edge( settings = {} ) {

			const sEdge = sEdges + ': ' + (settings.edgeId === undefined ? 'Edge' : 'edges[' + settings.edgeId + ']'),
				svertices = sEdge + '.vertices';
			settings.edges = settings.edges || settings.this.settings.indices.edges;
			settings.edge = settings.edge || settings.edges[settings.edgeId] || {};

			//edge vertices

			settings.edge.vertices = settings.edge.vertices || [];
			if (debug) {

				if (settings.edge.isProxy) {

					console.error(sEdge + '. Duplicate proxy');
					return settings.edge;

				}
				if (settings.edge instanceof Array) {

					console.error(sEdge + '. Invalid edge instance');
					return false;

				}
				if (!(settings.edge.vertices instanceof Array)) {

					console.error(sEdge + '. Invalid edge.vertices instance');
					return false;

				}

			}
			function IdDebug(i) {

				if (!debug) return true;

				if ((i < 0) || (i > 1)) {

					console.error(svertices + '. Vertices index = ' + i + ' is limit from 0 to 1');
					return false;

				}
				return true;

			}
			function VerticeIdDebug(i, verticeId) {

				if ((verticeId === vertices.length) && (//этой вершины нет списке вершин
					(settings.edgeId === undefined) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
					(settings.edgeId != (settings.edges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
				)
				)
					vertices.push();//{edgeId: edgeIndex});

				if (!debug) return true;

				if (!IdDebug(i)) return false;

				if (isNaN(parseInt(verticeId))) {

					console.error(svertices + '[' + i + ']. Invalid vertice index = ' + verticeId);
					return false;

				}
				if ((verticeId < 0) || (verticeId >= vertices.length)) {

					console.error(svertices + '[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (vertices.length - 1));
					return false;

				}
				for (let index = 0; index < 2; index++) {

					if (index === i) continue;//не надо сравнивать самого себя

					if (verticeId === settings.edge.vertices[index]) {

						console.error(svertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
						return false;

					}

				};
				return true;

			}
			for (let i = 0; i < 2; i++) {//у каждого ребра 2 вершины

				if (settings.edge.vertices[i] === undefined) {

					settings.edge.vertices[i] = (
						vertices.length === 0) ||//первая вкршина первого ребра
						((settings.edgeId != undefined) &&//ребро из массива ребер
							(i === 1) && (settings.edgeId === settings.edges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
						0 :
						settings.edgeId != undefined ?
							vertices.length + (i === 0 ? -1 : 0) : //ребро из массива ребер
							//Новое ребро добавляется при помощи edges.push()
							i === 0 ? vertices.length : //первая вершина
								0//Соеденить последнюю вершину нового ребра с первой першиной первого ребра
						;

				}
				VerticeIdDebug(i, settings.edge.vertices[i]);

			}
			settings.edges = settings.edges || indices.edges;
			if (debug)

				for (let edgeCurId = (settings.edgeId === undefined) ? 0 : settings.edgeId; edgeCurId < settings.edges.length; edgeCurId++) {

					if ((settings.edgeId != undefined) && (settings.edgeId === edgeCurId)) continue;//Не сравнивать одно и тоже ребро

					const edgeCur = settings.edges[edgeCurId], verticesCur = edgeCur.vertices;
					if (!verticesCur) continue;//в данном ребре еще нет вершин
					const vertices = settings.edge.vertices;
					if (
						(vertices[0] === verticesCur[0]) && (vertices[1] === verticesCur[1]) ||
						(vertices[1] === verticesCur[0]) && (vertices[0] === verticesCur[1])
					)
						console.error(sEdges + ': Duplicate edge. Vertices = ' + vertices);

				}
			settings.edge.vertices = new Proxy(settings.edge.vertices, {

				get: function (_vertices, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						IdDebug(i);

						return _vertices[i];

					}
					switch (name) {

						case 'length':

							if (!debug) break;
							if (_vertices.length > 2) console.error(svertices + ' set. Invalid length = ' + _vertices.length);
							break;
//						case 'vertices': return _vertices;

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


			if (settings.edgeId === undefined) {

				//если вставляем новое ребро с помощью edges.push()
				//надо последнюю вершину последнего ребра заменить на новую вершину
				indices.edges[indices.edges.length - 1][1] = vertices.length - 1;
//				indices.edges[indices.edges.length - 1].vertices[1] = vertices.length - 1;

			}

			//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
			//что бы потом проверить в vertices.test();
			if (debug) {

				const newEdgeId = settings.edges.length;
				settings.edge.vertices.forEach(verticeId => {

					const edges = vertices[verticeId].edges;
					if (settings.edgeId === undefined) {

						//новое ребро добавляется с помощю push
						if (verticeId === 0)
							//в первой вершине заменяем последнее ребро на новое ребро
							edges[1] = newEdgeId
						//В последнюю вершину добавляем новое ребро
						else edges.push(newEdgeId,
							verticeId//for debug
						);

					} else edges.push(settings.edgeId,
						verticeId//for debug
					);

				});

			}

			//заменяем объект settings.edge на массив settings.edge.vertices для совместимости с ND
			//Сразу делать settings.edge как массив вершин не стал, потомучто будет неудобно делать settings.edges аргумент в конструкторе Edges
//			settings.edge.vertices.distance = settings.edge.distance;
			Object.keys( settings.edge ).forEach( key => {

				if ( key !== 'vertices' ) {
					
					settings.edge.vertices[key] = settings.edge[key];
					delete settings.edge[key];

				}

			} );
//			return settings.edge.vertices;
			return new Proxy(settings.edge.vertices, {

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
							if (edge.distance === undefined) edge.distance = 2 * Math.PI / settings.edges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
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
/*
			return new Proxy(settings.edge, {

				get: function (edge, name) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						if (name >= edge.length)
							console.error(sEdge + ' get. Invalid index = ' + name);
						return edge[name];

					}
					switch (name) {

						case 'isProxy': return true;
						case 'vertices': return new Proxy(edge.vertices, {

							set: (edgeVertices, name, value) => {

								if (debug) {

									vertices[value].edges.push(settings.edgeId,
										value//for debug
									);

								}
								edgeVertices[name] = value;

								return true;

							}

						});
						case 'distance': {

							//distance between edge vertices
							if (edge.distance === undefined) edge.distance = 2 * Math.PI / settings.edges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
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
*/			

		}

		//у треугольника ребер не должно быть меньше 3
		for (let i = settings.edges.length; i < settings.count; i++) settings.edges.push({});

		if (_indices[0]) {


			for (let i = 0; i < settings.edges.length; i++) {

				const edge = settings.edges[i] || {};
				if (!edge.isProxy) settings.indices.edges.push( Edge({
					edges: settings.indices.edges,
					edgeId: i
				}) );

			}
			
		} else {

			_indices[0] = new Proxy(settings.edges, {

				get: function (_edges, name) {

					const i = parseInt(name);
					if (!isNaN(i)) return _edges[settings.edgesId[i]];

					switch (name) {

						case 'push': return (edge) => {

							//console.log(sEdges + ': indices.edges.push(' + JSON.stringify(edge) + ')');
							settings.edgesId.push( _edges.push(Edge({ edge: edge, edges: indices.edges } ) ) - 1 );

						};
						case 'length': return settings.edgesId.length;

					}
					return _edges[name];

				},
				set: function (_edges, name, value) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						_edges[settings.edgesId[i]] = value;

					}
					return true;

				}

			});

			indices.edges.forEach( ( edge, i ) => {

				indices.edges[i] = Edge({ this: this, edgeId: i });
				
			} );

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
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 * @param {number} [settings.count=3] 1D Universe edges count. Default universe is triangle with 3 edges.
	 * @param {Array} [settings.edges] Edges array. Default edges count is <b>settings.count</b>.
	 * @param {object} [settings.edges.edge] Edges array item is edge.
	 * @param {Array} [settings.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [settings.edges.edge.distance] Edge length. Distance between edge vertices.
	 **/
	constructor( scene, options, settings={} ) {

		settings.edges = settings.edges || [];
		let edgesCount = settings.count != undefined  ? settings.count : 3;//default is triangle
		if (edgesCount < 3) {

			console.error( sEdges + ': Minimal edges count is 3' );
			edgesCount = 3;
			
		}
		for ( let i = settings.edges.length; i < edgesCount; i++ ) settings.edges.push( {} );
		
		if (settings.edgesId === undefined) {
			
			//По умолчанию использую все ребра
			settings.edgesId = [];
			settings.edges.forEach( ( edge, i ) => settings.edgesId.push( i ) );

		}
		super( scene, options, settings );

		this.pushEdge = ( edge ) => {
			
			settings.indices.edges.push( edge );
			this.project( this.debug );
			
		}

	}

}

export default Edges;
