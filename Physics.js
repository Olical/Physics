/**
 * @preserve Physics MooTools plugin v1.0.0
 * 
 * Oliver Caldwell 2011 (olivercaldwell.co.uk)
 */
var Physics = {
	World: new Class({
		Implements: [Events, Options],
		options: {
			fps: 12,
			width: 500,
			height: 500
		},
		initialize: function(options) {
			// Set the options
			this.setOptions(options);
			
			// Set up the particle array
			this.particles = [];
			
			// Start the loop
			setInterval(this.step, 1000 / fps);
		},
		step: function() {
			
		},
		addParticle: function() {
			
		},
		removeParticle: function() {
			
		}
	}),
	Particle: new Class({
		
	})
}