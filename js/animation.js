// Animation parameters and state
let g_AnimationOn = false;
let g_LastTime = Date.now();
let g_LastFPSUpdateTime = Date.now();
let g_FrameCount = 0;
let g_FPS = 0;
let g_isPoked = false;
let g_pokeStartTime = 0;
let g_pokeDuration = 1000; // 1 second poke animation

// Cat animation state
let g_walkPhase = 0.0;

// Constants for animation
const LEG_SWING_SPEED = 3.0;    // Cycles per second
const MAX_LEG_ANGLE = 30;       // Maximum leg angle in degrees
const MAX_PAW_ANGLE = 15;       // Maximum paw angle in degrees
const TAIL_WAG_SPEED = 2.0;     // Cycles per second
const TAIL_WAG_ANGLE = 20;      // Maximum tail angle in degrees

// Update animation parameters based on elapsed time
function updateAnimation(elapsed) {
    // Update walking phase
    g_walkPhase += elapsed * 0.001 * LEG_SWING_SPEED;
    
    // Handle poke animation if active
    if (g_isPoked) {
        const pokeElapsed = Date.now() - g_pokeStartTime;
        
        if (pokeElapsed >= g_pokeDuration) {
            g_isPoked = false;
        }
    }
}

// Calculate joint angles based on current animation state
function calculateJointAngles() {
    const angles = {
        headAngle: 0,
        tailAngle: 0,
        leftFrontLegAngle: 0,
        rightFrontLegAngle: 0,
        leftFrontPawAngle: 0,
        rightFrontPawAngle: 0,
        leftBackLegAngle: 0,
        rightBackLegAngle: 0
    };
    
    // Poke animation overrides other animations
    if (g_isPoked) {
        const pokeElapsed = Date.now() - g_pokeStartTime;
        const pokeProgress = pokeElapsed / g_pokeDuration;
        const pokePhase = Math.sin(pokeProgress * Math.PI * 4);
        
        // Surprised reaction
        angles.headAngle = 10 * pokePhase;
        angles.tailAngle = 60 + 20 * pokePhase;
        angles.leftFrontLegAngle = 20 * pokePhase;
        angles.rightFrontLegAngle = -20 * pokePhase;
        angles.leftFrontPawAngle = 30 * pokePhase;
        angles.rightFrontPawAngle = 30 * pokePhase;
        angles.leftBackLegAngle = -10 * pokePhase;
        angles.rightBackLegAngle = 10 * pokePhase;
        
        return angles;
    }
    
    // Regular walking animation
    if (g_AnimationOn) {
        angles.leftFrontLegAngle = MAX_LEG_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI);
        angles.rightFrontLegAngle = MAX_LEG_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI + Math.PI);
        angles.leftFrontPawAngle = MAX_PAW_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI + Math.PI/2);
        angles.rightFrontPawAngle = MAX_PAW_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI + Math.PI * 1.5);
        angles.leftBackLegAngle = MAX_LEG_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI + Math.PI);
        angles.rightBackLegAngle = MAX_LEG_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI);
        angles.tailAngle = TAIL_WAG_ANGLE * Math.sin(g_walkPhase * 2 * Math.PI * TAIL_WAG_SPEED);
        angles.headAngle = 5 * Math.sin(g_walkPhase * 2 * Math.PI * 0.5);
    }
    
    return angles;
}

// Start the animation
function startAnimation() {
    if (!g_AnimationOn) {
        g_AnimationOn = true;
        g_LastTime = Date.now();
        requestAnimationFrame(tick);
    }
}

// Stop the animation
function stopAnimation() {
    g_AnimationOn = false;
}

// Animation frame tick function
function tick() {
    if (!g_AnimationOn && !g_isPoked) return;
    
    // Calculate elapsed time
    const now = Date.now();
    const elapsed = Math.min(200, now - g_LastTime); // Cap at 200ms to prevent large jumps
    g_LastTime = now;
    
    // Update FPS counter
    g_FrameCount++;
    if (now - g_LastFPSUpdateTime >= 1000) {
        g_FPS = Math.round((g_FrameCount * 1000) / (now - g_LastFPSUpdateTime));
        document.getElementById('fps-counter').textContent = `FPS: ${g_FPS}`;
        g_FrameCount = 0;
        g_LastFPSUpdateTime = now;
    }
    
    // Update animation state
    updateAnimation(elapsed);
    
    // Render the scene
    renderScene();
    
    // Request next frame if animation is still on
    if (g_AnimationOn || g_isPoked) {
        requestAnimationFrame(tick);
    }
}

// Trigger poke animation
function triggerPokeAnimation() {
    g_isPoked = true;
    g_pokeStartTime = Date.now();
    
    // If animation is off, run a temporary animation cycle
    if (!g_AnimationOn) {
        g_LastTime = Date.now();
        tick();
    }
}