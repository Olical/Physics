/**
 * @preserve Physics MooTools plugin v1.0.0
 * 
 * Oliver Caldwell 2011 (olivercaldwell.co.uk)
 */
var Physics = {
	World: new Class({
		Implements: [Events, Options],
		options: {
			fps: 16,
			width: 500,
			height: 500
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
				// Update the last posision
				particle.options.last = particle.options.position;
				
				// Change the positions object value
				this.positions[particle.options.position.x][particle.options.position.y] = false;
				this.positions[to.x][to.y] = particle;
				
				// Change the particles position option
				particle.options.position = to;
				
				return this;
			}.bind(this);
			
			this.applyFriction = function(particle, axis) {
				// Apply friction
				if(particle.options.velocity[axis] !== 0) {
					particle.options.velocity[axis] -= particle.options.velocity[axis] / particle.options.weight;
				}
				
				// If velocity is tiny, remove it
				if(particle.options.velocity[axis] > -0.01 && particle.options.velocity[axis] < 0.01) {
					particle.options.velocity[axis] = 0;
				}
			}.bind(this);
			
			this.slideParticle = function(particle, to) {
				// Iniailise variables
				var from = particle.options.position,
					difference = {
						x: to.x - from.x,
						y: to.y - from.y
					},
					steps = (difference.x >= difference.y) ? difference.x : difference.y,
					increment = {
						x: difference.x / steps,
						y: difference.y / steps
					},
					current = {},
					i = null;
				
				// Keep looping back to try and find a sutible gap
				for(i = steps; i > 0; i -= 1) {
					current.x = Math.floor(from.x + increment.x * i);
					current.y = Math.floor(from.y + increment.y * i);
					
					// Check if the point is within the bounds
					if(current.x.limit(0, this.options.width - 1) === current.x && current.y.limit(0, this.options.height - 1) === current.y) {
						// It is, now check if that point is free
						if(!this.positions[current.x][current.y]) {
							// It is, move to the new one and break out
							this.moveParticle(particle, current);
							break;
						}
						else {
							// We have hit something, fire the event
							this.fireEvent('collision', [particle, this.positions[current.x][current.y]]);
						}
					}
					else {
						// We have hit a wall, fire the event
						this.fireEvent('wallCollision', [particle]);
					}
				}
				
				return this;
			}.bind(this);
			
			this.step = function() {
				// Loop over the particles
				this.particles.each(function(particle) {
					// Apply weight
					particle.options.velocity.y += particle.options.weight;
					
					// Apply friction
					this.applyFriction(particle, 'x');
					this.applyFriction(particle, 'y');
					
					// Slide the particle
					this.slideParticle(particle, {
						x: Math.floor(particle.options.position.x + particle.options.velocity.x),
						y: Math.floor(particle.options.position.y + particle.options.velocity.y)
					});
				}.bind(this));
				
				// Fire the step event
				this.fireEvent('step', [this.particles]);
				
				return this;
			}.bind(this);
			
			this.addParticle = function(particle) {
				// Make sure the point is empty
				if(!this.positions[particle.options.position.x][particle.options.position.y]) {
					// Add the particle to the particles array
					this.particles.push(particle);
					
					// Add it into the positions index
					this.positions[particle.options.position.x][particle.options.position.y] = particle;
					
					// Fire the addParticle event
					this.fireEvent('addParticle', [particle]);
				}
				else {
					// Theres something already there
					// Fire the inUse event
					this.fireEvent('inUse', [particle, this.positions[particle.options.position.x][particle.options.position.y]]);
				}
				
				return this;
			}.bind(this);
			
			this.removeParticle = function(particle) {
				// Get the index of the paticle in the particles array
				var index = this.particles.indexOf(particle);
				
				// If it is not -1 then splice it out
				if(index !== -1) {
					this.particles.splice(index, 1);
					this.positions[particle.options.posision.x][particle.options.posision.y] = false;
					
					// Fire the removeParticle event
					this.fireEvent('removeParticle', [particle]);
				}
				else {
					// Fire the noParticle event
					this.fireEvent('noParticle', [particle]);
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
			weight: 3
		},
		initialize: function(options) {
			// Set the options
			if(options) {
				this.setOptions(options);
			}
			
			// Set the last
			this.options.last = this.options.position;
		}
	})
};