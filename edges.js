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
	project(
		n = 2,//universe dimension
//		faceId = 0
	) {

		//remove previous universe
		this.remove();

/*
		if (!this.settings.edgesId) {

			this.settings.edgesId = [];
			this.settings.edges.forEach( ( edge, i ) => this.settings.edgesId.push( i ) );

		}
*/
		//universe length
		let l = 0;
		this.settings.indices.edges.forEach( edge => l += edge.distance );
//		this.settings.indices.faces[this.settings.faceId].forEach( edgeId => l += this.settings.indices.edges[edgeId].distance );

		const THREE = three.THREE,
			r = l / ( 2 * Math.PI ),
			center = new THREE.Vector2( 0.0, 0.0 );

		const //point0 = new THREE.Vector3( 0, -r, 0 ),
			axis = new THREE.Vector3( 0, 0, 1 ),
			points = [
				new THREE.Vector3( 0, -r, 0 ),//point0,//0
			];
		let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
		const delta = 2 * Math.PI / l;
		for ( let i = 1; i < this.settings.indices.edges.length; i++ ) {

			angle += this.settings.indices.edges[i].distance * delta;
			points.push( new THREE.Vector3().copy( points[0] ).applyAxisAngle( axis, angle ) );

		}

		points.forEach( ( point, i ) => {
			
			//this.settings.position[i].positionWorld = undefined;//если не удалять positionWorld то вместо новых координат вершин будут браться старые
																//Это не позволяет добавлять новые вершины в объект
																//Никак не могу придумать как удалять positionWorld внутри ND когда у вершины устанвливаются новые координаты
																//Сейчас вместо этого использую settings.object.geometry.boRememberPosition: false,//Не запоминать позицию вершины в settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись позицию вершин в 3D
			this.settings.position[i] = point.toArray();
			
		} );
		
		const settings = {

			object: {

				geometry: {

					position: this.settings.position,
					boRememberPosition: false,//Не запоминать позицию вершины в settings.object.geometry.position[i].positionWorld чтобы при добавлении нового ребра заново вычислялись позицию вершин в 3D
					indices: [[]],
					
				}

			},
			
		}
		settings.object.geometry.indices[0] = this.settings.indices.edges;
		
		this.display( n, settings, this.debug ?
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
			position = settings.position;
		const debug = this.debug;

		if (settings.indices.isUniversyProxy) settings.indices = new Proxy( settings.indices, {

			get: function (_indices, name) {

				switch (name) {

					case 'edges': return _indices[0];
					case 'isUniversyProxy': return false;
					case 'faces':
/*						
						_indices[1] = _indices[1] || settings.faces || [];
						if (_indices[1].length === 0) _indices[1].push( [0, 1, 2] );
*/	  
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

		if (settings.indices.edges) return;
		
		settings.indices[1] = settings.indices[1] || settings.faces || [];
		if (settings.indices[1].length === 0) settings.indices[1].push( [0, 1, 2] );
		
		const sIndicesEdgesSet = ': indices.edges set. ';
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

		function Edge( edgeSettings = {} ) {

			const sEdge = sEdges + ': ' + (edgeSettings.edgeId === undefined ? 'Edge' : 'edges[' + edgeSettings.edgeId + ']'),
				svertices = sEdge + '.vertices';
			edgeSettings.edges = edgeSettings.edges || edgeSettings.this.settings.indices.edges;
			edgeSettings.edge = edgeSettings.edge || edgeSettings.edges[edgeSettings.edgeId] || {};
			
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

					console.error(svertices + '. Vertices index = ' + i + ' is limit from 0 to 1');
					return false;

				}
				return true;

			}
			function VerticeIdDebug(i, verticeId) {

				if ((verticeId === position.length) && (//этой вершины нет списке вершин
					(edgeSettings.edgeId === undefined) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
					(edgeSettings.edgeId != (edgeSettings.edges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
				)
				)
					position.push();//{edgeId: edgeIndex});

				if (!debug) return true;

				if (!IdDebug(i)) return false;

				if (isNaN(parseInt(verticeId))) {

					console.error(svertices + '[' + i + ']. Invalid vertice index = ' + verticeId);
					return false;

				}
				if ((verticeId < 0) || (verticeId >= position.length)) {

					console.error(svertices + '[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (position.length - 1));
					return false;

				}
				for (let index = 0; index < 2; index++) {

					if (index === i) continue;//не надо сравнивать самого себя

					if (verticeId === edgeSettings.edge.vertices[index]) {

						console.error(svertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
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
							(i === 1) && (edgeSettings.edgeId === edgeSettings.edges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
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
			edgeSettings.edges = edgeSettings.edges || indices.edges;
			if (debug)

				for (let edgeCurId = (edgeSettings.edgeId === undefined) ? 0 : edgeSettings.edgeId; edgeCurId < edgeSettings.edges.length; edgeCurId++) {

					if ((edgeSettings.edgeId != undefined) && (edgeSettings.edgeId === edgeCurId)) continue;//Не сравнивать одно и тоже ребро

					const edgeCur = edgeSettings.edges[edgeCurId], verticesCur = edgeCur.vertices;
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
							if (_vertices.length > 2) console.error(svertices + ' set. Invalid length = ' + _vertices.length);
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
				settings.indices.edges[settings.indices.edges.length - 1][1] = position.length - 1;

			}

			//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
			//что бы потом проверить в vertices.test();
			if (debug) {

				const newEdgeId = edgeSettings.edges.length;
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
							if (edge.distance === undefined) edge.distance = 2 * Math.PI / edgeSettings.edges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
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

		//у треугольника ребер не должно быть меньше 3
		for (let i = settings.edges.length; i < settings.count; i++) settings.edges.push({});

		if (settings.indices.edges)
		{


			for (let i = 0; i < settings.edges.length; i++) {

				const edge = settings.edges[i] || {};
				if (!edge.isProxy) settings.indices.edges.push( Edge({
					edges: settings.indices.edges,
					edgeId: i
				}) );

			}
			
		} else {

			settings.indices.edges =
				new Proxy(settings.edges, {

				get: function (_edges, name) {

					const i = parseInt(name);
					if (!isNaN(i)) return _edges[settings.indices.faces[settings.faceId][i]];//_edges[settings.edgesId[i]];

					switch (name) {

						case 'push': return (edge={}) => {

							settings.indices.faces[settings.faceId].push( _edges.push(Edge({ edge: edge, edges: settings.indices.edges } ) ) - 1 );
//							settings.edgesId.push( _edges.push(Edge({ edge: edge, edges: settings.indices.edges } ) ) - 1 );

						};
						case 'length': return settings.indices.faces[settings.faceId].length;//settings.edgesId.length;

					}
					return _edges[name];

				},
				set: function (_edges, name, value) {

					const i = parseInt(name);
					if (!isNaN(i)) _edges[settings.indices.faces[settings.faceId][i]] = value;//_edges[settings.edgesId[i]] = value;

					return true;

				}

			});

			settings.indices.edges.forEach( ( edge, i ) => settings.indices.edges[i] = Edge( { this: this, edgeId: i } ) );

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
	 * @param {number} [settings.faceId=0] Identifier of the array of the edges ids in the <b>settings.indices.faces array</b>.
	 **/
	constructor( scene, options, settings={} ) {

		if (settings.faceId === undefined) settings.faceId = 0;
		settings.edges = settings.edges || [];
		let edgesCount = settings.count != undefined  ? settings.count : 3;//default is triangle
		if (edgesCount < 3) {

			console.error( sEdges + ': Minimal edges count is 3' );
			edgesCount = 3;
			
		}
		for ( let i = settings.edges.length; i < edgesCount; i++ ) settings.edges.push( {} );
/*		
		if (settings.edgesId === undefined) {
			
			//По умолчанию использую все ребра
			settings.edgesId = [];
			settings.edges.forEach( ( edge, i ) => settings.edgesId.push( i ) );

		}
*/
		super( scene, options, settings );

		this.pushEdge = ( edge ) => {
			
			settings.indices.edges.push( edge );
			this.project();
			
		}

	}

}

export default Edges;
