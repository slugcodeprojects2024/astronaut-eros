// WebGL context and program
let gl;

// Main function that gets called when the page is loaded
function main() {
    // Get the WebGL context
    const canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('Failed to get WebGL context');
        return;
    }
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders');
        return;
    }
    
    // Set the clear color and enable alpha blending for transparency
    gl.clearColor(0.0, 0.0, 0.1, 1.0); // Dark blue background (space)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Initialize UI controls
    initUI();
    
    // Render the scene initially
    renderScene();
    
    // Set up window resize handling
    window.addEventListener('resize', function() {
        // Get the device pixel ratio
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Get the actual canvas size from CSS
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        
        // Check if the canvas is not the same size
        if (canvas.width !== width || canvas.height !== height) {
            // Set the canvas size to match
            canvas.width = width;
            canvas.height = height;
            
            // Update the viewport
            gl.viewport(0, 0, width, height);
            
            // Re-render the scene
            renderScene();
        }
    });
}

// Render the entire scene
function renderScene() {
    // Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Create the global rotation matrix
    const globalRotationMatrix = new Matrix4();
    
    // Apply zoom first (before rotation)
    globalRotationMatrix.scale(g_zoomLevel, g_zoomLevel, g_zoomLevel);
    
    // Then apply rotation
    globalRotationMatrix.rotate(g_GlobalRotationX, 1, 0, 0);
    globalRotationMatrix.rotate(g_GlobalRotationY, 0, 1, 0);

    // Pass the global rotation to the shader
    const u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
    gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotationMatrix.elements);

    // Reset parts counter
    resetPartsCounter();
    
    // Calculate joint angles based on animation or UI sliders
    let angles;
    if (g_AnimationOn || g_isPoked) {
        angles = calculateJointAngles();
        updateUI(angles);
    } else {
        angles = {
            headAngle: g_HeadAngle,
            tailAngle: g_TailAngle,
            leftFrontLegAngle: g_FrontLegAngle,
            rightFrontLegAngle: g_FrontLegAngle,
            leftFrontPawAngle: g_PawAngle,
            rightFrontPawAngle: g_PawAngle,
            leftBackLegAngle: g_FrontLegAngle,
            rightBackLegAngle: g_FrontLegAngle
        };
    }

    // Create base model matrix
    const baseMatrix = new Matrix4();
    baseMatrix.translate(0, 0.5, 0);  // Raise the cat a bit for better visibility

    // Draw the cat body
    const bodyMatrix = drawCatBody(gl, baseMatrix);

    // Draw the cat head
    drawCatHead(gl, bodyMatrix, angles.headAngle);

    // Draw the cat tail
    drawCatTail(gl, bodyMatrix, angles.tailAngle);

    // Draw the front legs
    drawFrontLeg(gl, bodyMatrix, angles.leftFrontLegAngle, angles.leftFrontPawAngle, true);
    drawFrontLeg(gl, bodyMatrix, angles.rightFrontLegAngle, angles.rightFrontPawAngle, false);

    // Draw the back legs
    drawBackLeg(gl, bodyMatrix, angles.leftBackLegAngle, true);
    drawBackLeg(gl, bodyMatrix, angles.rightBackLegAngle, false);

    // Verify that we have drawn at least 8 parts
    const partsCount = getPartsCount();
    console.log(`Rendered ${partsCount} parts`);
}

// Call main when the page loads
window.onload = main;