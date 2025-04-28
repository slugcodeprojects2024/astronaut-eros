// Matrix4 class for handling matrix operations
class Matrix4 {
    constructor() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    // Set to identity matrix
    setIdentity() {
        const e = this.elements;
        e[0] = 1;  e[4] = 0;  e[8]  = 0;  e[12] = 0;
        e[1] = 0;  e[5] = 1;  e[9]  = 0;  e[13] = 0;
        e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    // Set values from another matrix
    set(src) {
        if (src.elements) {
            const s = src.elements;
            const d = this.elements;
            for (let i = 0; i < 16; i++) {
                d[i] = s[i];
            }
        } else {
            throw new Error('Invalid matrix source');
        }
        return this;
    }

    // Translate the matrix
    translate(x, y, z) {
        const e = this.elements;
        e[12] += e[0] * x + e[4] * y + e[8]  * z;
        e[13] += e[1] * x + e[5] * y + e[9]  * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this;
    }

    // Rotate around an axis
    rotate(angle, x, y, z) {
        let rad = angle * Math.PI / 180;
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        
        // Normalize the axis vector
        if (x !== 0 || y !== 0 || z !== 0) {
            const len = Math.sqrt(x*x + y*y + z*z);
            x /= len;
            y /= len;
            z /= len;
        }
        
        const e = this.elements;
        
        // Create rotation matrix
        const r = new Float32Array(16);
        const t = 1 - c;
        
        r[0] = t * x * x + c;
        r[1] = t * x * y + s * z;
        r[2] = t * x * z - s * y;
        r[3] = 0;
        
        r[4] = t * x * y - s * z;
        r[5] = t * y * y + c;
        r[6] = t * y * z + s * x;
        r[7] = 0;
        
        r[8] = t * x * z + s * y;
        r[9] = t * y * z - s * x;
        r[10] = t * z * z + c;
        r[11] = 0;
        
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;
        
        // Multiply the rotation matrix
        const a = this.elements;
        const b = r;
        
        // Calculate new matrix values
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        
        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
        
        e[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
        e[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
        e[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
        e[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
        
        e[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
        e[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
        e[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
        e[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
        
        e[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
        e[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
        e[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
        e[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
        
        e[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
        e[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
        e[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
        e[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
        
        return this;
    }

    // Scale the matrix
    scale(x, y, z) {
        const e = this.elements;
        e[0] *= x;  e[4] *= y;  e[8]  *= z;
        e[1] *= x;  e[5] *= y;  e[9]  *= z;
        e[2] *= x;  e[6] *= y;  e[10] *= z;
        e[3] *= x;  e[7] *= y;  e[11] *= z;
        return this;
    }

    // Invert the matrix (for camera transformations)
    invert() {
        const e = this.elements;
        const a00 = e[0],  a01 = e[1],  a02 = e[2],  a03 = e[3];
        const a10 = e[4],  a11 = e[5],  a12 = e[6],  a13 = e[7];
        const a20 = e[8],  a21 = e[9],  a22 = e[10], a23 = e[11];
        const a30 = e[12], a31 = e[13], a32 = e[14], a33 = e[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        const invDet = 1.0 / det;

        e[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        e[1] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
        e[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        e[3] = (a22 * b04 - a21 * b05 - a23 * b03) * invDet;
        e[4] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
        e[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        e[6] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
        e[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        e[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        e[9] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;
        e[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        e[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet;
        e[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet;
        e[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        e[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet;
        e[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return this;
    }
}