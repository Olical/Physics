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
			// Initialise variables
			var x = null,
				y = null;
			
			// Set the options
			this.setOptions(options);
			
			// Set up the storage arrays
			this.particles = [];
			this.positions = [];
			
			for(x = 0; x < options.width; x += 1) {
				for(y = 0; y < options.height; y += 1) {
					this.positions[x] = [];
					this.positions[x][y] = false;
				}
			}
			
			// Start the loop
			setInterval(this.step, 1000 / fps);
		},
		step: function() {
			// Loop over the particles
			this.particles.each(function(particle) {
				
			});
		},
		addParticle: function(particle) {
			// Add the particle to the particles array
			this.particles.push(particle);
			
			// Add it into the positions index
			this.positions[particle.position.x][particle.position.y] = particle;
		},
		removeParticle: function(paticle) {
			// Get the index of the paticle in the particles array
			var index = this.particles.indexOf(particle);
			
			// If it is not -1 then splice it out
			if(index !== -1) {
				this.particles.splice(index, 1);
			}
		}
	}),
	Particle: new Class({
		Implements: [Events, Options],
		options: {
			position: {
				x: 0,
				y: 0
			},
			force: {
				x: 0,
				y: 0
			}
		},
		initialize: function(options) {
			// Set the options
			this.setOptions(options);
			
			// Set up the properties
			this.position = {
				x: options.position.x,
				y: options.position.y
			};
			
			this.force = {
				x: options.force.x,
				y: options.force.y
			};
		}
	})
};