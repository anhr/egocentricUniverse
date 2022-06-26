/**
 * @module FermatSpiral
 * @description Implementation of Vogel's model of [Fermat's spiral]{@link https://en.wikipedia.org/wiki/Fermat's_spiral}.
 * Thanks to [Fermat_Spiral_Vogel_Model]{@link https://github.com/ceme/Fermat_Spiral_Vogel_Model}
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

import three from '../../commonNodeJS/master/three.js'

class FermatSpiral {

	/**
	 * Implementation of Vogel's model of <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a>.
	 * @param {Object} [settings={}] The following settings are available
	 * @param {Number} [settings.count=500] vertices count.
	 * @param {Float} [settings.c=0.01] constant scaling factor.
	 * @param {Array} [settings.center=[0,0]] center of Vogel's model.
	 * @param {Number} [settings.center[0]] x position of the center.
	 * @param {Number} [settings.center[1]] y position of the center.
	 * @returns An array of Vogel model vertices. Each array element represents a 2D vertex position.
	 */
	constructor( settings = {} ) {

		const vertices = [], indices = [];
		Object.defineProperties( this, {

			vertices: {

				get: function () { return vertices; }

			},

			indices: {

				get: function () {
			
					if ( indices.length > 0 ) return indices;
					vertices.forEach( ( vertice1, i ) => {

						const edges = [];//индексы четырех вершин, которые ближе всего расположены к текущей вершине
						edges.push( i );
						vertices.forEach( ( vertice2, j ) => {

							if ( i != j ) {
								
								const distance = vertice1.distanceTo( vertice2 );
								if ( edges.length < 5 ) edges.push( j );
								else edges.forEach( ( index, k ) => {

									if ( k != 0 ) {

										console.log( 'qqq' );
										
									}
									
								} );

							}
							
						} )
						indices.push( edges );
						
					} )
					return indices;
			
				}

			},

		} );
		const c = settings.c === undefined ? 0.03 : settings.c,//constant scaling factor
			center = settings.center || [0,0],
			golden_angle = 137.508;//140.2554;
		function angleFermat( n ) { return n * golden_angle; }
		function radiusFermat( n ) { return c * Math.sqrt( n ); }
		function describeFermatPoint( n ) { return polarToCartesian( radiusFermat( n ), angleFermat( n ) ); }
		function createFermatPlot() {

//			const set = [],
			const l = settings.count === undefined ? 500 : settings.count;
			for ( var i = 0; i <= l; i++ ) {

//				set[i] = describeFermatPoint( i );
				vertices[i] = describeFermatPoint( i );

			}
//			return set;

		}
		function polarToCartesian( radius, angleInDegrees ) {

			const angleInRadians = ( angleInDegrees - 90 ) * Math.PI / 180.0;

			return new three.THREE.Vector3(
				
				center[0] + ( radius * Math.cos( angleInRadians ) ),
				center[1] + ( radius * Math.sin( angleInRadians ) )
				
			);
/*			
			return [

				center[0] + ( radius * Math.cos( angleInRadians ) ),
				center[1] + ( radius * Math.sin( angleInRadians ) )

			];
*/
/*			
			return {

				x: centerX + ( radius * Math.cos( angleInRadians ) ),
				y: centerY + ( radius * Math.sin( angleInRadians ) )

			};
*/			
			
		}
		return createFermatPlot();

	}
}
export default FermatSpiral;

