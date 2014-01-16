/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

THREEx.addVolumetricSpotlightMaterial2DatGui	= function(material, datGui){
	datGui		= datGui || new dat.GUI()
	var uniforms	= material.uniforms
	
	var options  = {
		anglePower	: uniforms['anglePower'].value,
		attenuation	: uniforms['attenuation'].value,
		lightColor	: '#'+uniforms.lightColor.value.getHexString(),
		x: uniforms['spotPosition'].value.x,
		y: uniforms['spotPosition'].value.y,
		z: uniforms['spotPosition'].value.z,
	}
	var onChange = function(){
		uniforms['anglePower'].value	= options.anglePower
		uniforms['attenuation'].value	= options.attenuation
		uniforms.lightColor.value.set( options.lightColor ); 
		uniforms['spotPosition'].value.x = options.x
		uniforms['spotPosition'].value.y = options.y
		uniforms['spotPosition'].value.z = options.z
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'anglePower', 0, 10)	.listen().onChange( onChange )
	datGui.add( options, 'attenuation', 0, 10)	.listen().onChange( onChange )
	datGui.addColor( options, 'lightColor' )	.listen().onChange( onChange )
	datGui.add( options, 'x', -500, 500)	.listen().onChange( onChange )
	datGui.add( options, 'y', 0, 250)	.listen().onChange( onChange )
	datGui.add( options, 'z', -500, 500)	.listen().onChange( onChange )
}