/**
 * @module EgocentricUniverse
 * @description Base class for egocentric universe.
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

const sEgocentricUniverse = 'EgocentricUniverse', sOverride = sEgocentricUniverse + ': Please override the %s method in your child class.';

class EgocentricUniverse {

	get verticeEdgesLengthMax() {
		
		console.error(sOverride.replace('%s', 'Indices'));
//		return 0;
	
	}
	project() { console.error(sOverride.replace('%s', 'project')); }
	Indices() { console.error(sOverride.replace('%s', 'Indices')); }
	Test() { console.error(sOverride.replace('%s', 'Test')); }
	
	/**
	 * Base class for egocentric universe.
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [settings={}] The following settings are available
	 * @param {number} [settings.сount] If dimension of the universe space is 1 then <b>сount</b> is edges count. Default is 3.
	 * <pre>
	 * If dimension of the universe space is 2 then under constraction.
	 * If dimension of the universe space is 3 then under constraction.
	 * </pre>
	 **/
	constructor(scene, options, settings = {} ) {

		const egocentricUniverse = this;
/*		
		if (settings.edgesCount !== undefined) {

			//dimension of the universe space.
			if ((settings.n != undefined) && (settings.n != 1)) console.error(sEgocentricUniverse + ': Invalid dimension of the universe space = ' + settings.n);
			settings.n = 1;
			
		}
*/
/*
		if (settings.n === undefined) settings.n = 3;
		
		if (debug && ( ( settings.n > 3 ) || ( settings.n < 1 ) )) {
			
			console.error(sEgocentricUniverse + ': Dimension of the universe space = ' + settings.n + ' is limited from 1 to 3.');
			return;

		}
*/

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
						function Face( settings={} ) {

							const sFace = sEgocentricUniverse + ': Face';
							settings.face = settings.face || {};
							
							//Face edges
							
							settings.face.edges = settings.face.edges || [];
							if ( debug ) {
								
								if (settings.face.isProxy) {
	
									console.error(sFace + '. Duplicate proxy');
									return edge;
	
								}
								if ( settings.face instanceof Array ) {

									console.error(sFace + '. Invalid face instance' );
									return false;

								}
								if ( !( settings.face.edges instanceof Array  ) ) {

									console.error(sFace + '. Invalid face.edges instance' );
									return false;

								}

							}
							function IdDebug(i) {

								if (!debug) return true;

								if ((i < 0) || (i > 2)) {

									console.error(sEgocentricUniverse + '. indices.faces[' + settings.faceId + '].edges[index] index = ' + i + ' is limit from 0 to 2');
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
								for (let index = 0; index < settings.face.edges.length; index++) {

									if (index === i) continue;//не надо сравнивать самого себя

									if (edgeId === settings.face.edges[index]) {

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
							for (let i = 0; i < 3; i++) {//У каждой грани 3 ребра

								if (settings.face.edges[i] === undefined) settings.face.edges[i] = i;//default id of edge.
								EdgeIdDebug(i, settings.face.edges[i]);

							}
							
							return new Proxy(settings.face, {

								get: function (face, name) {

									const i = parseInt(name);
									if (!isNaN(i)) {

										if (name >= face.length)
											console.error(sFace + ' get. Invalid index = ' + name);
										return face[name];

									}
									switch (name) {

										case 'isProxy': return true;

									}
									return face[name];

								},
								set: function (face, name, value) {

									face[name] = value;
									return true;

								},

							});
							
						}
						
						//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
						//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
						//EgocentricUniverse: Face get. Duplicate proxy
						for ( let i = 0; i < value.length; i ++ ) {
							
							const face = value[i];
							value[i] = Face({ face: face, faces: value, faceId: i });
							
						}
						_indices[1] = new Proxy(value, {

							get: function (_faces, name) {

								const i = parseInt(name);
								if (!isNaN(i))
									return _faces[i];

								switch (name) {

									case 'push': return (face) => {

											//console.log(sEgocentricUniverse + ': indices.faces.push(' + JSON.stringify(face) + ')');
											_faces.push(Face({ face: face }));
	
										};
										break;

								}
//									console.error(sEgocentricUniverse + ': indices.faces[' + name + '] get: invalid name: ' + name);
								return _faces[name];

							},
							set: function (_faces, name, value) {

								const i = parseInt(name);
								if (!isNaN(i)) {

									console.error(sEgocentricUniverse + sIndicesEdgesSet + 'Hidden method: faces[' + i + '] = ' + JSON.stringify(value));
									_faces[i] = value;

								}
								return true;

							}

						});
						break;
					case '_indices': return _indices;
					case 'edges': return _indices[0];
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

/*														
														//нельзя добавлть новое ребро если у вершины уже два ребра
														if (edges.length >= 2)
*/			  
														if (edges.length >= this.verticeEdgesLengthMax) {
															
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
/*
							if (!debug) {
	
								console.error(str1 + '. Set debug = true first.');
								return;
								
							}
*/
							egocentricUniverse.Test(vertice, str1, strVerticeId);
/*
							if (vertice.edges.length !== ( settings.n === 1 ? 2 : 0 ))
								console.error(str1 + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
*/
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
		//settings.count = 'count';//Error: edges.js:146 Edges: indices.edges set. Invalid edges array: count
		this.Indices(indices, settings, vertices, debug);
		//this.Indices(indices, settings, vertices, debug);//Error: Edges: indices.edges set. duplicate edges
		
		vertices.test();
		
		if ( debug ) {
			
			vertices.forEach((vertice, i) => console.log('vertices[' + i + ']. ' + JSON.stringify( vertice )));
	
			indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + ']. ' + JSON.stringify( edge )));

		}

		//Project universe into 3D space
		this.project( indices, three, scene, options, debug );
//		indices[indices.length - 1].project();
		
	}

}

export default EgocentricUniverse;

