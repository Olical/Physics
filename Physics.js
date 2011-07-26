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
					steps = (difference.x.abs() >= difference.y.abs()) ? difference.x.abs() : difference.y.abs(),
					increment = {
						x: difference.x / steps,
						y: difference.y / steps
					},
					current = {},
					events = {},
					best = null;
				
				// Loop over steps
				for(i = 1; i <= steps; i += 1) {
					current.x = (from.x + increment.x * i).floor();
					current.y = (from.y + increment.y * i).floor();
					
					// Check current is in bounds
					if(current.x >= 0 && current.y >= 0 && current.x < this.options.width && current.y < this.options.height) {
						// Check point is not occupied
						if(!this.positions[current.x][current.y]) {
							// Set the new best
							best = {
								x: current.x,
								y: current.y
							};
						}
						else {
							// We have hit a particle, ready the collision event and break out
							events.particle = true;
							break;
						}
					}
					else {
						// We have hit the wall, ready the event and break out
						events.wall = true;
						break;
					}
				}
				
				// If there is a best, move to it
				if(best) {
					this.moveParticle(particle, best);
					
					// Fire events
					if(events.particle) {
						this.fireEvent('collision', [particle, this.positions[current.x][current.y]]);
					}
					
					if(events.wall) {
						this.fireEvent('wallCollision', [particle]);
					}
				}
				
				return this;
			}.bind(this);
			
			this.step = function() {
				// Loop over the particles
				this.particles.each(function(particle) {
					// Only do stuff if locked is false
					if(!particle.options.locked) {
						// Apply weight
						if(!particle.options.gas) {
							particle.options.velocity.y += particle.options.weight;
						}
						else {
							particle.options.velocity.y -= particle.options.weight;
						}
						
						// Apply friction
						this.applyFriction(particle, 'x');
						this.applyFriction(particle, 'y');
						
						// Slide the particle
						this.slideParticle(particle, {
							x: (particle.options.position.x + particle.options.velocity.x).floor(),
							y: (particle.options.position.y + particle.options.velocity.y).floor()
						});
					}
				}.bind(this));
				
				// Fire the step event
				this.fireEvent('step', [this.particles]);
				
				return this;
			}.bind(this);
			
			this.addParticle = function(particle, force) {
				// Make sure the point is empty
				if(!this.positions[particle.options.position.x][particle.options.position.y] || force) {
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
			weight: 3,
			gas: false,
			locked: false
		},
		initialize: function(options) {
			// Set the options
			if(options) {
				this.setOptions(options);
			}
		}
	})
};