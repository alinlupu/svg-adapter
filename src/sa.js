/*
 * Provides methods of adapting existing svgs to  screen / device settings
 */

const SVGAdapter = function() {
	let _SVGEl = null;

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
					console.log( newSVGEl );
					_SVGEl = newSVGEl;	
					break;
				case "string":
					// Get element by id
					_SVGEl = document.getElementById( newSVGEl );
					if( _SVGEl == null ) {
						//TODO: Check if id has # before and remove it if it does
						console.log( "[sa:setCurrentSVG] No element found with id: " + newSVGEl ); 
						return;
					}
					break;
				default:
					console.log( "[sa:setCurrentSVG] Incorrect SVG Element paramater type!" );
			}
		} else {
			console.log( "[sa:setCurrentSVG] SVG Element parameter is undefined!" );
		}
		console.log( "[sa:setCurrentSVG] SVG Element set!" );
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
					console.log( svgElement ) 
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
	
	const _changeViewBox_s = ( newViewBox, svgElement ) => {
		svgElement.setAttribute( "viewBox", newViewBox );	
	}

	const _changeViewBox_o = ( newViewBox, svgElement ) => {
				
	}

}

var sa = new SVGAdapter();
