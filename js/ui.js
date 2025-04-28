// Global variables for UI interaction
let g_GlobalRotationX = 0;
let g_GlobalRotationY = 180; // Start with cat facing camera
let g_HeadAngle = 0;
let g_TailAngle = 0;
let g_FrontLegAngle = 0;
let g_PawAngle = 0;
let g_zoomLevel = 1.0; // Add zoom level variable

// Mouse interaction variables
let g_isDragging = false;
let g_lastMouseX = 0;
let g_lastMouseY = 0;

// Zoom constants
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.1;

// Initialize UI controls
function initUI() {
    // Global rotation slider
    document.getElementById('global-rotation').addEventListener('input', function() {
        g_GlobalRotationY = parseFloat(this.value);
        renderScene();
    });
    
    // Head angle slider
    document.getElementById('head-angle').addEventListener('input', function() {
        g_HeadAngle = parseFloat(this.value);
        renderScene();
    });
    
    // Tail angle slider
    document.getElementById('tail-angle').addEventListener('input', function() {
        g_TailAngle = parseFloat(this.value);
        renderScene();
    });
    
    // Front leg angle slider
    document.getElementById('front-leg-angle').addEventListener('input', function() {
        g_FrontLegAngle = parseFloat(this.value);
        renderScene();
    });
    
    // Paw angle slider
    document.getElementById('paw-angle').addEventListener('input', function() {
        g_PawAngle = parseFloat(this.value);
        renderScene();
    });
    
    // Animation toggle button
    document.getElementById('toggle-animation').addEventListener('click', function() {
        if (g_AnimationOn) {
            stopAnimation();
            this.textContent = 'Start Animation';
        } else {
            startAnimation();
            this.textContent = 'Stop Animation';
        }
    });
    
    document.getElementById('zoom-level').addEventListener('input', function() {
        g_zoomLevel = parseFloat(this.value);
        renderScene();
    });
    
    // Mouse events for rotation
    const canvas = document.getElementById('webgl');
    
    canvas.addEventListener('mousedown', function(ev) {
        g_isDragging = true;
        g_lastMouseX = ev.clientX;
        g_lastMouseY = ev.clientY;
    });
    
    document.addEventListener('mouseup', function(ev) {
        g_isDragging = false;
    });
    
    document.addEventListener('mousemove', function(ev) {
        if (!g_isDragging) return;
        
        const newX = ev.clientX;
        const newY = ev.clientY;
        
        const deltaX = newX - g_lastMouseX;
        const deltaY = newY - g_lastMouseY;
        
        g_lastMouseX = newX;
        g_lastMouseY = newY;
        
        g_GlobalRotationY += deltaX * 0.5;
        g_GlobalRotationX += deltaY * 0.5;
        
        // Update the rotation slider to reflect the current Y rotation
        document.getElementById('global-rotation').value = g_GlobalRotationY % 360;
        
        renderScene();
    });
    
    // Add mouse wheel zoom
    canvas.addEventListener('wheel', function(ev) {
        ev.preventDefault(); // Prevent page scrolling
        
        if (ev.deltaY < 0) {
            // Zoom in
            g_zoomLevel = Math.min(MAX_ZOOM, g_zoomLevel + ZOOM_STEP);
        } else {
            // Zoom out
            g_zoomLevel = Math.max(MIN_ZOOM, g_zoomLevel - ZOOM_STEP);
        }
        
        // Update zoom slider
        document.getElementById('zoom-level').value = g_zoomLevel;
        
        renderScene();
    });
    
    // Shift+Click for poke animation
    canvas.addEventListener('click', function(ev) {
        if (ev.shiftKey) {
            triggerPokeAnimation();
        }
    });
}

// Update UI to reflect current animation state
function updateUI(angles) {
    // Only update sliders if not being dragged
    const headSlider = document.getElementById('head-angle');
    if (!headSlider.matches(':active')) {
        headSlider.value = angles.headAngle;
    }
    
    const tailSlider = document.getElementById('tail-angle');
    if (!tailSlider.matches(':active')) {
        tailSlider.value = angles.tailAngle;
    }
    
    const legSlider = document.getElementById('front-leg-angle');
    if (!legSlider.matches(':active')) {
        legSlider.value = angles.leftFrontLegAngle;
    }
    
    const pawSlider = document.getElementById('paw-angle');
    if (!pawSlider.matches(':active')) {
        pawSlider.value = angles.leftFrontPawAngle;
    }
    
    // Update zoom slider if not being actively changed
    const zoomSlider = document.getElementById('zoom-level');
    if (zoomSlider && !zoomSlider.matches(':active')) {
        zoomSlider.value = g_zoomLevel;
    }
}