// Define shader programs
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotation;
    void main() {
        gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
    }`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_Color;
    void main() {
        gl_FragColor = u_Color;
    }`;

// Function to initialize shaders
function initShaders(gl, vshader, fshader) {
    const program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.error('Failed to create program');
        return false;
    }
    gl.useProgram(program);
    gl.program = program;
    return true;
}

// Create GPU program from shaders
function createProgram(gl, vshader, fshader) {
    // Create shader objects
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) return null;

    // Create program object
    const program = gl.createProgram();
    if (!program) return null;

    // Attach shaders to the program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program
    gl.linkProgram(program);

    // Check the result of linking
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const error = gl.getProgramInfoLog(program);
        console.error('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

// Create shader object
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Unable to create shader');
        return null;
    }

    // Set the shader source code
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}