/*
 * Provides methods of adapting existing svgs to  screen / device settings
 */

const SVGAdapter = function() {
	let _SVGEl = null;
	let _vb = null;
	let _vb_limits = null;

	this.getSVG = ( ) => {
		if( _SVGEl != null ) {
			return _SVGEl;	
		}
	}

	this.setSVG = ( newSVGEl ) => {
		let t = typeof newSVGEl;
		if( t != "undefined" ) {
			switch( t ) {
				case "object":
					// Check if element is a SVG container
					_SVGEl = newSVGEl;	
					break;
				case "string":
					// Get element by id
					_SVGEl = document.getElementById( newSVGEl );
					if( _SVGEl == null ) {
						//TODO: Check if id has # before and remove it if it does
						console.log( "[sa:setSVG] No element found with id: " + newSVGEl ); 
						return;
					}
					break;
				default:
					console.log( "[sa:setSVG] Incorrect SVG Element paramater type!" );
			}
		} else {
			console.log( "[sa:setSVG] SVG Element parameter is undefined!" );
		}
		console.log( "[sa:setSVG] SVG Element set!" );
	}

	this.setViewBoxLimits = ( vbLimits ) => {
		if( typeof( vbLimits ) == "object" ) { 
			[ 'w', 'h', 'x', 'y'].forEach( ( p ) => { 
				if( p in vbObj == false ) {
					console.log( "[ sa:setViewBoxLimits ] Incorrect vb limits parameter properties!" );
				}
			});
			_vb_limits = vbLimits;
		} else if( typeof( vbLimits ) == "string" ) {
			_vb_limits = _vb_string_to_obj( vbLimits );
		} else {
			console.log( "[ sa:setViewBoxLimits ] Incorrect vb limits parameter type" );
		};
	}
	
	this.setViewBox = ( newViewBox, svgElement ) => {
		let svgEl;
		// Check for global svg element's existence
		if( _SVGEl != null ) {
			svgEl = _SVGEl;
		}
		
		// Check for svg element parameter's type
		let t = typeof svgElement;
		if( t != "undefined" ) {
			switch( t ) {
				case "string":
					let el = document.getElementById( svgElement );
					if( el == null ) {
						//TODO: Check if id has # before and remove it if it does
						console.log( "[sa:setViewBox] No element found with id: " + svgElement ); 
						return;
					}
					svgElement = el;
					break;
				case "object":
					break;
				default:
					console.log( "[sa:setViewBox] Incorrect SVG Element parameter type!" );
			}
			// TODO: check if svgElement is SVG Container
			// svgEl = svgElement;
		}

		if( typeof svgEl == "undefined" || svgEl == null ) {
			console.log( "[sa:setViewBox] No svg element to apply the new viewBox!" );
			return; // If no global or parameter svg element existent, return 
		} else {
			// Check for viewbox parameter existence and type
			t = typeof newViewBox;
			if( t == "undefined" ) {
				console.log("[sa:setViewBox] ViewBox parameter is undefined!" );
				return; // If no viewbox parameter existent, return
			} else {
				switch( t ) {
					case "string":
						// If the viewbox parameter is a string
						_changeViewBox_s( newViewBox, svgEl );
						break;
					case "object":
						// If the viewbox parameter is an object
						_changeViewBox_o( newViewBox, svgEl );
						break;
					default:
						console.log("[sa:setViewBox] Incorrect viewBox parameter type!" );
				}
			}
		}
		console.log( "[sa:setViewBox] New viewBox set!" );
	}

	this.scale = ( size, fixedPoint ) => {
		let _scaleW, _scaleH = 0;
		// Check parameters
		if( typeof( size ) == "number" ) {
			_scaleW = _scaleH = size;
		} else if( typeof( size ) == "object"
			&& "w" in size 
			&& "h" in size ) {
			_scaleW = size.w;
			_scaleH = size.h;
		} else {
			console.log( "[ sa:scale ] Incorrect size parameter type!" );
		}
			// Optional parameter
		fixedPoint = this.domToSVGCoords( fixedPoint );
		fixedPoint = fixedPoint || { x: _vb.x + _vb.w / 2, y: _vb.y + _vb.h / 2 };
	
		// Scale viewbox width and height accordingly
		_vb.w = 1/_scaleW * _vb.w;
		_vb.h = 1/_scaleH * _vb.h;
				

		// Set inferior scale limit
		let _scaleEps = 20; // TODO: set this limit through a method
		if( _vb.w <= _scaleEps || _vb.h <= _scaleEps ) {
			_vb.w = _vb.w * _scaleW;
			_vb.h = _vb.h * _scaleH;
		} else {
			// Translate location if > than inferior limit
			this.translate({ 
				x: -( _scaleW - 1 ) * Math.abs( fixedPoint.x - _vb.x ) / _scaleW,
				y: -( _scaleH - 1 ) * Math.abs( fixedPoint.y - _vb.y ) / _scaleH 
			});
						// Set superior scale limit
			if( _vb.w >= _vb_limits.w  
				|| _vb.h >= _vb_limits.h ) {
				_vb.x = _vb_limits.x;
				_vb.y = _vb_limits.y;
				_vb.h = _vb_limits.h;
				_vb.w = _vb_limits.w;
			}
			// Apply new viewbox object
			_changeViewBox_o();	
		}
	}

	this.translate = ( position ) => {
		let _posX, _posY = 0;
		// Check parameters
		if( typeof( position ) == "number" ) {
			_posX = _posY = -position;
		}
		else if( typeof( position ) == "object"
			&& "x" in position 
			&& "y" in position ) {
			_posX = -position.x;
			_posY = -position.y;
		} else {
			console.log( "[ sa:translate ] Incorrect position parameter type!" );
		}
	
		// Change x, y, viewbox objec accordingly
		_vb.x = _vb.x + _posX;
		_vb.y = _vb.y + _posY;

		// Apply new viewbox object
		_changeViewBox_o();
	}

	this.svgToDOMCoords = ( coords ) => {
		console.log( "sad panda" );
	}
	
	this.domToSVGCoords = ( domCoords ) => {
		let _point = _SVGEl.createSVGPoint();
		// Check parameters
		if( typeof( domCoords ) == "number" ) {
			_point.x = _point.y = domCoords;
		}
		else if( typeof( domCoords ) == "object"
			&& "x" in domCoords 
			&& "y" in domCoords ) {
			_point.x = domCoords.x;
			_point.y = domCoords.y;
		} else {
			console.log( "[ sa:domToSVGCoords ] Incorrect domCoords parameter type!" );
			return;
		}

		// Get svg coordinates
		let _svgCoords = _point.matrixTransform( _SVGEl.getScreenCTM().inverse() );
		return _svgCoords;
	}

	const _vb_obj_to_string = ( vbObj ) => {
		if( typeof( vbObj ) != "object" ) return -2; // Bad parameter
		[ 'w', 'h', 'x', 'y'].forEach( ( p ) => { 
			if( p in vbObj == false ) return -2;
		});
		return `${ vbObj.x } ${ vbObj.y } ${ vbObj.w } ${ vbObj.h }`
	}

	const _vb_string_to_obj = ( vbStr ) => {
		if( typeof( vbStr ) != "string" ) return -2; // Bad parameter
		let _vbProps = vbStr.split( " " );
		if( _vbProps.length != 4 ) return -2;
		return {
			x: parseInt( _vbProps[0] ),
			y: parseInt( _vbProps[1] ),
			w: parseInt( _vbProps[2] ),
			h: parseInt( _vbProps[3] )
		};
	}

	const _changeViewBox_s = ( newViewBox, svgElement ) => {
		svgElement = svgElement || svgEl;
		let tn = svgElement.tagName.toLowerCase();
		if( tn === "svg" ) {
			_vb = _vb_string_to_obj( newViewBox );
			svgElement.setAttribute( "viewBox", newViewBox );	
		} else if( tn === "img" ) {
			let s = svgElement.getAttribute( "src" ).split( "#" )[0];
			svgElement.src = s + "#svgView(viewBox(" + newViewBox + "))"; 
		}
	}

	const _changeViewBox_o = ( newViewBox, svgElement ) => {
		_vb = newViewBox || _vb;
		svgElement = svgElement || _SVGEl;
		let _vbStr = _vb_obj_to_string( _vb );
		svgElement.setAttribute( "viewBox", _vbStr );
	}
}

var sa = new SVGAdapter();
