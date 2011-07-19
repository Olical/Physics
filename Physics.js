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
		particles: [],
		positions: [],
		interval: false,
		initialize: function(options) {
			// Initialise variables
			var x = null,
				y = null;
			
			// Set the options
			this.setOptions(options);
			
			for(x = 0; x < options.width; x += 1) {
				for(y = 0; y < options.height; y += 1) {
					this.positions[x] = [];
					this.positions[x][y] = false;
				}
			}
			
			// Start the loop
			this.start();
		},
		start: function() {
			if(this.interval === false) {
				this.interval = setInterval(this.step, 1000 / this.options.fps);
				
				// Fire the start event
				this.fireEvent('start');
			}
			else {
				// Fire the alreadyRunning event
				this.fireEvent('alreadyRunning');
			}
		},
		stop: function() {
			clearInterval(this.interval);
			this.interval = false;
			
			// Fire the stop event
			this.fireEvent('stop');
		},
		step: function() {
			// Loop over the particles
			this.particles.each(function(particle) {
				// Initialise variables
				var moved = {},
					toAdd = {};
				
				/**
				 * Calculates the x and y for the toAdd object
				 * 
				 * @param {String} axis The axis to calculate
				 */
				function calculateToAdd(axis) {
					if(moved[axis] > particle.options.position[axis]) {
						toAdd[axis] = 1;
					}
					else {
						toAdd[axis] = -1;
					}
				}
				
				// Apply weight to velocity on the y axis
				particle.options.velocity.y += particle.options.weight;
				
				// Get the new values
				moved.x = Math.floor(particle.options.position.x + particle.options.velocity.x);
				moved.y = Math.floor(particle.options.position.y + particle.options.velocity.y);
				
				// Calculate toAdd
				calculateToAdd('x');
				calculateToAdd('y');
			});
		},
		addParticle: function(particle) {
			// Add the particle to the particles array
			this.particles.push(particle);
			
			// Add it into the positions index
			this.positions[particle.options.position.x][particle.options.position.y] = particle;
			
			// Fire the addParticle event
			this.fireEvent('addParticle');
		},
		removeParticle: function(paticle) {
			// Get the index of the paticle in the particles array
			var index = this.particles.indexOf(particle);
			
			// If it is not -1 then splice it out
			if(index !== -1) {
				this.particles.splice(index, 1);
				
				// Fire the removeParticle event
				this.fireEvent('addParticle');
			}
			else {
				// Fire the noParticle event
				this.fireEvent('noParticle');
			}
		}
	}),
	Particle: new Class({
		Implements: [Options],
		options: {
			position: {
				x: 0,
				y: 0
			},
			velocity: {
				x: 0,
				y: 0
			},
			weight: 4
		},
		initialize: function(options) {
			// Set the options
			this.setOptions(options);
		}
	})
};