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

		class Edge {

			/**
			 * @description Distance between nearest vertices
			 * @param {float} distance length of the edge
			 */
			constructor(distance){}
			
		}

/*		
		const vertice = new Vertice();
		const length = vertice.length;
		const vertices = [vertice];
*/  
		/**
		 * @description array of edges.
		 * */
		const edges = [];
		/**
		 * @description array of Vertices.
		 * */
		const vertices = new Proxy([], {

			get: function (array, name, proxy, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i >= array.length)
						console.error('EgocentricUniverse: vertices get. Invalid index = ' + i + ' vertices.length = ' + array.length);
					return array[i];

				}
				switch (name) {

					case 'push': return (value) => {

						//array.push(new Vertice(value));//не хочу добавлять new Vertice(value) непосредственно в array потомучто хочу иметь одно место где создается new Vertice

						vertices[array.length] = value;
					
					};

				}

				return array[name];

			},
			set: function (array, name, value) {
/*
				switch (name) {
				
					case 'out':
						this.out = value;
						value.verticesArray = new Float32Array(value.out);
						value.uint32Array = new Uint32Array(value.out);
						return true;
				
				}
*/
				class Vertice {

					/**
					 * @description Universe point is array of edge indices to other nearest universe vertices.
					 * @param {Array|Float} [edges=0] Array - array of edge indices to other nearest universe vertices.
					 * <pre>
					 * Float - distance between this vertice and first nearest vertice.
					 * </pre>
					 */
					constructor(edges = []) {

						if (!(edges instanceof Array)) edges = [edges];
						return new Proxy(edges, {

							get: function (edges, name) {

								const i = parseInt(name);
								if (!isNaN(i)) {

									if (name >= points.length)
										console.error('EgocentricUniverse: Vertice get. Invalid index = ' + name);
									//						const j = i * this.out.lengthts.verticesRowlength;
									const vertice = new VectorWebGPU(this.out, i);

									return vertice;

								}
								switch (name) {

									case 'length': console.error('EgocentricUniverse: Vertice get. Invalid ' + name); break;
									case 'isVertice': return true;
		/*								
									case 'forEach': return (callback) => {
									
										for (let i = 0; i < points.length; i++)callback(points[i], i);
									
									}
									case 'target': return;
									case 'aNear': return {};
									default: console.error('EgocentricUniverse: Vertice get. Invalid name: ' + name);
		*/

								}

								return edges[name];

							},
							set: function (edges, name, value) {
		/*
								switch (name) {
								
									case 'out':
										this.out = value;
										value.verticesArray = new Float32Array(value.out);
										value.uint32Array = new Uint32Array(value.out);
										return true;
								
								}
		*/
								const i = parseInt(name);
								if (!isNaN(i)) {

									if (name >= points.length)
										console.error('EgocentricUniverse: Vertice set. Invalid index = ' + name);

								}
								edges[name] = value;
								return true;

							},

						});

					}

				}
				if ( (value === undefined) || !value.isVertice ) value = new Vertice(value);
				array[name] = value;
				return true;

			},

		});
		vertices.push(1.1);
let vertice = vertices[0];
		vertices.forEach((vertice, i) => console.log(vertices));
		
	}

}

export default EgocentricUniverse;

