// Model definition for the astronaut cat

// Updated colors for Siamese cat appearance
const COLORS = {
    CAT_BODY: [0.8, 0.75, 0.7, 1.0],     // Light tan/cream body
    CAT_HEAD: [0.8, 0.75, 0.7, 1.0],     // Light tan/cream head
    CAT_EARS: [0.4, 0.3, 0.25, 1.0],     // Darker brown for ears (points)
    CAT_TAIL: [0.4, 0.3, 0.25, 1.0],     // Darker brown for tail (points)
    CAT_LEGS: [0.4, 0.3, 0.25, 1.0],     // Darker brown for legs (points)
    CAT_PAWS: [0.4, 0.3, 0.25, 1.0],     // Darker brown for paws (points)
    CAT_NOSE: [0.9, 0.5, 0.6, 1.0],      // Pink nose
    CAT_EYES: [0.0, 0.6, 0.8, 1.0],      // Brighter blue eyes (Siamese trait)
    HELMET: [0.7, 0.9, 1.0, 0.7],        // Light blue, transparent
    HELMET_RING: [0.9, 0.9, 0.2, 1.0],   // Gold
    SPACE_SUIT: [0.3, 0.6, 0.9, 1.0],    // Blue
    WHISKERS: [1.0, 1.0, 1.0, 1.0],      // White
    MOON_SURFACE: [0.85, 0.85, 0.9, 1.0], // Light gray
    CRATER: [0.7, 0.7, 0.75, 1.0],       // Darker gray for craters
    STARS: [1.0, 1.0, 1.0, 1.0]          // White
};

// Parts counter to track if we have at least 8 parts
let partsCount = 0;

// Draw the cat's head with helmet
function drawCatHead(gl, parentMatrix, headAngle) {
    // Head
    let headMatrix = new Matrix4();
    headMatrix.set(parentMatrix);
    headMatrix.translate(0, 0.7, 0);
    headMatrix.rotate(headAngle, 0, 0, 1); // Head can tilt side to side
    
    // Save the head transformation for ears and helmet
    let headTransform = new Matrix4();
    headTransform.set(headMatrix);
    
    // Draw the head (sphere instead of cube for more cat-like appearance)
    headMatrix.scale(0.4, 0.35, 0.4);
    drawSphere(gl, headMatrix, COLORS.CAT_HEAD);
    partsCount++;
    
    // Left Ear
    let leftEarMatrix = new Matrix4();
    leftEarMatrix.set(headTransform);
    leftEarMatrix.translate(-0.18, 0.25, 0);
    leftEarMatrix.rotate(30, 0, 0, 1);
    leftEarMatrix.rotate(-15, 1, 0, 0);
    leftEarMatrix.scale(0.12, 0.2, 0.08);
    // Use a pyramid or triangle for ears
    drawCube(gl, leftEarMatrix, COLORS.CAT_EARS);
    partsCount++;
    
    // Right Ear
    let rightEarMatrix = new Matrix4();
    rightEarMatrix.set(headTransform);
    rightEarMatrix.translate(0.18, 0.25, 0);
    rightEarMatrix.rotate(-30, 0, 0, 1);
    rightEarMatrix.rotate(-15, 1, 0, 0);
    rightEarMatrix.scale(0.12, 0.2, 0.08);
    drawCube(gl, rightEarMatrix, COLORS.CAT_EARS);
    partsCount++;
    
    // Darker mask area of face (Siamese trait)
    let maskMatrix = new Matrix4();
    maskMatrix.set(headTransform);
    maskMatrix.translate(0, 0.05, 0.25);
    maskMatrix.scale(0.25, 0.18, 0.15);
    drawSphere(gl, maskMatrix, [0.4, 0.3, 0.25, 1.0]); // Darker brown
    partsCount++;
    
    // Eyes - moved back from the front of the helmet and made bluer (Siamese trait)
    let leftEyeMatrix = new Matrix4();
    leftEyeMatrix.set(headTransform);
    leftEyeMatrix.translate(-0.12, 0.05, 0.25); // Reduced Z value to place eyes on face
    leftEyeMatrix.scale(0.08, 0.12, 0.05);
    drawSphere(gl, leftEyeMatrix, COLORS.CAT_EYES);
    partsCount++;
    
    let rightEyeMatrix = new Matrix4();
    rightEyeMatrix.set(headTransform);
    rightEyeMatrix.translate(0.12, 0.05, 0.25); // Reduced Z value to place eyes on face
    rightEyeMatrix.scale(0.08, 0.12, 0.05);
    drawSphere(gl, rightEyeMatrix, COLORS.CAT_EYES);
    partsCount++;
    
    // Nose - move it back from the front of the helmet
    let noseMatrix = new Matrix4();
    noseMatrix.set(headTransform);
    noseMatrix.translate(0, -0.05, 0.28); // Reduced Z value
    noseMatrix.scale(0.06, 0.04, 0.04);
    drawSphere(gl, noseMatrix, COLORS.CAT_NOSE);
    partsCount++;
    
    // Whiskers (left) - move them back from the front of the helmet
    let leftWhisker1Matrix = new Matrix4();
    leftWhisker1Matrix.set(headTransform);
    leftWhisker1Matrix.translate(-0.15, -0.05, 0.25);
    leftWhisker1Matrix.rotate(10, 0, 1, 0);
    leftWhisker1Matrix.scale(0.15, 0.01, 0.01);
    drawCube(gl, leftWhisker1Matrix, COLORS.WHISKERS);
    
    let leftWhisker2Matrix = new Matrix4();
    leftWhisker2Matrix.set(headTransform);
    leftWhisker2Matrix.translate(-0.15, -0.1, 0.25); // Reduced Z value to place whiskers on face
    leftWhisker2Matrix.rotate(0, 0, 1, 0);
    leftWhisker2Matrix.scale(0.15, 0.01, 0.01);
    drawCube(gl, leftWhisker2Matrix, COLORS.WHISKERS);
    
    // Whiskers (right) - move them back from the front of the helmet
    let rightWhisker1Matrix = new Matrix4();
    rightWhisker1Matrix.set(headTransform);
    rightWhisker1Matrix.translate(0.15, -0.05, 0.25); // Reduced Z value to place whiskers on face
    rightWhisker1Matrix.rotate(-10, 0, 1, 0);
    rightWhisker1Matrix.scale(0.15, 0.01, 0.01);
    drawCube(gl, rightWhisker1Matrix, COLORS.WHISKERS);
    
    let rightWhisker2Matrix = new Matrix4();
    rightWhisker2Matrix.set(headTransform);
    rightWhisker2Matrix.translate(0.15, -0.1, 0.25); // Reduced Z value to place whiskers on face
    rightWhisker2Matrix.rotate(0, 0, 1, 0);
    rightWhisker2Matrix.scale(0.15, 0.01, 0.01);
    drawCube(gl, rightWhisker2Matrix, COLORS.WHISKERS);
    
    partsCount++; // Count all whiskers as one part
    
    // Helmet (transparent sphere)
    let helmetMatrix = new Matrix4();
    helmetMatrix.set(headTransform);
    helmetMatrix.scale(1.3, 1.3, 1.3);
    drawSphere(gl, helmetMatrix, COLORS.HELMET);
    partsCount++;
    
    // Helmet Ring
    let helmetRingMatrix = new Matrix4();
    helmetRingMatrix.set(headTransform);
    helmetRingMatrix.translate(0, -0.15, 0);
    helmetRingMatrix.rotate(90, 1, 0, 0);
    helmetRingMatrix.scale(0.55, 0.05, 0.55);
    drawCylinder(gl, helmetRingMatrix, COLORS.HELMET_RING);
    partsCount++;
    
    return headTransform;
}

// Draw the cat's body with space suit
function drawCatBody(gl, globalMatrix) {
    // Body
    let bodyMatrix = new Matrix4();
    bodyMatrix.set(globalMatrix);
    bodyMatrix.translate(0, 0, 0);
    
    // Save the body transformation for limbs and tail
    let bodyTransform = new Matrix4();
    bodyTransform.set(bodyMatrix);
    
    // Draw the body (slightly oval)
    bodyMatrix.scale(0.45, 0.6, 0.4);
    drawCube(gl, bodyMatrix, COLORS.SPACE_SUIT);
    partsCount++;
    
    return bodyTransform;
}

// Draw the cat's tail
function drawCatTail(gl, parentMatrix, tailAngle) {
    // Tail Base
    let tailBaseMatrix = new Matrix4();
    tailBaseMatrix.set(parentMatrix);
    tailBaseMatrix.translate(0, -0.1, -0.4);
    tailBaseMatrix.rotate(tailAngle, 1, 0, 0); // Rotate around X axis
    
    // Save the tail base transformation for next segment
    let tailBaseTransform = new Matrix4();
    tailBaseTransform.set(tailBaseMatrix);
    
    // Draw the tail base (more curved)
    tailBaseMatrix.scale(0.1, 0.1, 0.3);
    drawCylinder(gl, tailBaseMatrix, COLORS.CAT_TAIL);
    partsCount++;
    
    // Tail Middle
    let tailMiddleMatrix = new Matrix4();
    tailMiddleMatrix.set(tailBaseTransform);
    tailMiddleMatrix.translate(0, 0, -0.3);
    tailMiddleMatrix.rotate(20 + tailAngle/2, 1, 0, 0); // Additional curve
    
    // Save middle transform
    let tailMiddleTransform = new Matrix4();
    tailMiddleTransform.set(tailMiddleMatrix);
    
    // Draw middle segment
    tailMiddleMatrix.scale(0.09, 0.09, 0.3);
    drawCylinder(gl, tailMiddleMatrix, COLORS.CAT_TAIL);
    partsCount++;
    
    // Tail Tip
    let tailTipMatrix = new Matrix4();
    tailTipMatrix.set(tailMiddleTransform);
    tailTipMatrix.translate(0, 0, -0.3);
    tailTipMatrix.rotate(20 + tailAngle/3, 1, 0, 0); // Even more curve
    
    // Draw the tail tip
    tailTipMatrix.scale(0.07, 0.07, 0.25);
    drawCylinder(gl, tailTipMatrix, COLORS.CAT_TAIL);
    partsCount++;
    
    return tailBaseTransform;
}

// Draw a front leg (with joint hierarchy)
function drawFrontLeg(gl, parentMatrix, legAngle, pawAngle, isLeft) {
    const sideMultiplier = isLeft ? 1 : -1;
    
    // Upper Leg (left or right)
    let upperLegMatrix = new Matrix4();
    upperLegMatrix.set(parentMatrix);
    upperLegMatrix.translate(sideMultiplier * 0.35, -0.2, 0.1);
    upperLegMatrix.rotate(legAngle, 1, 0, 0); // Rotate forward/back
    
    // Save the upper leg transformation for lower leg
    let upperLegTransform = new Matrix4();
    upperLegTransform.set(upperLegMatrix);
    
    // Draw the upper leg - darker color for Siamese points
    upperLegMatrix.scale(0.12, 0.35, 0.12);
    drawCylinder(gl, upperLegMatrix, COLORS.CAT_LEGS);
    partsCount++;
    
    // Lower Leg (left or right)
    let lowerLegMatrix = new Matrix4();
    lowerLegMatrix.set(upperLegTransform);
    lowerLegMatrix.translate(0, -0.35, 0);
    lowerLegMatrix.rotate(pawAngle, 1, 0, 0); // Rotate at the knee
    
    // Save the lower leg transformation for paw
    let lowerLegTransform = new Matrix4();
    lowerLegTransform.set(lowerLegMatrix);
    
    // Draw the lower leg - darker color for Siamese points
    lowerLegMatrix.scale(0.1, 0.25, 0.1);
    drawCylinder(gl, lowerLegMatrix, COLORS.CAT_LEGS);
    partsCount++;
    
    // Paw (left or right) - darker color for Siamese points
    let pawMatrix = new Matrix4();
    pawMatrix.set(lowerLegTransform);
    pawMatrix.translate(0, -0.15, 0.05);
    
    // Draw the paw
    pawMatrix.scale(0.15, 0.1, 0.25);
    drawSphere(gl, pawMatrix, COLORS.CAT_PAWS);
    partsCount++;
    
    // Draw individual toes
    for (let i = -1; i <= 1; i++) {
        let toeMatrix = new Matrix4();
        toeMatrix.set(lowerLegTransform);
        toeMatrix.translate(i * 0.05, -0.2, 0.15);
        toeMatrix.scale(0.04, 0.05, 0.08);
        drawSphere(gl, toeMatrix, COLORS.CAT_PAWS);
    }
    
    return upperLegTransform;
}

// Draw a back leg
function drawBackLeg(gl, parentMatrix, legAngle, isLeft) {
    const sideMultiplier = isLeft ? 1 : -1;
    
    // Back Leg (left or right)
    let backLegMatrix = new Matrix4();
    backLegMatrix.set(parentMatrix);
    backLegMatrix.translate(sideMultiplier * 0.25, -0.3, -0.2);
    backLegMatrix.rotate(legAngle, 1, 0, 0);
    
    // Save transform for further parts
    let backLegTransform = new Matrix4();
    backLegTransform.set(backLegMatrix);
    
    // Draw the back leg with Siamese coloration
    backLegMatrix.scale(0.13, 0.35, 0.13);
    drawCylinder(gl, backLegMatrix, COLORS.CAT_LEGS);
    partsCount++;
    
    // Back paw with Siamese coloration
    let backPawMatrix = new Matrix4();
    backPawMatrix.set(backLegTransform);
    backPawMatrix.translate(0, -0.35, 0.05);
    backPawMatrix.scale(0.15, 0.1, 0.25);
    drawSphere(gl, backPawMatrix, COLORS.CAT_PAWS);
    partsCount++;
    
    // Draw individual toes
    for (let i = -1; i <= 1; i++) {
        let toeMatrix = new Matrix4();
        toeMatrix.set(backLegTransform);
        toeMatrix.translate(i * 0.05, -0.4, 0.15);
        toeMatrix.scale(0.04, 0.05, 0.08);
        drawSphere(gl, toeMatrix, COLORS.CAT_PAWS);
    }
    
    return backLegMatrix;
}

// Enhanced moon surface with more details
function drawMoonSurface(gl, globalMatrix) {
    // Basic surface - make it wider and positioned correctly
    let surfaceMatrix = new Matrix4();
    surfaceMatrix.set(globalMatrix);
    surfaceMatrix.translate(0, -0.75, 0); // Raised up to be visible under the cat
    surfaceMatrix.scale(10.0, 0.1, 10.0); // Wider surface
    drawCube(gl, surfaceMatrix, COLORS.MOON_SURFACE);
    partsCount++;
    
    // Add several craters with fixed positions
    const craterPositions = [
        {x: -2.0, z: -1.5, size: 0.8},
        {x: 1.5, z: 0.5, size: 0.6},
        {x: -1.0, z: 2.0, size: 0.5},
        {x: 0.5, z: -2.5, size: 0.7}
    ];
    
    for (const pos of craterPositions) {
        // Create crater depression
        let craterMatrix = new Matrix4();
        craterMatrix.set(globalMatrix);
        craterMatrix.translate(pos.x, -0.7, pos.z);
        craterMatrix.rotate(90, 1, 0, 0);
        craterMatrix.scale(pos.size, 0.05, pos.size);
        drawCylinder(gl, craterMatrix, COLORS.CRATER); // Darker gray
        partsCount++;
    }
    
    // Add a few small rocks scattered around
    const rockPositions = [
        {x: -3.0, z: 2.5},
        {x: 2.5, z: 2.0},
        {x: 0.5, z: -3.0}
    ];
    
    for (const pos of rockPositions) {
        let rockMatrix = new Matrix4();
        rockMatrix.set(globalMatrix);
        rockMatrix.translate(pos.x, -0.65, pos.z);
        rockMatrix.scale(0.2, 0.1, 0.2);
        drawCube(gl, rockMatrix, COLORS.CRATER);
        partsCount++;
    }
}

// Reset parts counter before each render
function resetPartsCounter() {
    partsCount = 0;
}

// Get the total number of parts drawn
function getPartsCount() {
    return partsCount;
}