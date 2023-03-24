/**
 * @module Edges
 * @description Universe edges
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

class Edges extends EgocentricUniverse {

	//Overridden methods from base class
	
	Test( vertice, str1, strVerticeId ){
		
		if (vertice.edges.length !== 2)
			console.error(str1 + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices( indices, settings, debug ){

		indices.edges = settings.count || 3;
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
		indices.edges.push(
			{
			//vertices: [3,0],
			}
		);//3
		*/
			
//		vertices.test();

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
		
	}
	constructor(scene, options, settings={}) {

//		settings.n = 1;
		super(scene, options, settings);

	}

}

export default Edges;
