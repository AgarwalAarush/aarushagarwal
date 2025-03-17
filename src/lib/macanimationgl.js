// M1 Mac WebGL Animation – Extended with Keyboard, Trackpad & Code Display
// lib/macanimation.js

export function initMacbookAnimation(container) {
    if (!container) return null;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    // Initialize WebGL context
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    
    if (!gl) {
      console.error('WebGL not supported');
      renderFallbackSVG(container);
      return null;
    }
    
    // Enable transparency and depth
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // -----------------------
    // Updated Shader Sources
    // -----------------------
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      attribute vec3 aVertexNormal;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uNormalMatrix;
      
      varying lowp vec4 vColor;
      varying highp vec3 vLighting;
      varying highp vec2 vTextureCoord;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        vTextureCoord = aTextureCoord;
        
        // Lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
        
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
      }
    `;
    
    const fsSource = `
      precision mediump float;
      
      varying lowp vec4 vColor;
      varying highp vec3 vLighting;
      varying highp vec2 vTextureCoord;
      
      uniform bool uUseTexture;
      uniform sampler2D uSampler;
      
      void main() {
        if (uUseTexture) {
          vec4 textureColor = texture2D(uSampler, vTextureCoord);
          gl_FragColor = vec4(textureColor.rgb * vLighting, textureColor.a);
        } else {
          gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
        }
      }
    `;
    
    // -----------------------
    // Initialize Shader Program
    // -----------------------
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uUseTexture: gl.getUniformLocation(shaderProgram, 'uUseTexture'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };
    
    // -----------------------
    // Build Main Mac Model Buffers
    // -----------------------
    // Note: The base and screen use a darker “space black” color.
    const macbookBuffers = initMacbookBuffers(gl);
    
    // -----------------------
    // Build Additional Objects
    // -----------------------
    // Add a QWERTY keyboard (rendered as a grid of keys on the top surface of the base)
    const keyboardBuffers = initKeyboardBuffers(gl);
    // Add a trackpad (a rounded rectangle in the lower center of the base)
    const trackpadBuffers = initTrackpadBuffers(gl);
    // For the code display on the screen, we use a simple rectangle with texture coordinates.
    // We reuse the bezel dimensions from the screen.
    const { bezelWidth, bezelHeight, bezelTopOffset } = macbookBuffers;  
    const codeDisplayBuffers = initCodeDisplayBuffers(gl, bezelWidth, bezelHeight, bezelTopOffset);
    // Create the dynamic code texture (offscreen canvas)
    const codeTextureObj = createCodeTexture(gl);
    
    // Initial rotation angle for the whole Mac
    let rotation = 0.0;
    // For code animation (simulate code being written)
    let codeOffset = 0;
    
    // Render loop
    function render() {
      // Update code texture (simulate typing / scrolling code)
      updateCodeTexture(gl, codeTextureObj, codeOffset);
      codeOffset += 1; // adjust speed as needed
      
      drawScene(gl, programInfo, macbookBuffers, keyboardBuffers, trackpadBuffers, codeDisplayBuffers, codeTextureObj.texture, rotation);
      rotation += 0.005;
      requestAnimationFrame(render);
    }
    
    const animationId = requestAnimationFrame(render);
    
    // Handle window resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return function cleanup() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }
  
  // -----------------------
  // Shader and Object Setup Functions
  // -----------------------
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }
  
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  
  // -----------------------
  // Main MacBook Geometry (Base & Screen)
  // -----------------------
  function initMacbookBuffers(gl) {
    // Use a darker “space black” for the chassis.
    const baseColor = [0.02, 0.02, 0.02, 1.0];
    const screenGray = [0.06, 0.07, 0.09, 1.0];
    const chassisColor = [0.02, 0.02, 0.02, 1.0];
    
    // Dimensions for the base (thinner for M1/M3 style)
    const baseWidth = 2.2;
    const baseHeight = 0.06;
    const baseDepth = 1.6;
    
    // Screen dimensions
    const screenWidth = 2.2;
    const screenHeight = 1.4;
    const screenThickness = 0.05;
    
    // Instead of sharp corners, assume these geometries were modeled with rounded edges.
    // (For a full implementation you could generate extra vertices along the edges.)
    
    // --- Base ---
    const basePositions = [
      // Front face
      -baseWidth/2, -baseHeight/2, baseDepth/2,
       baseWidth/2, -baseHeight/2, baseDepth/2,
       baseWidth/2,  baseHeight/2, baseDepth/2,
      -baseWidth/2,  baseHeight/2, baseDepth/2,
      // Back face
      -baseWidth/2, -baseHeight/2, -baseDepth/2,
      -baseWidth/2,  baseHeight/2, -baseDepth/2,
       baseWidth/2,  baseHeight/2, -baseDepth/2,
       baseWidth/2, -baseHeight/2, -baseDepth/2,
      // Top face
      -baseWidth/2,  baseHeight/2, -baseDepth/2,
      -baseWidth/2,  baseHeight/2, baseDepth/2,
       baseWidth/2,  baseHeight/2, baseDepth/2,
       baseWidth/2,  baseHeight/2, -baseDepth/2,
      // Bottom face
      -baseWidth/2, -baseHeight/2, -baseDepth/2,
       baseWidth/2, -baseHeight/2, -baseDepth/2,
       baseWidth/2, -baseHeight/2, baseDepth/2,
      -baseWidth/2, -baseHeight/2, baseDepth/2,
      // Right face
       baseWidth/2, -baseHeight/2, -baseDepth/2,
       baseWidth/2,  baseHeight/2, -baseDepth/2,
       baseWidth/2,  baseHeight/2, baseDepth/2,
       baseWidth/2, -baseHeight/2, baseDepth/2,
      // Left face
      -baseWidth/2, -baseHeight/2, -baseDepth/2,
      -baseWidth/2, -baseHeight/2, baseDepth/2,
      -baseWidth/2,  baseHeight/2, baseDepth/2,
      -baseWidth/2,  baseHeight/2, -baseDepth/2,
    ];
    const baseColors = [];
    for (let i = 0; i < 24; i++) {
      baseColors.push(...baseColor);
    }
    function createNormals(count, nx, ny, nz) {
      const normals = [];
      for (let i = 0; i < count; i++) {
        normals.push(nx, ny, nz);
      }
      return normals;
    }
    const baseNormals = [
      ...createNormals(4, 0, 0, 1),
      ...createNormals(4, 0, 0, -1),
      ...createNormals(4, 0, 1, 0),
      ...createNormals(4, 0, -1, 0),
      ...createNormals(4, 1, 0, 0),
      ...createNormals(4, -1, 0, 0),
    ];
    const baseIndices = [
      0, 1, 2, 0, 2, 3,      // Front
      4, 5, 6, 4, 6, 7,      // Back
      8, 9, 10, 8, 10, 11,   // Top
      12, 13, 14, 12, 14, 15, // Bottom
      16, 17, 18, 16, 18, 19, // Right
      20, 21, 22, 20, 22, 23  // Left
    ];
    
    // --- Screen (chassis) positions (before hinging) ---
    const screenPositions = [
      // Front face (display bezel)
      -screenWidth/2, 0, 0,
       screenWidth/2, 0, 0,
       screenWidth/2, screenHeight, 0,
      -screenWidth/2, screenHeight, 0,
      // Back face
      -screenWidth/2, 0, -screenThickness,
      -screenWidth/2, screenHeight, -screenThickness,
       screenWidth/2, screenHeight, -screenThickness,
       screenWidth/2, 0, -screenThickness,
      // Top face
      -screenWidth/2, screenHeight, -screenThickness,
      -screenWidth/2, screenHeight, 0,
       screenWidth/2, screenHeight, 0,
       screenWidth/2, screenHeight, -screenThickness,
      // Bottom face (hinge)
      -screenWidth/2, 0, -screenThickness,
       screenWidth/2, 0, -screenThickness,
       screenWidth/2, 0, 0,
      -screenWidth/2, 0, 0,
      // Right face
       screenWidth/2, 0, -screenThickness,
       screenWidth/2, screenHeight, -screenThickness,
       screenWidth/2, screenHeight, 0,
       screenWidth/2, 0, 0,
      // Left face
      -screenWidth/2, 0, -screenThickness,
      -screenWidth/2, 0, 0,
      -screenWidth/2, screenHeight, 0,
      -screenWidth/2, screenHeight, -screenThickness,
    ];
    const screenColors = [];
    // Front face uses a darker color for the display (simulate an “off” display)
    for (let i = 0; i < 4; i++) {
      screenColors.push(...screenGray);
    }
    for (let i = 0; i < 20; i++) {
      screenColors.push(...chassisColor);
    }
    const screenNormals = [
      ...createNormals(4, 0, 0, 1),
      ...createNormals(4, 0, 0, -1),
      ...createNormals(4, 0, 1, 0),
      ...createNormals(4, 0, -1, 0),
      ...createNormals(4, 1, 0, 0),
      ...createNormals(4, -1, 0, 0),
    ];
    const screenIndices = [
      0, 1, 2, 0, 2, 3,      
      4, 5, 6, 4, 6, 7,      
      8, 9, 10, 8, 10, 11,   
      12, 13, 14, 12, 14, 15, 
      16, 17, 18, 16, 18, 19, 
      20, 21, 22, 20, 22, 23  
    ];
    
    // We store bezel dimensions for the code display
    const bezelWidthObj = screenWidth;
    const bezelHeightObj = screenHeight;
    const bezelTopOffsetObj = 0; // top of screen face
    
    // Create and bind buffers for base and screen
    const basePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(basePositions), gl.STATIC_DRAW);
    
    const baseColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, baseColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(baseColors), gl.STATIC_DRAW);
    
    const baseNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, baseNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(baseNormals), gl.STATIC_DRAW);
    
    const baseIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, baseIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(baseIndices), gl.STATIC_DRAW);
    
    const screenPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, screenPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenPositions), gl.STATIC_DRAW);
    
    const screenColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, screenColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenColors), gl.STATIC_DRAW);
    
    const screenNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, screenNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenNormals), gl.STATIC_DRAW);
    
    const screenIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(screenIndices), gl.STATIC_DRAW);
    
    // For these buffers we also create a dummy texture coordinate buffer (for non-textured objects)
    const dummyTexCoords = new Float32Array( (basePositions.length/3) * 2 );
    const dummyTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dummyTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, dummyTexCoords, gl.STATIC_DRAW);
    
    return {
      base: {
        position: basePositionBuffer,
        color: baseColorBuffer,
        normal: baseNormalBuffer,
        indices: baseIndexBuffer,
        count: baseIndices.length,
        texCoord: dummyTexCoordBuffer,
      },
      screen: {
        position: screenPositionBuffer,
        color: screenColorBuffer,
        normal: screenNormalBuffer,
        indices: screenIndexBuffer,
        count: screenIndices.length,
        texCoord: dummyTexCoordBuffer,
      },
      // Pass bezel dims for use by code display
      bezelWidth: bezelWidthObj,
      bezelHeight: bezelHeightObj,
      bezelTopOffset: bezelTopOffsetObj,
    };
  }
  
  // -----------------------
  // QWERTY Keyboard Buffers
  // -----------------------
  function initKeyboardBuffers(gl) {
    // Position the keyboard on top of the base (assume base top at y = baseHeight/2)
    const yPos = 0.03 + 0.005; // slight offset above base
    const keyboardWidth = 2.0;
    const keyboardDepth = 0.7;
    const keyGap = 0.01;
    const rows = [
      { count: 10, label: "QWERTYUIOP" },
      { count: 9, label: "ASDFGHJKL" },
      { count: 7, label: "ZXCVBNM" },
    ];
    const rowHeight = 0.12;
    
    let positions = [];
    let colors = [];
    let normals = [];
    let indices = [];
    let texCoords = []; // not used for keys, but we supply dummy coords
    let indexOffset = 0;
    
    // Use a slightly lighter key color
    const keyColor = [0.15, 0.15, 0.15, 1.0];
    // Normal facing up
    const keyNormal = [0, 1, 0];
    
    // Starting y for the first row (centered vertically in keyboard area)
    const totalRowsHeight = rows.length * rowHeight + (rows.length + 1) * keyGap;
    let startZ = (keyboardDepth - totalRowsHeight) / 2;
    
    rows.forEach((row, rowIndex) => {
      const keysInRow = row.count;
      const keyWidth = (keyboardWidth - (keysInRow + 1) * keyGap) / keysInRow;
      const zPos = startZ + keyGap + rowIndex * (rowHeight + keyGap);
      // Center the row horizontally
      const startX = -keyboardWidth/2 + keyGap;
      for (let i = 0; i < keysInRow; i++) {
        const xPos = startX + i * (keyWidth + keyGap);
        // Create a quad for this key (on horizontal plane)
        // We'll use a simple function to create a rounded rect.
        const keyData = createRoundedRect(xPos, zPos, keyWidth, rowHeight, 0.01, 4);
        // keyData: { positions, indices, normals, texCoords }
        // Adjust y coordinate for all vertices
        for (let j = 0; j < keyData.positions.length; j += 3) {
          keyData.positions[j+1] = yPos; // set y to fixed value
        }
        // Append keyData to our arrays
        positions.push(...keyData.positions);
        normals.push(...keyData.normals);
        texCoords.push(...keyData.texCoords);
        // Use same color for each vertex
        for (let j = 0; j < keyData.positions.length/3; j++) {
          colors.push(...keyColor);
        }
        // Adjust indices
        keyData.indices.forEach(idx => {
          indices.push(idx + indexOffset);
        });
        indexOffset += keyData.positions.length / 3;
      }
    });
    
    // Create and bind buffers for the keyboard object
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
      position: positionBuffer,
      color: colorBuffer,
      normal: normalBuffer,
      texCoord: texCoordBuffer,
      indices: indexBuffer,
      count: indices.length,
    };
  }
  
  // -----------------------
  // Trackpad Buffers
  // -----------------------
  function initTrackpadBuffers(gl) {
    // Place trackpad on base (centered at lower part)
    const yPos = 0.03 + 0.005; // same slight offset as keyboard
    const trackpadWidth = 1.0;
    const trackpadDepth = 0.4;
    // Use a rounded rectangle for a modern look
    const tpData = createRoundedRect(-trackpadWidth/2, -trackpadDepth/2, trackpadWidth, trackpadDepth, 0.05, 6);
    // Adjust positions: move the trackpad to desired location (e.g., lower center of base)
    // For example, center trackpad at (0, yPos, -0.3)
    for (let i = 0; i < tpData.positions.length; i += 3) {
      tpData.positions[i] += 0; // x stays same
      tpData.positions[i+1] = yPos; // override y
      tpData.positions[i+2] += -0.3; // shift in z
    }
    const tpColor = [0.10, 0.10, 0.10, 1.0];
    const colors = [];
    const numVerts = tpData.positions.length / 3;
    for (let i = 0; i < numVerts; i++) {
      colors.push(...tpColor);
    }
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tpData.positions), gl.STATIC_DRAW);
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // Trackpad is flat, normal up
    const normals = [];
    for (let i = 0; i < numVerts; i++) {
      normals.push(0, 1, 0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    // Dummy texcoords for non-textured object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tpData.texCoords), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tpData.indices), gl.STATIC_DRAW);
    
    return {
      position: positionBuffer,
      color: colorBuffer,
      normal: normalBuffer,
      texCoord: texCoordBuffer,
      indices: indexBuffer,
      count: tpData.indices.length,
    };
  }
  
  // -----------------------
  // Code Display Buffers (Textured Rectangle)
  // -----------------------
  function initCodeDisplayBuffers(gl, bezelWidth, bezelHeight, bezelTopOffset) {
    // Create a rectangle that covers the display area.
    // For simplicity, we ignore the notch.
    const w = bezelWidth;
    const h = bezelHeight;
    const z = 0.012; // slightly in front of screen face
    const positions = [
      -w/2, bezelTopOffset, z,
       w/2, bezelTopOffset, z,
       w/2, bezelTopOffset + h, z,
      -w/2, bezelTopOffset + h, z,
    ];
    // Dummy color (won't be used when texturing)
    const colors = [
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
    ];
    // Normals facing forward
    const normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ];
    // Texture coordinates covering the full image
    const texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ];
    const indices = [0, 1, 2, 0, 2, 3];
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
      position: positionBuffer,
      color: colorBuffer,
      normal: normalBuffer,
      texCoord: texCoordBuffer,
      indices: indexBuffer,
      count: indices.length,
    };
  }
  
  // -----------------------
  // Dynamic Code Texture Creation & Update
  // -----------------------
  function createCodeTexture(gl) {
    // Create an offscreen canvas to draw code text
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create WebGL texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill texture with black initially
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0,
                  gl.RGBA, gl.UNSIGNED_BYTE, null);
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    return { texture, canvas, ctx };
  }
  
  function updateCodeTexture(gl, codeTexObj, offset) {
    const { canvas, ctx, texture } = codeTexObj;
    // Clear canvas
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set a nerd font (ensure the font is available or loaded via CSS)
    ctx.font = "20px 'Fira Code', monospace";
    ctx.fillStyle = "#4cc9f0";
    
    // Sample code lines to simulate typing/scrolling.
    const codeLines = [
      "function helloWorld() {",
      "  console.log('Hello, Mac!');",
      "}",
      "",
      "for (let i = 0; i < 10; i++) {",
      "  console.log(i);",
      "}",
      "",
      "// Enjoy your space black Mac",
    ];
    
    // Use the offset to scroll the code (wrap-around)
    const lineHeight = 24;
    const startLine = Math.floor(offset / 5) % codeLines.length;
    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[(startLine + i) % codeLines.length];
      ctx.fillText(line, 10, 30 + i * lineHeight);
    }
    
    // Update the texture with the canvas content
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  }
  
  // -----------------------
  // Draw the Entire Scene
  // -----------------------
  function drawScene(gl, programInfo, macbookBuffers, keyboardBuffers, trackpadBuffers, codeDisplayBuffers, codeTexture, rotation) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Create perspective matrix
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    // Set modelView matrix for entire MacBook
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -0.5, -5.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 1, 0]);
    
    // Normal matrix
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    
    // Draw Base
    drawObject(gl, programInfo, macbookBuffers.base, modelViewMatrix, normalMatrix, projectionMatrix, false, null);
    
    // Draw Screen (chassis) – then later we overlay code display onto it.
    // Save a copy for screen objects.
    const screenMatrix = mat4.clone(modelViewMatrix);
    // Position screen (hinged)
    mat4.translate(screenMatrix, screenMatrix, [0.0, 0.03, -0.8]);
    mat4.rotate(screenMatrix, screenMatrix, -Math.PI/6, [1, 0, 0]);
    drawObject(gl, programInfo, macbookBuffers.screen, screenMatrix, normalMatrix, projectionMatrix, false, null);
    
    // Draw Keyboard (on top of base)
    // The keyboard is built in object space relative to the base.
    drawObject(gl, programInfo, keyboardBuffers, modelViewMatrix, normalMatrix, projectionMatrix, false, null);
    
    // Draw Trackpad (on base)
    drawObject(gl, programInfo, trackpadBuffers, modelViewMatrix, normalMatrix, projectionMatrix, false, null);
    
    // Draw Code Display on the screen using texture.
    drawObject(gl, programInfo, codeDisplayBuffers, screenMatrix, normalMatrix, projectionMatrix, true, codeTexture);
  }
  
  // -----------------------
  // Generic Draw Function
  // -----------------------
  function drawObject(gl, programInfo, bufferInfo, modelViewMatrix, normalMatrix, projectionMatrix, useTexture, texture) {
    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    
    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    
    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    
    // Bind texture coordinate buffer if available; otherwise supply a dummy.
    if (bufferInfo.texCoord) {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.texCoord);
      gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    } else {
      gl.disableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }
    
    // Bind element indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
    
    // Use the shader program
    gl.useProgram(programInfo.program);
    
    // Set uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
    
    // Set texture uniform
    gl.uniform1i(programInfo.uniformLocations.uUseTexture, useTexture);
    if (useTexture && texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    }
    
    gl.drawElements(gl.TRIANGLES, bufferInfo.count, gl.UNSIGNED_SHORT, 0);
  }
  
  // -----------------------
  // Helper: Create a Rounded Rectangle in 2D (for extruded objects)
  // Returns an object with positions, indices, normals and texCoords.
  // (This simple implementation creates a 2D polygon approximating a rounded rect.)
  function createRoundedRect(x, y, width, height, radius, segments) {
    const positions = [];
    const indices = [];
    const normals = [];
    const texCoords = [];
    
    // Create center rectangle vertices (for simplicity, we use a triangle fan)
    // We generate vertices around the center along the border.
    const cx = x + width/2;
    const cy = y + height/2;
    const angleStep = (2 * Math.PI) / (segments * 4);
    
    // Generate points for the entire rounded rect outline.
    // We go around the four corners.
    const outline = [];
    
    // Top-left corner
    for (let a = Math.PI; a < Math.PI + (Math.PI/2); a += angleStep) {
      const px = x + radius + Math.cos(a) * radius;
      const py = y + radius + Math.sin(a) * radius;
      outline.push({x: px, y: py});
    }
    // Top-right
    for (let a = Math.PI + (Math.PI/2); a < Math.PI + Math.PI; a += angleStep) {
      const px = x + width - radius + Math.cos(a) * radius;
      const py = y + radius + Math.sin(a) * radius;
      outline.push({x: px, y: py});
    }
    // Bottom-right
    for (let a = Math.PI + Math.PI; a < Math.PI + 3*Math.PI/2; a += angleStep) {
      const px = x + width - radius + Math.cos(a) * radius;
      const py = y + height - radius + Math.sin(a) * radius;
      outline.push({x: px, y: py});
    }
    // Bottom-left
    for (let a = Math.PI + 3*Math.PI/2; a < 2 * Math.PI + Math.PI; a += angleStep) {
      const px = x + radius + Math.cos(a) * radius;
      const py = y + height - radius + Math.sin(a) * radius;
      outline.push({x: px, y: py});
    }
    
    // Build vertices: center + outline vertices.
    // Center point:
    positions.push(cx, 0, cy); // use y=0 as plane; we later override vertical coordinate if needed.
    normals.push(0, 1, 0);
    texCoords.push((cx - x) / width, (cy - y) / height);
    
    for (let i = 0; i < outline.length; i++) {
      positions.push(outline[i].x, 0, outline[i].y);
      normals.push(0, 1, 0);
      texCoords.push((outline[i].x - x) / width, (outline[i].y - y) / height);
    }
    
    // Triangulate using a triangle fan from center.
    for (let i = 1; i <= outline.length; i++) {
      indices.push(0, i, i % outline.length + 1);
    }
    
    return { positions, indices, normals, texCoords };
  }
  
  // -----------------------
  // Fallback SVG Renderer (for when WebGL is unavailable)
  // -----------------------
  function renderFallbackSVG(container) {
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" class="w-full h-full opacity-20">
        <g transform="translate(350, 250) scale(1.8)">
          <!-- Space black MacBook Base with rounded corners -->
          <rect x="80" y="290" width="140" height="10" rx="5" fill="#010101" />
          <!-- Screen with notch -->
          <rect x="80" y="100" width="140" height="190" rx="10" fill="#010101" />
          <rect x="85" y="105" width="130" height="175" rx="5" fill="#0a0c14" />
          <!-- Notch -->
          <path d="M145,105 L155,105 L155,112 L145,112 Z" fill="#010101" />
          <!-- Apple logo -->
          <circle cx="150" cy="190" r="8" fill="#4cc9f0" opacity="0.8" />
          <!-- Code lines on screen -->
          <g fill="#4cc9f0" opacity="0.8">
            <rect x="100" y="120" width="100" height="2" />
            <rect x="100" y="130" width="80" height="2" />
            <rect x="100" y="140" width="90" height="2" />
            <rect x="110" y="150" width="70" height="2" />
            <rect x="110" y="160" width="60" height="2" />
            <rect x="100" y="170" width="90" height="2" />
            <rect x="100" y="180" width="70" height="2" />
            <rect x="100" y="200" width="100" height="2" />
            <rect x="100" y="210" width="80" height="2" />
            <rect x="100" y="220" width="90" height="2" />
            <rect x="110" y="230" width="70" height="2" />
            <rect x="110" y="240" width="60" height="2" />
            <rect x="100" y="250" width="90" height="2" />
          </g>
          <!-- Trackpad -->
          <rect x="120" y="250" width="60" height="35" rx="5" fill="#010101" opacity="0.8" />
        </g>
      </svg>
    `;
  }
  
  // -----------------------
  // Simple Matrix Library for WebGL Transformations
  // -----------------------
  const mat4 = {
    create: function() {
      const out = new Float32Array(16);
      out[0] = 1; out[5] = 1; out[10] = 1; out[15] = 1;
      return out;
    },
    
    perspective: function(out, fovy, aspect, near, far) {
      const f = 1.0 / Math.tan(fovy / 2);
      out[0] = f / aspect;
      out[5] = f;
      out[10] = far != null && far !== Infinity ? (far + near) / (near - far) : -1;
      out[11] = -1;
      out[14] = far != null && far !== Infinity ? (2 * far * near) / (near - far) : -2 * near;
      out[1] = out[2] = out[3] = out[4] =
      out[6] = out[7] = out[8] = out[9] = out[12] = out[13] = out[15] = 0;
      return out;
    },
    
    translate: function(out, a, v) {
      const x = v[0], y = v[1], z = v[2];
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      return out;
    },
    
    rotate: function(out, a, rad, axis) {
      let x = axis[0], y = axis[1], z = axis[2];
      let len = Math.hypot(x, y, z);
      if (len < 0.000001) return null;
      len = 1 / len;
      x *= len; y *= len; z *= len;
      const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c;
      const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      
      const b00 = x * x * t + c,     b01 = y * x * t + z * s, b02 = z * x * t - y * s;
      const b10 = x * y * t - z * s,   b11 = y * y * t + c,     b12 = z * y * t + x * s;
      const b20 = x * z * t + y * s,   b21 = y * z * t - x * s, b22 = z * z * t + c;
      
      out[0] = a00 * b00 + a10 * b01 + a20 * b02;
      out[1] = a01 * b00 + a11 * b01 + a21 * b02;
      out[2] = a02 * b00 + a12 * b01 + a22 * b02;
      out[3] = a03 * b00 + a13 * b01 + a23 * b02;
      
      out[4] = a00 * b10 + a10 * b11 + a20 * b12;
      out[5] = a01 * b10 + a11 * b11 + a21 * b12;
      out[6] = a02 * b10 + a12 * b11 + a22 * b12;
      out[7] = a03 * b10 + a13 * b11 + a23 * b12;
      
      out[8] = a00 * b20 + a10 * b21 + a20 * b22;
      out[9] = a01 * b20 + a11 * b21 + a21 * b22;
      out[10] = a02 * b20 + a12 * b21 + a22 * b22;
      out[11] = a03 * b20 + a13 * b21 + a23 * b22;
      
      out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
      return out;
    },
    
    invert: function(out, a) {
      const a00 = a[0], a01 = a[1], a02 = a[2],  a03 = a[3];
      const a10 = a[4], a11 = a[5], a12 = a[6],  a13 = a[7];
      const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      
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
      
      const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) return null;
      const invDet = 1.0 / det;
      
      out[0]  = ( a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      out[1]  = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      out[2]  = ( a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      out[3]  = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      out[4]  = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      out[5]  = ( a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      out[6]  = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      out[7]  = ( a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      out[8]  = ( a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      out[9]  = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      out[10] = ( a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      out[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      out[13] = ( a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      out[15] = ( a20 * b03 - a21 * b01 + a22 * b00) * invDet;
      return out;
    },
    
    transpose: function(out, a) {
      if (out === a) {
        let a01 = a[1], a02 = a[2], a03 = a[3];
        let a12 = a[6], a13 = a[7];
        let a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
      } else {
        out[0]  = a[0];  out[1]  = a[4];  out[2]  = a[8];  out[3]  = a[12];
        out[4]  = a[1];  out[5]  = a[5];  out[6]  = a[9];  out[7]  = a[13];
        out[8]  = a[2];  out[9]  = a[6];  out[10] = a[10]; out[11] = a[14];
        out[12] = a[3];  out[13] = a[7];  out[14] = a[11]; out[15] = a[15];
      }
      return out;
    },
    
    clone: function(a) {
      return new Float32Array(a);
    }
  };