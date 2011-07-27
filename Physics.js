/**
 * @preserve Physics MooTools plugin v1.0.0
 * 
 * Licenced under GPL v3 (see README.md)
 * Copyright 2011 - Oliver Caldwell (olivercaldwell.co.uk)
 */
var Physics = {
	World: new Class({
		Implements: [Events, Options],
		options: {
			fps: 16, // The amount of frames per second, runs fine even on 24
			width: 500, // The width of the world in particles, not pixels
			height: 500 // The height of the world in particles, not pixels
		},
		initialize: function(options) {
			// Initialise variables
			var x = null,
				y = null;
			
			// Set the options
			if(options) {
				this.setOptions(options);
			}
			
			this.interval = false;
			
			/**
			 * Resets the particles and positions array
			 * 
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
			this.clear = function() {
				// Initialise variables
				var x = null,
					y = null;
				
				// Wipe all the things!
				this.particles = [];
				this.positions = [];
				
				for(x = 0; x < this.options.width; x += 1) {
					for(y = 0; y < this.options.height; y += 1) {
						this.positions[x] = [];
						this.positions[x][y] = false;
					}
				}
				
				return this;
			};
			
			/**
			 * Starts the timed loop that calls each step
			 * Fires the start event when it starts and the alreadyRunning event if its, well, already running
			 * 
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
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
			
			/**
			 * Stops the interval that calls step
			 * Fires the stop event. It will fire the notRunning event if it is not running yet
			 * 
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
			this.stop = function() {
				// Only do this if we have an interval
				if(this.interval !== false) {
					clearInterval(this.interval);
					this.interval = false;
					
					// Fire the stop event
					this.fireEvent('stop');
				}
				else {
					// Not running, fire the notRunning event
					this.fireEvent('notRunning');
				}
				
				return this;
			}.bind(this);
			
			/**
			 * Moves a particle to the specified location, no questions asked
			 * 
			 * @param {Object} particle The particle to move
			 * @param {Object} to The new location object containing the x and y coordinates, I trust this is within the worlds bounds
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
			this.moveParticle = function(particle, to) {
				// Change the positions object value
				this.positions[particle.options.position.x][particle.options.position.y] = false;
				this.positions[to.x][to.y] = particle;
				
				// Change the particles position option
				particle.options.position = to;
				
				return this;
			}.bind(this);
			
			/**
			 * Applies friction to the given particle on the given axis
			 * 
			 * @param {Object} particle The particle to apply friction to
			 * @param {String} axis The name of the axis to apply friction to, either x or y
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
			this.applyFriction = function(particle, axis) {
				// Apply friction
				if(particle.options.velocity[axis] !== 0) {
					particle.options.velocity[axis] -= particle.options.velocity[axis] / particle.options.weight;
				}
				
				// If velocity is tiny, remove it
				if(particle.options.velocity[axis] > -0.01 && particle.options.velocity[axis] < 0.01) {
					particle.options.velocity[axis] = 0;
				}
				
				return this;
			}.bind(this);
			
			/**
			 * Moves a particle to a specified location and performs collisions with other particles and walls
			 * Fires the collision event when it hits another particle, passes the current particle and the one it hit in the arguments
			 * Also fires the wallCollision event, when it hits a wall. It passes the particle in the arguments
			 * 
			 * @param {Object} particle The particle to move
			 * @param {Object} to The new location object containing the x and y coordinates
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
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
					best = null,
					collided = null;
				
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
						collided = this.positions[current.x][current.y];
						
						// Transfer our force onto the collided particle if it is not locked
						if(collided.options.position.x < best.x || collided.options.position.x > best.x) {
							if(!collided.options.locked) {
								collided.options.velocity.x += particle.options.velocity.x;
							}
							
							particle.options.velocity.x = 0;
						}
						
						if(collided.options.position.y < best.y || collided.options.position.y > best.y) {
							if(!collided.options.locked) {
								collided.options.velocity.y += particle.options.velocity.y;
							}
							
							particle.options.velocity.y = 0;
						}
						
						this.fireEvent('collision', [particle, collided]);
					}
					
					if(events.wall) {
						// Because we hit a wall, we need to remove the velocity from the side we hit
						if(best.x === 0 || best.x === this.options.width - 1) {
							particle.options.velocity.x = 0;
						}
						
						if(best.y === 0 || best.y === this.options.height - 1) {
							particle.options.velocity.y = 0;
						}
						
						this.fireEvent('wallCollision', [particle]);
					}
				}
				
				return this;
			}.bind(this);
			
			/**
			 * Performs a step, called by the interval initialised in the start method
			 * Applies velocity equivilent to the weight either up or down depending on it being a gas or not
			 * Then applies friction and then slides to the new location
			 * Fires the step event and passes the particle array along with the event
			 * 
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
			this.step = function() {
				// Initialise variables
				var yOffset = null;
				
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
						
						// Apply side to side velocity to simulate a liquid
						if(particle.options.liquid) {
							yOffset = (particle.options.gas) ? -1 : 1;
							
							// We first check if there is something either above or below
							// Depending on the particle being a gas or not
							if(this.positions[particle.options.position.x] && this.positions[particle.options.position.x][particle.options.position.y + yOffset]) {
								// Theres something there, so apply random x velocity
								particle.options.velocity.x += Number.random(-particle.options.liquidVelocity, particle.options.liquidVelocity);
							}
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
			
			/**
			 * Adds a particle to the world
			 * Fires the addParticle event and passes the new particle
			 * If there is a particle already there, it does not add it and fires the inUse event
			 * The inUse event passes the particle you tried to add and the particle that is in the way
			 * You can overide this by setting the force argument to true
			 * 
			 * @param {Object} particle The new particle to add
			 * @param {Boolean} force If this is true then it will overwrite any existing particles at that point
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
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
			
			/**
			 * Removes the specified particle from the world
			 * Fires the removeParticle event and passes the removed particle
			 * If no such particle exists, it fires the noParticle event and again, passes the particle in question
			 *
			 * @param {Object} particle The particle to remove
			 * @returns {Object} The instance of Physics.World to allow chaining
			 */
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
			
			// Set everything up by calling clear
			this.clear();
			
			// Start the loop
			this.start();
		}
	}),
	Particle: new Class({
		Implements: [Options],
		options: {
			position: {
				x: 0, // The initial x position
				y: 0 // The initial y position
			},
			velocity: {
				x: 0, // The initial velocity on the x axis
				y: 0 // The initial velocity on the y axis
			},
			weight: 3, // The amount of force to apply downwards or upwards depending if the particle is a gas, also influences friction
			gas: false, // Whether to apply weight upwards or not
			liquid: false, // Whether or not the element should move side to side
			liquidVelocity: 50, // The max velocity that can be applied side to side if the particle is a liquid
			locked: false // Whether the particle is like a wall, it can not be moved while locked but still can be collided with
		},
		initialize: function(options) {
			// Set the options
			if(options) {
				this.setOptions(options);
			}
		}
	})
};