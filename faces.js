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

//import EgocentricUniverse from './egocentricUniverse.js';
//import Face from './edges.js';
import Edges from './edges.js';

//debug

//import Intersections from '../../commonNodeJS/master/intersections/intersections.js';
import FibonacciSphereGeometry from '../../commonNodeJS/master/FibonacciSphere/FibonacciSphereGeometry.js'
import three from '../../commonNodeJS/master/three.js'

const sFaces = 'Faces';
let isFacesIndicesProxy = false;

class Faces extends Edges//EgocentricUniverse
{

	//Overridden methods from base class

	//Project universe into 3D space
	project( scene ){

//		const indices = this.settings.object.geometry.indices, scene = this.scene, options = this.options;

		//remove previous universe
		this.remove( scene );
		
		const THREE = three.THREE;

		this.settings.object.geometry.indices.faces.forEach( face => face.face.project( scene, 3 ) );//Если размерность вселенной задать меньше 3 то исчезнут оси коодинат
		
		if ( this.debug ) {

			const color = "lightgray", opacity = 0.2;
				
			const sphere = new THREE.Mesh( new FibonacciSphereGeometry(),//new THREE.SphereGeometry( 1 ),

				new THREE.MeshLambertMaterial( {
	
					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов
	
				} )
	
			);			
			scene.add( sphere );

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
			
			if (typeof Intersections != 'undefined') new Intersections( sphere, plane );
			
		}

	}
	get verticeEdgesLengthMax() { return 6 }//нельзя добавлять новое ребро если у вершины уже 6 ребер
	Test( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 3)//пирамида
			console.error(sFaces + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices(){

		super.Indices();
		const settings = this.settings,
			position = settings.object.geometry.position;
		const debug = this.debug;
		const sIndicesFacesSet = ': indices.faces set. ';

		if (!isFacesIndicesProxy) {

			settings.object.geometry.indices = new Proxy(settings.object.geometry.indices, {

				get: function (_indices, name) {

					switch (name) {

						case 'count': return _indices.count(sFaces + ': Minimal faces count is ');

					}
					return _indices[name];

				},
/*
				set: function (_indices, name, value) {

					switch (name) {

						case 'edges': _indices[0] = value; return true;

					}
					_indices[name] = value;
					return true;

				},
*/

			});
			isFacesIndicesProxy = true;

		}
		let facesCount = settings.object.geometry.indices.count;//default is triangle
/*
		settings.count = settings.count || 4;//По умолчанию это пирамида с 4 гранями
		settings.faces = settings.faces || settings.count;
*/

/*		
		if (debug) {

			if (settings.object.geometry.indices.faces)
			{

				console.error(sFaces + sIndicesFacesSet + 'duplicate faces');
				return true;

			}

		}
*/  
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
		//for ( let i = settings.faces.length; i < settings.count; i++ ) settings.faces.push({});

		//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
		//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
		//EgocentricUniverse: Face get. Duplicate proxy
		settings.object.geometry.indices.faces.forEach( face => face.face = new Edges( this.options, settings ));
/*		
		settings.object.geometry.indices.faces.forEach( face => face.face = new Edges( this.scene, this.options, {
			indices: settings.object.geometry.indices,
			position: position,
		}));
*/  

		if ( debug ) {
		

		}
		
	}
	/**
	 * 1D universe or universe edges.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 **/
	constructor( options, settings={} ) {

		super( options, settings );

	}

}

export default Faces;
