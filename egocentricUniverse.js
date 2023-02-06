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


import ND from '../../commonNodeJS/master/nD/nD.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.js';
//import ND from '../../commonNodeJS/master/nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if (ND.default) ND = ND.default;

class EgocentricUniverse {

	/**
	 * Egocentric universe.
	 * */
	constructor() {

		const n = 1;//Universe dimension

		/**
		 * @description array of Vertices.
		 * */
		const vertices = new Proxy([], {

			get: function (_vertices, name, proxy, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i >= _vertices.length)
						console.error('EgocentricUniverse: vertices get. Invalid index = ' + i + ' vertices.length = ' + _vertices.length);
					return _vertices[i];

				}
				switch (name) {

					case 'push': return (verticeEdges = []) => {

						//vertices.push(new Vertice(verticeEdges);//не хочу добавлять new Vertice(value) непосредственно в vertices потомучто хочу иметь одно место где создается new Vertice

						vertices[_vertices.length] = verticeEdges;

					};

				}

				return _vertices[name];

			},
			set: function (_vertices, name, value) {


				/**
				 * @description array of edges.
				 * */
				const edges = [];

				class Vertice {

					/**
					* @description Universe point is array of edge indices to other nearest universe vertices.
					* @param {Array|number} [verticeEdges=0] Array - array of edge indices to other nearest universe vertices.
					* <pre>
					* number - distance between this vertice and first nearest vertice.
					* </pre>
					*/
					constructor(verticeEdges = []) {

//						if (!(verticeEdges instanceof Array)) verticeEdges = [verticeEdges];
						const verticeEdgesCount = n === 1 ? 2 : undefined;
						for ( let i = 0; i < verticeEdgesCount; i++ ) {

							let verticeEdge = verticeEdges[i];
							verticeEdge = verticeEdge || {};
							if ( verticeEdge.d === undefined ) verticeEdge.d = 1.0;
							
/*
							class Edge {

								constructor(distance) { }

							}
							edges.push( new Edge(verticeEdge.d) );
*/						
							edges.push( verticeEdge.d );
							
						}
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

					}

				}
/*						
				if ((value === undefined) || !value.isVertice) value = new Vertice(value);
				array[name] = value;
*/						
				_vertices[name] = new Vertice(value);
				return true;

			},

		});

		vertices.push();
let vertice = vertices[0];
		vertices.forEach((vertice, i) => console.log(vertices));
		
	}

}

export default EgocentricUniverse;

