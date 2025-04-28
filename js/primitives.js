// Buffer objects for reuse (performance optimization)
let cubeVertexBuffer = null;
let cubeIndexBuffer = null;
let cylinderVertexBuffer = null;
let cylinderIndexBuffer = null;
let sphereVertexBuffer = null;
let sphereIndexBuffer = null;

// Draw a cube using the provided matrix and color
function drawCube(gl, matrix, color) {
    // Create buffers if they don't exist yet
    if (!cubeVertexBuffer) {
        initCubeBuffers(gl);
    }
    
    // Set the color
    const u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    gl.uniform4fv(u_Color, color);
    
    // Set the model matrix
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    
    // Bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    // Bind index buffer and draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
}

// Initialize the cube buffers
function initCubeBuffers(gl) {
    // Vertex coordinates for a cube
    const vertices = new Float32Array([
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
        // Back face
        -0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5, -0.5, -0.5,
        // Top face
        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,
        // Bottom face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,
        // Right face
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,
         0.5, -0.5,  0.5,
        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
    ]);
    
    // Indices for the cube faces (triangles)
    const indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // back
        8, 9, 10,  8, 10, 11,  // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23  // left
    ]);
    
    // Create and set vertex buffer
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Create and set index buffer
    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
}

// Draw a cylinder using the provided matrix and color
function drawCylinder(gl, matrix, color, numSides = 20) {
    // Create buffers if they don't exist yet
    if (!cylinderVertexBuffer || cylinderNumSides !== numSides) {
        cylinderNumSides = numSides;
        initCylinderBuffers(gl, numSides);
    }
    
    // Set the color
    const u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    gl.uniform4fv(u_Color, color);
    
    // Set the model matrix
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    
    // Bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexBuffer);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    // Bind index buffer and draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cylinderIndicesCount, gl.UNSIGNED_SHORT, 0);
}

// Initialize the cylinder buffers
let cylinderNumSides = 0;
let cylinderIndicesCount = 0;

function initCylinderBuffers(gl, numSides) {
    const vertices = [];
    const indices = [];
    
    // Add top and bottom center points
    vertices.push(0, 0.5, 0);  // Top center (index 0)
    vertices.push(0, -0.5, 0); // Bottom center (index 1)
    
    // Add vertices for the sides
    for (let i = 0; i < numSides; i++) {
        const angle = i * 2 * Math.PI / numSides;
        const x = 0.5 * Math.cos(angle);
        const z = 0.5 * Math.sin(angle);
        
        // Top rim vertex
        vertices.push(x, 0.5, z);
        // Bottom rim vertex
        vertices.push(x, -0.5, z);
    }
    
    // Add indices for top and bottom faces (triangular fan)
    for (let i = 0; i < numSides; i++) {
        // Top face
        indices.push(0, 2 + i*2, 2 + ((i+1) % numSides) * 2);
        
        // Bottom face
        indices.push(1, 3 + i*2, 3 + ((i+1) % numSides) * 2);
    }
    
    // Add indices for the side faces (triangular strip)
    for (let i = 0; i < numSides; i++) {
        const topCurrent = 2 + i * 2;
        const bottomCurrent = 3 + i * 2;
        const topNext = 2 + ((i + 1) % numSides) * 2;
        const bottomNext = 3 + ((i + 1) % numSides) * 2;
        
        indices.push(topCurrent, bottomCurrent, topNext);
        indices.push(bottomCurrent, bottomNext, topNext);
    }
    
    cylinderIndicesCount = indices.length;
    
    // Create and set vertex buffer
    cylinderVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Create and set index buffer
    cylinderIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

// Draw a sphere using the provided matrix and color
function drawSphere(gl, matrix, color, latBands = 20, longBands = 20) {
    // Create buffers if they don't exist yet
    if (!sphereVertexBuffer) {
        initSphereBuffers(gl, latBands, longBands);
    }
    
    // Set the color
    const u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    gl.uniform4fv(u_Color, color);
    
    // Set the model matrix
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    
    // Bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    // Bind index buffer and draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.drawElements(gl.TRIANGLES, sphereIndicesCount, gl.UNSIGNED_SHORT, 0);
}

// Initialize the sphere buffers
let sphereIndicesCount = 0;

function initSphereBuffers(gl, latBands, longBands) {
    const vertices = [];
    const indices = [];
    
    // Generate vertices
    for (let lat = 0; lat <= latBands; lat++) {
        const theta = lat * Math.PI / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        for (let long = 0; long <= longBands; long++) {
            const phi = long * 2 * Math.PI / longBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            
            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            
            vertices.push(0.5 * x, 0.5 * y, 0.5 * z);  // Scale to radius 0.5
        }
    }
    
    // Generate indices
    for (let lat = 0; lat < latBands; lat++) {
        for (let long = 0; long < longBands; long++) {
            const first = lat * (longBands + 1) + long;
            const second = first + longBands + 1;
            
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }
    
    sphereIndicesCount = indices.length;
    
    // Create and set vertex buffer
    sphereVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Create and set index buffer
    sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}