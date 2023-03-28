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

class Edges extends EgocentricUniverse {

	//Overridden methods from base class

	//Project universe into 3D space
	project( indices, three, scene, options, debug ){

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
		
		//universe length
		let l = 0;
		indices.edges.forEach( edge => { l += edge.distance; } );

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
		const point0 = new THREE.Vector3( 0, -r, 0 ),
			axis = new THREE.Vector3( 0, 0, 1 ),
			points = [
				point0,//0
			];
		let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
		const delta = 2 * Math.PI / l;
		for ( let i = 1; i < indices.edges.length; i++ ) {

			angle += indices.edges[i].distance * delta;
			points.push( new THREE.Vector3().copy( point0 ).applyAxisAngle( axis, angle ) );

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

	}
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 3 ребра
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
	/**
	 * 1D universe or universe edges.
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 **/
	constructor(scene, options, settings={}) {

//		settings.n = 1;
//		this.scene = scene;
		super(scene, options, settings);

	}

}

export default Edges;
