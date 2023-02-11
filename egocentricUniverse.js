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
		const indices = [];
		/**
		 * @description array of edges.
		 * */
		const edges = [];

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

					case 'push': return (verticeEdges) => {

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
				
						const verticeIndex = _vertices.push(new Vertice(value)) - 1;

						//add edge
						if (verticeIndex > 0) {

							edges.push({

								vertices: [verticeIndex, verticeIndex - 1],
								disatance: 1.0,
								
							});
					
						}

					};

				}

				return _vertices[name];

			},

		});

		vertices.push();
		vertices.push();
		vertices.push();
let vertice = vertices[0];
		vertices.forEach((vertice, i) => console.log(vertices));
		
	}

}

export default EgocentricUniverse;

