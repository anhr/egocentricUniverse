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
		let value = settings.count || 4;

		if (debug) {

			if (_indices[1]) {

				console.error(sFaces + sIndicesFacesSet + 'duplicate faces');
				return true;

			}

		}
		if ( !( value instanceof Array ) ){
			
			if (typeof value === "number") {
	
				const faces = [];
				for ( let i = 0; i < value; i++ ) faces.push({});
				value = faces;
				
			} else {
				
				console.error(sFaces + sIndicesFacesSet + 'Invalid faces array: ' + value);
				return true;
				
			}

		}
		function Face2(settings = {}) {

			const sFace = sFaces + ': ' + ( settings.faceId === undefined ? 'Face' : 'faces[' + settings.faceId + ']' );
			settings.face = settings.face || {};

			//Face edges

			settings.face.edges = settings.face.edges || [];
			if (debug) {

				if (settings.face.isProxy) {

					console.error(sFace + '. Duplicate proxy');
					return edge;

				}
				if (settings.face instanceof Array) {

					console.error(sFace + '. Invalid face instance');
					return false;

				}
				if (!(settings.face.edges instanceof Array)) {

					console.error(sFace + '. Invalid face.edges instance: ' + settings.face.edges);
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

				if (edgeId === indices.edges.length) indices.edges.push();

				if (!debug) return true;

				if (!IdDebug(i)) return false;

				if (isNaN(parseInt(edgeId))) {

					console.error(sFace + '[' + i + ']. Invalid edge index = ' + edgeId);
					return false;

				}
				if ((edgeId < 0) || (edgeId >= indices.edges.length)) {

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
		for (let i = 0; i < value.length; i++) {

//			const face = value[i];
//			value[i] = Face({ face: face, faces: value, faceId: i });
			value[i] = new Face( this.scene, this.options, { indices: indices, vertices: vertices, noTest: true } );

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