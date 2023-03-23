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

import three from '../../commonNodeJS/master/three.js'

const debug = true;
//const debug = false;

class EgocentricUniverse {

	/**
	 * Egocentric universe.
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [settings={}] The following settings are available
	 * @param {number} [settings.n=3] dimension of the universe space.
	 **/
	constructor(scene, options, settings = {} ) {

		const sEgocentricUniverse = 'EgocentricUniverse';
		
		if (settings.edgesCount !== undefined) {

			//dimension of the universe space.
			if ((settings.n != undefined) && (settings.n != 1)) console.error(sEgocentricUniverse + ': Invalid dimension of the universe space = ' + settings.n);
			settings.n = 1;
			
		}
		if (settings.n === undefined) settings.n = 3;
		
		if (debug && ( ( settings.n > 3 ) || ( settings.n < 1 ) )) {
			
			console.error(sEgocentricUniverse + ': Dimension of the universe space = ' + settings.n + ' is limited from 1 to 3.');
			return;

		}

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

			universe: "Universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.universe = 'Вселенная';

				break;
			default://Custom language
				if ((guiParams.lang === undefined) || (guiParams.lang.languageCode != _languageCode))
					break;

				Object.keys(guiParams.lang).forEach(function (key) {

					if (lang[key] === undefined)
						return;
					lang[key] = guiParams.lang[key];

				});

		}
		
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
						console.error(sEgocentricUniverse + ': indices get. Invalid index = ' + i + ' indices.length = ' + _indices.length);
					return _indices[i];

				}
*/
				switch (name) {

					case 'edges':
						if (!_indices[0]) indices.edges = [];
						return _indices[0];
						
				}
//				console.error(sEgocentricUniverse + ': indices get: invalid name: ' + name);
				return _indices[name];

			},
			set: function (_indices, name, value) {

				const sIndicesEdgesSet = ': indices.edges set. ';
				switch (name) {

					case 'edges':

						if ( debug ) {
							
							if ( _indices[0]) {
	
								console.error(sEgocentricUniverse + sIndicesEdgesSet + 'duplicate edges');
								return true;
	
							}
	
							if ( !( value instanceof Array ) ){
	
								if (typeof value === "number") {

									const edges = [];
									for ( let i = 0; i < value; i++ ) edges.push({});
									value = edges;
									
								} else {
									
									console.error(sEgocentricUniverse + sIndicesEdgesSet + 'Invalid edges array: ' + value);
									return true;
									
								}
	
							}

						}

						function Edge(edge, settings={}) {

							const sEdge = sEgocentricUniverse + ': ' + ( settings.edgeId === undefined ? 'Edge' : 'edges[' + settings.edgeId + ']' ),
								svertices = sEdge + '.vertices';
							edge = edge || {};

							//edge vertices
							
							edge.vertices = edge.vertices || [];
							if ( debug ) {
								
								if (edge.isProxy) {
	
									console.error(sEdge + '. Duplicate proxy');
									return edge;
	
								}
								if ( edge instanceof Array ) {

									console.error(sEdge + '. Invalid edge instance' );
									return false;

								}
								if ( !( edge.vertices instanceof Array  ) ) {

									console.error(sEdge + '. Invalid edge.vertices instance' );
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
								if ( (verticeId < 0) || (verticeId >= vertices.length) ) {

									console.error(svertices + '[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (vertices.length - 1));
									return false;

								}
								for (let index = 0; index < 2; index++) {

									if (index === i) continue;//не надо сравнивать самого себя

									if (verticeId === edge.vertices[index]) {

										console.error(svertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
										return false;

									}

								};
								return true;

							}
							for (let i = 0; i < 2; i++) {

								if (edge.vertices[i] === undefined) {

									edge.vertices[i] = (
										vertices.length === 0) ||//первая вкршина первого ребра
										((settings.edgeId != undefined) &&//ребро из массива ребер
										 (i === 1) && (settings.edgeId === settings.edges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
										0 : 
											settings.edgeId != undefined ?
											vertices.length + ( i === 0 ? -1 : 0) : //ребро из массива ребер
											//Новое ребро добавляется при помощи edges.push()
											i === 0 ? vertices.length : //первая вершина
											0//Соеденить последнюю вершину нового ребра с первой першиной первого ребра
										;

								}
								VerticeIdDebug(i, edge.vertices[i]);

							}
							settings.edges = settings.edges || indices.edges;
							if ( debug )

								for ( let edgeCurId = ( settings.edgeId === undefined ) ? 0 : settings.edgeId; edgeCurId < settings.edges.length; edgeCurId++ ) {

									if( ( settings.edgeId != undefined ) && ( settings.edgeId === edgeCurId ) ) continue;//Не сравнивать одно и тоже ребро
//									if( ( settings.edgeId === undefined ) || ( settings.edgeId !== edgeCurId ) )

									const edgeCur = settings.edges[edgeCurId], verticesCur = edgeCur.vertices;
									if (!verticesCur) continue;//в данном ребре еще нет вершин
									const vertices = edge.vertices;
									if (
										( vertices[0] === verticesCur[0] ) && ( vertices[1] === verticesCur[1] ) ||
										( vertices[1] === verticesCur[0] ) && ( vertices[0] === verticesCur[1] )
									)
										console.error(sEgocentricUniverse + ': Duplicate edge. Vertices = ' + vertices );
										
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
											if (_vertices.length > 2) console.error(svertices + ' set. Invalid length = ' + _vertices.length);

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

							
							if (settings.edgeId === undefined) {

								//если вставляем новое ребро с помощью edges.push()
								//надо последнюю вершину последнего ребра заменить на новую вершину
								indices.edges[indices.edges.length - 1].vertices[1] = vertices.length - 1;
								
							}
							
							//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
							//что бы потом проверить в vertices.test();
							if (debug) {

//								if (settings.edgeId === undefined) settings.edgeId = settings.edges.length;//новое ребро добавляется с помощю push
								const newEdgeId = settings.edges.length;
								edge.vertices.forEach( verticeId => {

									const edges = vertices[verticeId].edges;
									if (settings.edgeId === undefined) {
										
										//новое ребро добавляется с помощю push
										if (verticeId === 0)
											//в первой вершине заменяем последнее ребро на новое ребро
											edges[1] = newEdgeId
											//В последнюю вершину добавляем новое ребро
										else edges.push( newEdgeId,
												verticeId//for debug
											);
										
/*											
										if (edges.length === 0)
											edges.push( newEdgeId,
												verticeId//for debug
											);
										 else {

											 //надо отредактировать первую и последнюю вершину, что бы между ними появилось новое ребро
											 edges.forEach( ( edgeId, i) => {

												 if (verticeId === 0) {//редактируем первую вершину

													 if (edgeId != 0)//первое ребро первой вершины редактировать не надо
														 edges[i] = newEdgeId;
													 
												 }
												 
											 });
											 
										 }
*/											
										
									} else edges.push( settings.edgeId,
										verticeId//for debug
									);
										
								} );

							}
/*
							if (debug) edge.vertices.forEach( verticeId => vertices[verticeId].edges.push( settings.edgeId === undefined ? 
																										  settings.edges.length ://новое ребро добавляется с помощю push
																										  settings.edgeId ) );
*/							
							
							return new Proxy(edge, {

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

//											get: (edgeVertices, name) => { return edgeVertices[name]; },
											set: (edgeVertices, name, value) => {

												if (debug) {
													
													vertices[value].edges.push( settings.edgeId,
														   value//for debug
													  );
/*													
													vertices[edgeVertices[name]].edges.pop();
													vertices.pop();
*/			 

												}
												edgeVertices[name] = value;
/*
												vertices[value].edges
							
//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
//что бы потом проверить в vertices.test();
if (debug) edge.vertices.forEach( verticeId => vertices[verticeId].edges.push( settings.edgeId === undefined ? 
																			  settings.edges.length ://новое ребро добавляется с помощю push
																			  settings.edgeId ) );
*/					 
												
												return true;
												
											}
											
										} );
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

						}
						
						//сразу заменяем все ребра на прокси, потому что в противном случае, когда мы создаем прокси ребра в get, каждый раз,
						//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
						//EgocentricUniverse: Edge get. Duplicate proxy
						for ( let i = 0; i < value.length; i ++ ) {
							
							const edge = value[i];
							value[i] = Edge(edge, { edges: value, edgeId: i });
							//value[i] = Edge(value[i]);//Error: EgocentricUniverse: Edge. Duplicate proxy
							
						}
						
						_indices[0] = new Proxy(value, {

							get: function (_edges, name) {

								const i = parseInt(name);
								if (!isNaN(i))
									return _edges[i];
									//return Edge(_edges[i]);//не надо в get создавать прокси, потомучто он будет создаваться каждый раз, когда вызывается get, в результате может получться бесконечная вложенная конструкция

								switch (name) {

									case 'push': return (edge) => {

										//console.log(sEgocentricUniverse + ': indices.edges.push(' + JSON.stringify(edge) + ')');
										_edges.push(Edge(edge));
/*										
										//разомкнуть в конце старое кольцо ребер и вставить туда нове ребро.
										//Для этого заменить последнюю вершину предпоследнего ребра на последнюю вершину
										const edgeVertices = _edges[_edges.length - 2].vertices;
										edgeVertices[edgeVertices.length - 1] = vertices.length - 1;
*/		  

									};
									break;
									case 'project': return () => {

										//Project universe into 3D space

										//universe length
										let l = 0;
										indices.edges.forEach( edge => { l += edge.distance; } );

/*										
										//Угол поворота радиуса вселенной для текущей вершины
										const angles = [ 0.0 ], delta = 2 * Math.PI / l;
										for ( let i = 1; i < indices.edges.length; i++ )
											angles.push( angles[ i - 1 ] + indices.edges[i].distance * delta );
*/		   
										
										const THREE = three.THREE,
											r = l / ( 2 * Math.PI ),
											center = new THREE.Vector2( 0.0, 0.0 );

										if ( debug ) {

											//https://stackoverflow.com/questions/13756112/draw-a-circle-not-shaded-with-three-js

											//https://stackoverflow.com/a/70466408/5175935
											scene.add( new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( new THREE.EllipseCurve(
												center.x, center.y,// Center x, y
												r, r,// x radius, y radius
												0.0, 2.0 * Math.PI,// Start angle, stop angle
											).getSpacedPoints(256) ), new THREE.LineBasicMaterial( { color: 'blue' } ) ) );
											
										}
/*										
										const points = new THREE.EllipseCurve(
											center.x, center.y,// Center x, y
											r, r,// x radius, y radius
											0.0, 2.0 * Math.PI,// Start angle, stop angle
										).getSpacedPoints( 3 );
										const universe3D = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( points ), new THREE.LineBasicMaterial( { color: 'green' } ) );
*/									
										const point0 = new THREE.Vector3( 0, -r, 0 ),
											axis = new THREE.Vector3( 0, 0, 1 ),
//											angle = 2 * Math.PI / 3,
											points = [
												point0,//0
//												new THREE.Vector3().copy( point0 ).applyAxisAngle( axis, angle ),//1
//												new THREE.Vector3().copy( point0 ).applyAxisAngle( axis, 2 * angle ),//2
											];
										let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
										const delta = 2 * Math.PI / l;
										for ( let i = 1; i < indices.edges.length; i++ ) {

											angle += indices.edges[i].distance * delta;
											points.push( new THREE.Vector3().copy( point0 ).applyAxisAngle( axis, angle ) );
//											points.push( new THREE.Vector3().copy( point0 ).applyAxisAngle( axis, angles[i] ) );

										}
										
										const index = [];
										indices.edges.forEach( edge => {

											edge.vertices.forEach( ( vertice => index.push( vertice ) ) );
											
										} );
										const universe3D = new THREE.LineSegments( new THREE.BufferGeometry().setFromPoints(points).setIndex( index ),
																		  new THREE.LineBasicMaterial( { color: 'green', } ) );
					
										scene.add( universe3D );

										if ( options.guiSelectPoint ) {
											
											if ( universe3D.name === '' ) universe3D.name = lang.universe;
											options.guiSelectPoint.addMesh( universe3D );

										}

									};
									break;

								}
								//									console.error(sEgocentricUniverse + ': indices.edges get: invalid name: ' + name);
								return _edges[name];

							},
							set: function (_edges, name, value) {

								const i = parseInt(name);
								if (!isNaN(i)) {

									console.error(sEgocentricUniverse + sIndicesEdgesSet + 'Hidden method: edges[' + i + '] = ' + JSON.stringify(value));
									_edges[i] = value;

								}
								return true;

							}

						});
						//value.forEach( edge => indices.edges.push( edge ) )
/*
						//сразу заменяем все ребра на прокси, потому что в противном случае, когда мы создаем прокси ребра в get, каждый раз,
						//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
						//EgocentricUniverse: Edge get. Duplicate proxy
						for ( let i = 0; i < indices.edges.length; i ++ )
							indices.edges[i] = Edge(indices.edges[i]);
*/						
						break;
					case 'faces':
						if ( debug ) {
							
							const sIndicesFacesSet = ': indices.faces set. ';
							if ( _indices[1]) {
	
								console.error(sEgocentricUniverse + sIndicesFacesSet + 'duplicate faces');
								return true;
	
							}
	
							if ( !( value instanceof Array ) ){
	
								console.error(sEgocentricUniverse + sIndicesFacesSet + 'Invalid faces array: ' + value);
								return true;
	
							}

						}
						function Face(face, settings={}) {

							const sFace = sEgocentricUniverse + ': Face';
							
							//Face edges
							
							face.edges = face.edges || [];
							if ( debug ) {
								
								if (face.isProxy) {
	
									console.error(sFace + '. Duplicate proxy');
									return edge;
	
								}
								if ( face instanceof Array ) {

									console.error(sFace + '. Invalid face instance' );
									return false;

								}
								if ( !( face.edges instanceof Array  ) ) {

									console.error(sFace + '. Invalid face.edges instance' );
									return false;

								}

							}
							function IdDebug(i) {

								if (!debug) return true;

								if ((i < 0) || (i > 3)) {

									console.error(sEgocentricUniverse + '. indices.faces[' + settings.faceId + '].edges[index] index = ' + i + ' is limit from 0 to 3');
									return false;

								}
								return true;

							}
							function EdgeIdDebug(i, edgeId) {

								if ( edgeId === indices.edges.length ) indices.edges.push();
								
								if (!debug) return true;

								if ( !IdDebug(i) ) return false;

								if (isNaN(parseInt(edgeId))) {

									console.error(sFace + '[' + i + ']. Invalid edge index = ' + edgeId);
									return false;

								}
								if ( (edgeId < 0) || (edgeId >= indices.edges.length) ) {

									console.error(sFace + '[' + i + ']. edge index = ' + edgeId + ' is limit from 0 to ' + (indices.edges.length - 1));
									return false;

								}
								for (let index = 0; index < face.edges.length; index++) {

									if (index === i) continue;//не надо сравнивать самого себя

									if (edgeId === face.edges[index]) {

//not tested
										console.error(sFace + '[' + i + '].edges. Duplicate edge index = ' + edgeId);
										return false;

									}

								};
								return true;

							}
							//EdgeIdDebug(0, {});//error: EgocentricUniverse: Face[0]. Invalid edge index = [object Object]
							//EdgeIdDebug(4, 0);//Error: EgocentricUniverse. indices.faces[0].edges[index] index = 4 is limit from 0 to 3
							//EdgeIdDebug(0, 1);//Error: EgocentricUniverse: Face[0]. edge index = 1 is limit from 0 to -1
							for (let i = 0; i < 4; i++) {

								if (face.edges[i] === undefined) face.edges[i] = i;//default id of edge.
								EdgeIdDebug(i, face.edges[i]);

							}
							
						}
						
						//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
						//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
						//EgocentricUniverse: Face get. Duplicate proxy
						for ( let i = 0; i < value.length; i ++ ) {
							
							const face = value[i];
							value[i] = Face(face, { faces: value, faceId: i });
							
						}
						break;
					default: console.error(sEgocentricUniverse + ': indices set: invalid name: ' + name);
					
				}
				return true;

			}

		});
/*
		//n = 1. Одномерная вселенная. Минимаьное количество вершин равно 3, фигура - треугольник, вписанный в окружность
		//n = 2. Двумерная  вселенная. Минимаьное количество вершин равно 4, фигура - тетраэдр tetrahedron или пирамида, вписанная в сферу. https://en.wikipedia.org/wiki/Tetrahedron
		//n = 3. Трехмерная вселенная. Минимаьное количество вершин равно 5, фигура - пятияче́йник 5-cell, или пентахор pentachoron, pentatope, pentahedroid, or tetrahedral pyramid https://en.wikipedia.org/wiki/5-cell, вписанный в трёхмерную сферу или 3-sphere https://en.wikipedia.org/wiki/3-sphere
		let vertices = [];
		for (let i = 0; i < n + 2; i++)
			vertices.push({});
*/   

		/**
		 * @description array of Vertices.
		 **/
		const vertices = new Proxy( [], {

			get: function (_vertices, name) {

				const i = parseInt(name);
				if (!isNaN(i)) {

/*					
					console.error(sEgocentricUniverse + ': vertices get. Hidden method: vertices[' + i + ']');
					return;
*/	 
					if (i >= _vertices.length)
						console.error(sEgocentricUniverse + ': vertices get. Invalid index = ' + i + ' vertices.length = ' + _vertices.length);
					return _vertices[i];

				}
				switch (name) {

					case 'push': return ( vertice={} ) => {

						_vertices.push( new Proxy( vertice, {

							get: (vertice, name) => {

								switch (name) {
										
								case 'edges':
										
									if (!debug) {

										console.error(sEgocentricUniverse + ': vertice.edges. Set debug = true first.');
										return;
										
									}
									vertice.edges = vertice.edges || new Proxy( [], {

										get: (edges, name) => {
			
											switch (name) {
													
												case 'push': return ( edgeId, verticeId ) => {

													if (debug) {

														const sPush = sEgocentricUniverse + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';
														
														//нельзя добавлть новое ребро если у вершины уже два ребра
														if (edges.length >= 2) {
															
															console.error(sPush + ' invalid edges.length = ' + edges.length);
															return;
															
														}
														//find for duplicate edgeId
														for ( let j = 0; j < edges.length; j++ ) {
															
															if (edges[j] === edgeId) {
	
																console.error(sPush + ' duplicate edgeId: ' + edgeId);
																return;
																
															}
	
														}

													}
													
													edges.push( edgeId );
													
												}
	
											}
											return edges[name];
												
										}, 
									} );
									return vertice.edges;

								}
								
							},
												  
						} ) );
/*						
						settings.vertice = settings.vertice || {};
						if (debug) {

							//Для отладки. Добавляем массив ребер, в которых используется эта вершина
							if (settings.edgeId != undefined) {

								settings.vertice.edges = settings.vertice.edges || [];
								settings.vertice.edges.push( settings.edgeId );
								
							}
								
						}
						_vertices.push( settings.vertice );
*/	  

					};
					break;
					//for debug
					case 'test': return () => {

							//соеденить конец последнего ребра с началом первого ребра
							//indices.edges[indices.edges.length - 1].vertices[1] = indices.edges[0].vertices[0];

							if (!debug) return;
						
							_vertices.forEach( ( vertice, verticeId ) => {
	
							const str1 = sEgocentricUniverse + ': vertices.test()', strVerticeId = 'vertices(' + verticeId + ')';
							if (!debug) {
	
								console.error(str1 + '. Set debug = true first.');
								return;
								
							}
							if (vertice.edges.length !== ( settings.n === 1 ? 2 : 0 ))
								console.error(str1 + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
							vertice.edges.forEach( edgeId => {
	
								if (typeof edgeId !== "number") console.error(str1 + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);
								
							} );
							
						} )
					}
					break;

				}
				return _vertices[name];

			},
			set: function (_vertices, name, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					console.error(sEgocentricUniverse + ': vertices set. Hidden method: vertices[' + i + '] = ' + value);
					_vertices[i] = value;
/*					
					if (i >= _vertices.length)
						console.error(sEgocentricUniverse + ': vertices get. Invalid index = ' + i + ' vertices.length = ' + _vertices.length);
					return _vertices[i];
*/	 

				}
/*
				switch (name) {

					case 'edges':
						if (_indices[0] === undefined)
							_indices[0] = value;
						break;
					default: console.error(sEgocentricUniverse + ': indices set: invalid name: ' + name);

				}
*/
				return true;

			}

		});

/*		
		//n = 1. Одномерная вселенная. Минимаьное количество вершин равно 3, фигура - треугольник, вписанный в окружность
		//n = 2. Двумерная  вселенная. Минимаьное количество вершин равно 4, фигура - тетраэдр tetrahedron или пирамида, вписанная в сферу. https://en.wikipedia.org/wiki/Tetrahedron
		//n = 3. Трехмерная вселенная. Минимаьное количество вершин равно 5, фигура - пятияче́йник 5-cell, или пентахор pentachoron, pentatope, pentahedroid, or tetrahedral pyramid https://en.wikipedia.org/wiki/5-cell, вписанный в трёхмерную сферу или 3-sphere https://en.wikipedia.org/wiki/3-sphere
		for ( let i = 0; i < n + 2; i++ )
			vertices.push();
*/		
		switch( settings.n ){

			case 1://1D universe.
				indices.edges = settings.edgesCount || 3;
				//indices.edges = '5';//Error: EgocentricUniverse: indices.edges set. Invalid edges array: 5
				/*
				indices.edges = [

					{
						//vertices: [0,1],
						//distance: 1.0,//0.5,
					},//0
					{
						//vertices: [1,2]
					},//1
					{
						//vertices: [2,0]				
						//vertices: [2,3]
					},//2
					{
						//vertices: [3,0]
					},//3
								
				];
				*/
				/*
				indices.edges.push( {
					//vertices: [3,0],
				} );//3
				*/
					
				vertices.test();

				if ( debug ) {
				
					//test for duplicate vertice.edges edgeId
					//indices.edges[0].vertices[0] = 1;//error: EgocentricUniverse: Edge.vertices[0]. Duplicate vertice index = 1
					//vertices[1].edges[0] = 1;//на данный момент в vertice.edges можно иметь несколько ссылок на одно ребро потому что это не влияет на результат
					
					//indices.edges.push({});//Error: EgocentricUniverse: Duplicate edge. Vertices = 0,1
					//indices.edges.push({ vertices: [1,0] });//Error: EgocentricUniverse: Duplicate edge. Vertices = 1,0
					//indices.edges.push({ vertices: [1,2] });
					//indices.edges = [];//Error: EgocentricUniverse: indices.edges set. duplicate edges
					//indices.edges[0] = {};//Error: EgocentricUniverse: indices.edges set. Hidden method: edges[0] = {}
					indices.edges.forEach( ( edge, edgeIndex ) => {
	
						//indices.edges[0] = edge;//Error: EgocentricUniverse: indices.edges set. Hidden method: edges[0] = {"vertices":[0,1]}
						//indices.edges.push(edge);//Error: EgocentricUniverse: Edge. Duplicate proxy
						const edgeVertices = edge.vertices;
						//edge.vertices = edgeVertices;
	//					const edgeVerticeId = edgeVertices[0];
						//edgeVertices.forEach( ( vertice, i ) => console.log( 'indices.edges[' + edgeIndex + '].vertices[' + i + '] = ' + vertice ) );
						//edgeVertices[1] = 2;
					
					} );

				}
				
				break;
			case 2://2D universe.
				//indices.faces = 6;//Error: EgocentricUniverse: indices.faces set. Invalid faces array: 6
				indices.faces = [
					{
						//edges: [0,1,2],
						//edges: 2,//Error EgocentricUniverse: Face. Invalid face.edges instance
					},//0
					
				];
				//indices.faces = [];//Error: EgocentricUniverse: indices.faces set. duplicate faces
				break;
			default: console.error(sEgocentricUniverse + ': Invalid universe dimension ' + settings.n);
				return;
				
		}
		
		if ( debug ) {
			
//			console.log('\nvertices:');
			vertices.forEach((vertice, i) => console.log('vertices[' + i + ']. ' + JSON.stringify( vertice )));
	
//			console.log('\nindices.edges:');
			indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + ']. ' + JSON.stringify( edge )));

		}

		//Project universe into 3D space
		indices[indices.length - 1].project();
		
	}

}

export default EgocentricUniverse;

