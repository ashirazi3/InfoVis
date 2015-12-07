if( document.createElement('svg').getAttributeNS ) {

	var //checkbxsCross = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-cross input[type="checkbox"]' ) ),
		//radiobxsFill = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-fill input[type="radio"]' ) ),
		checkbxsCheckmark = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-checkmark input[type="checkbox"]' ) ),
		radiobxsCircle = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-circle input[type="radio"]' ) ),
		//checkbxsBoxfill = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-boxfill input[type="checkbox"]' ) ),
		//radiobxsSwirl = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-swirl input[type="radio"]' ) ),
		//checkbxsDiagonal = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-diagonal input[type="checkbox"]' ) ),
		//checkbxsList = Array.prototype.slice.call( document.querySelectorAll( 'form.ac-list input[type="checkbox"]' ) ),
		pathDefs = {			
			checkmark : ['M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16'],
			
		},
		animDefs = {
			cross : { speed : .2, easing : 'ease-in-out' },
			fill : { speed : .8, easing : 'ease-in-out' },
			checkmark : { speed : .2, easing : 'ease-in-out' },
			circle : { speed : .2, easing : 'ease-in-out' },
			boxfill : { speed : .8, easing : 'ease-in' },
			swirl : { speed : .8, easing : 'ease-in' },
			diagonal : { speed : .2, easing : 'ease-in-out' },
			list : { speed : .3, easing : 'ease-in-out' }
		};

	function createSVGEl( def ) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		if( def ) {
			svg.setAttributeNS( null, 'viewBox', def.viewBox );
			svg.setAttributeNS( null, 'preserveAspectRatio', def.preserveAspectRatio );
		}
		else {
			svg.setAttributeNS( null, 'viewBox', '0 0 100 100' );
		}
		svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
		return svg;
	}

	function controlCheckbox( el, type, svgDef ) {
		var svg = createSVGEl( svgDef );
		el.parentNode.appendChild( svg );
		
		el.addEventListener( 'change', function() {
			if( el.checked ) {
				draw( el, type );
			}
			else {
				reset( el );
			}
		} );
	}

	function controlRadiobox( el, type ) {
		var svg = createSVGEl();
		el.parentNode.appendChild( svg );
		el.addEventListener( 'change', function() {
			resetRadio( el );
			draw( el, type );
		} );
	}

	//checkbxsCross.forEach( function( el, i ) { controlCheckbox( el, 'cross' ); } );
	//radiobxsFill.forEach( function( el, i ) { controlRadiobox( el, 'fill' ); } );
	checkbxsCheckmark.forEach( function( el, i ) { controlCheckbox( el, 'checkmark' ); } );
	//radiobxsCircle.forEach( function( el, i ) { controlRadiobox( el, 'circle' ); } );
	//checkbxsBoxfill.forEach( function( el, i ) { controlCheckbox( el, 'boxfill' ); } );
	//radiobxsSwirl.forEach( function( el, i ) { controlRadiobox( el, 'swirl' ); } );
	//checkbxsDiagonal.forEach( function( el, i ) { controlCheckbox( el, 'diagonal' ); } );
	//checkbxsList.forEach( function( el ) { controlCheckbox( el, 'list', { viewBox : '0 0 300 100', preserveAspectRatio : 'none' } ); } );

	function draw( el, type ) {
		var paths = [], pathDef, 
			animDef,
			svg = el.parentNode.querySelector( 'svg' );

		switch( type ) {
			//case 'cross': pathDef = pathDefs.cross; animDef = animDefs.cross; break;
			//case 'fill': pathDef = pathDefs.fill; animDef = animDefs.fill; break;
			case 'checkmark': pathDef = pathDefs.checkmark; animDef = animDefs.checkmark; break;
			//case 'circle': pathDef = pathDefs.circle; animDef = animDefs.circle; break;
			//case 'boxfill': pathDef = pathDefs.boxfill; animDef = animDefs.boxfill; break;
			//case 'swirl': pathDef = pathDefs.swirl; animDef = animDefs.swirl; break;
			//case 'diagonal': pathDef = pathDefs.diagonal; animDef = animDefs.diagonal; break;
			//case 'list': pathDef = pathDefs.list; animDef = animDefs.list; break;
		};
		
		paths.push( document.createElementNS('http://www.w3.org/2000/svg', 'path' ) );

		if( type === 'cross' || type === 'list' ) {
			paths.push( document.createElementNS('http://www.w3.org/2000/svg', 'path' ) );
		}
		
		for( var i = 0, len = paths.length; i < len; ++i ) {
			var path = paths[i];
			svg.appendChild( path );

			path.setAttributeNS( null, 'd', pathDef[i] );

			var length = path.getTotalLength();
			// Clear any previous transition
			//path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 'none';
			// Set up the starting positions
			path.style.strokeDasharray = length + ' ' + length;
			if( i === 0 ) {
				path.style.strokeDashoffset = Math.floor( length ) - 1;
			}
			else path.style.strokeDashoffset = length;
			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			path.getBoundingClientRect();
			// Define our transition
			path.style.transition = path.style.WebkitTransition = path.style.MozTransition  = 'stroke-dashoffset ' + animDef.speed + 's ' + animDef.easing + ' ' + i * animDef.speed + 's';
			// Go!
			path.style.strokeDashoffset = '0';
		}
	}

	function reset( el ) {
		Array.prototype.slice.call( el.parentNode.querySelectorAll( 'svg > path' ) ).forEach( function( el ) { el.parentNode.removeChild( el ); } );
	}

	function resetRadio( el ) {
		Array.prototype.slice.call( document.querySelectorAll( 'input[type="radio"][name="' + el.getAttribute( 'name' ) + '"]' ) ).forEach( function( el ) { 
			var path = el.parentNode.querySelector( 'svg > path' );
			if( path ) {
				path.parentNode.removeChild( path );
			}
		} );
	}

}