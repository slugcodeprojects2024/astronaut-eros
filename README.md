# Astronaut Cat in Space - WebGL 3D Model

This project implements a 3D model of an astronaut cat getting into its spaceship, created with WebGL.

## Features

- 3D model built with cubes, cylinders, and spheres
- Hierarchical model structure with proper joint transformations
- Interactive controls with sliders for joint manipulation
- Mouse control for model rotation
- Animated sequence of the cat walking to and entering the spaceship
- Special "poke" animation when shift-clicking
- Performance optimization with buffer reuse and FPS counter

## Controls

- Use the sliders to control different parts of the cat
- Drag with the mouse to rotate the scene
- Click the "Start Animation" button to see the cat walk to the spaceship
- Hold Shift and click to trigger a special reaction animation

## Implementation Details

- The model consists of at least 8 distinct parts
- Multiple joint hierarchies with proper parent-child relationships
- Matrix transformations for positioning and orienting parts
- Depth testing for proper 3D rendering
- Transparent elements (helmet, ship window) with alpha blending

## Performance Considerations

- Buffer objects are created once and reused for better performance
- Separate render pass for transparent objects
- Frame rate is displayed and maintained above 10 FPS

## File Structure

- index.html: Main HTML file with canvas and UI controls
- css/styles.css: Styling for the UI and canvas
- js/main.js: Main program and initialization
- js/matrix.js: Matrix operations for transformations
- js/shaders.js: Vertex and fragment shader code
- js/primitives.js: Drawing functions for basic shapes
- js/model.js: Model definition and hierarchy
- js/animation.js: Animation logic and state machine
- js/ui.js: User interface interaction handlers