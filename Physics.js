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
			height: 500,
			size: 1
		},
		initialize: function(options) {
			// Initialise variables
			var x = null,
				y = null;
			
			// Set the options
			if(options) {
				this.setOptions(options);
			}
			
			this.particles = [];
			this.positions = [];
			this.interval = false;
			
			for(x = 0; x < this.options.width; x += 1) {
				for(y = 0; y < this.options.height; y += 1) {
					this.positions[x] = [];
					this.positions[x][y] = false;
				}
			}
			
			this.start = function() {
				if(this.interval === false) {
					this.interval = setInterval(this.step, 1000 / this.options.fps);
					
					// Fire the start event
					this.fireEvent('start');
				}
				else {
					// Fire the alreadyRunning event
					this.fireEvent('alreadyRunning');
				}
				
				return this;
			}.bind(this);
			
			this.stop = function() {
				clearInterval(this.interval);
				this.interval = false;
				
				// Fire the stop event
				this.fireEvent('stop');
				
				return this;
			}.bind(this);
			
			this.moveParticle = function(particle, to) {
				// Change the positions object value
				this.positions[particle.options.position.x][particle.options.position.y] = false;
				this.positions[to.x][to.y] = particle;
				
				// Change the particles position option
				particle.options.position = to;
				
				return this;
			}.bind(this);
			
			this.applyFriction = function(particle, axis) {
				// Apply friction
				if(particle.options.velocity[axis] > 0 || particle.options.velocity[axis] < 0) {
					particle.options.velocity[axis] -= particle.options.velocity[axis] / particle.options.weight;
				}
				
				// If velocity is tiny, remove it
				if(particle.options.velocity[axis] > -0.01 && particle.options.velocity[axis] < 0.01) {
					particle.options.velocity[axis] = 0;
				}
			}.bind(this);
			
			this.step = function() {
				// Loop over the particles
				this.particles.each(function(particle) {
					// Apply weight
					particle.options.velocity.y += particle.options.weight;
					
					// Apply friction
					this.applyFriction(particle, 'x');
					this.applyFriction(particle, 'y');
				}.bind(this));
				
				// Fire the step event
				this.fireEvent('step', [this.particles]);
				
				return this;
			}.bind(this);
			
			this.addParticle = function(particle) {
				// Add the particle to the particles array
				this.particles.push(particle);
				
				// Add it into the positions index
				this.positions[particle.options.position.x][particle.options.position.y] = particle;
				
				// Fire the addParticle event
				this.fireEvent('addParticle');
				
				return this;
			}.bind(this);
			
			this.removeParticle = function(paticle) {
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
				
				return this;
			}.bind(this);
			
			// Start the loop
			this.start();
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
			if(options) {
				this.setOptions(options);
			}
		}
	})
};