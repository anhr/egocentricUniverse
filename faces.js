/**
 * @module Faces
 * @description 2D universe or universe faces.
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
import Face from './edges.js';

//debug

//import Intersections from '../../commonNodeJS/master/intersections/intersections.js';
import FibonacciSphereGeometry from '../../commonNodeJS/master/FibonacciSphere/FibonacciSphereGeometry.js'

class Faces extends EgocentricUniverse {

	//Overridden methods from base class
	
	get( name ) {
		
		switch (name) {

			case 'faces2': return this.settings.indices._indices[1];
			default: console.error(sEgocentricUniverse + ': indices get: invalid name: ' + name);
			
		}
		
	}
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

			const color = "lightgray",
//				intersectColor = 'yellow',
//				intersectMeshList = [],
				opacity = 0.2;
				
			const sphere = new THREE.Mesh( new FibonacciSphereGeometry(),//new THREE.SphereGeometry( 1 ),

				new THREE.MeshLambertMaterial( {
	
					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов
	
				} )
	
			);			
			scene.add( sphere );
/*			
			intersectMeshList.push( {
				
				mesh: sphere,
				color: intersectColor
				
			} );
*/   

			const plane = new THREE.Mesh( new THREE.PlaneGeometry( 2.0, 2.0 ),

				new THREE.MeshLambertMaterial( {

					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

				} )

			);
			scene.add( plane );
//			plane.name = name;
/*			
			intersectMeshList.push( {
				
				mesh: plane,
				color: intersectColor
				
			} );
*/   
			
			if (typeof Intersections != 'undefined') new Intersections( sphere, plane );//intersectMeshList );
			
		}
const faces = indices.faces,//[1]
	face = faces[0];
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
	get verticeEdgesLengthMax() { return 6 }//нельзя добавлть новое ребро если у вершины уже 6 ребер
	Test( vertice, str1, strVerticeId ){
		
		if (vertice.edges.length !== 3)//пирамида
			console.error(str1 + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices( indices, settings, vertices, debug ){

		const sFaces = 'Faces', sIndicesFacesSet = ': indices.faces set. ',
			_indices = indices._indices;
		settings.count = settings.count || 4;//По умолчанию это пирамида с 4 гранями
//		let value = settings.count || 4;//По умолчанию это пирамида с 4 гранями
		settings.faces = settings.faces || settings.count;

		if (debug) {

			if (_indices[1]) {

				console.error(sFaces + sIndicesFacesSet + 'duplicate faces');
				return true;

			}

		}
		if ( !( settings.faces instanceof Array ) ){
			
			if (typeof settings.faces === "number") {
	
				const faces = [];
				for ( let i = 0; i < settings.faces; i++ ) faces.push({});
				settings.faces = faces;
				
			} else {
				
				console.error(sFaces + sIndicesFacesSet + 'Invalid faces array: ' + value);
				return true;
				
			}

		}

		//у пирамиды граней не должно быть меньше 4
		for ( let i = settings.faces.length; i < settings.count; i++ ) settings.faces.push({});

		//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
		//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
		//EgocentricUniverse: Face get. Duplicate proxy
//settings.faces[0] = new Face( this.scene, this.options, { indices: indices, vertices: vertices, noTest: true } );
//settings.faces[1] = new Face( this.scene, this.options, { indices: indices, vertices: vertices, noTest: true } );
		for (let i = 0; i < settings.faces.length; i++) {

			const face = settings.faces[i];
			face.edges = face.edges || [];
			face.edges.forEach( edgeId => {

				if (edgeId < indices.edges.length) face.edges[edgeId] = indices.edges[edgeId];
				
			} )
//			settings.faces[i] = Face({ face: face, faces: settings.faces, faceId: i });
//			settings.faces[i] = new Face( this.scene, this.options, { indices: indices, vertices: vertices, noTest: true, edges: settings.faces[i].edges } );
			settings.faces[i] = new Face( this.scene, this.options, {
				indices: indices,
				vertices: vertices,
				noTest: true,
				edges: settings.faces[i].edges
			} );

		}
		_indices[1] = new Proxy(settings.faces, {

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

		indices.edges = [//приамида

			{
				vertices: [0, 1],
				//distance: 1.0,//0.5,
			},//0
			{
				vertices: [1, 2]
			},//1
			{
				vertices: [2, 0]
				//vertices: [2,3]
			},//2
			{
				vertices: [0, 3]
			},//3
			{
				vertices: [1, 3]
			},//4
			{
				vertices: [2, 3]
			},//5

		];
		//indices.faces = settings.count || 4;//у пирамиды 4 грани
		indices.faces = [

			{
				edges: [0, 1, 2],
			},//0

		];
		if ( debug ) {
		

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
		super(scene, options, settings);

	}

}

export default Faces;
