# About

This is a particle physics engine built in JavaScript using MooTools.

It can handle thousands of particles at once, each with their own velocity and attributes.

Because of the use of events, you can hook in at any point and use the engine as you see fit.

It uses pixel perfect collision, so nothing will pop through anything else even if it is traveling faster than light.

[Here is a demo on jsFiddle.](http://jsfiddle.net/Wolfy87/EqM6v/)

Heres a little feature list to sum things up.

 * Handling of thousands of particles
 * Configurable world size and FPS
 * Implements velocity and friction based on weight which coincidentally adds terminal velocity
 * Event based so you can hook into the functionality easily
 * Uses [MooTools](http://mootools.net/) for a few methods, events and classes
 * Particles pass on velocity as they hit each other
 * Particles lose all velocity on the appropriate axis when they hit a wall

For documentation please check the source. I have included a jsDoc comment block for every method detailing the arguments, return values and events.

All events are emitted by the Physics.World class. Not each individual method.

You can also open up `test.html` and see whats going on there.

# Author

Written by [Oliver Caldwell](http://olivercaldwell.co.uk/).

# Licence

**GPL v3**

Copyright (C) 2011 Oliver Caldwell

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.