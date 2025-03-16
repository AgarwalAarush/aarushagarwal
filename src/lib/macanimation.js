import * as THREE from 'three';

/**
 * Create and animate a realistic M1 MacBook model using Three.js
 * @param {HTMLElement} container - DOM element to render the animation
 * @returns {Function} - Cleanup function to dispose resources
 */
export const initMacbookAnimation = async (container) => {
  if (!container) return () => {};
  
  try {
    // Scene setup
    const scene = new THREE.Scene();
    
    // SCALE FACTOR - increased from 4 to 8
    const SCALE = 8;
    
    // Camera setup - adjusted for much larger model
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 40; // Moved farther back for the larger model
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Main group for the entire laptop
    const laptopGroup = new THREE.Group();
    
    // ==========================================
    // STEP 1: Create the base WITHOUT rotation
    // ==========================================
    
    // Base dimensions
    const baseWidth = 2.2 * SCALE;
    const baseHeight = 0.05 * SCALE;
    const baseDepth = 1.6 * SCALE;
    const baseCornerRadius = 0.1 * SCALE;
    
    // Simple BoxGeometry for the base (simpler to work with)
    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x303030, // Space gray
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 0.5,
      clearcoat: 0.3,
      opacity: 1.0, 
      transparent: false
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    
    // Add base to laptop group
    laptopGroup.add(base);
    
    // ==========================================
    // STEP 2: Create keyboard that lies flat on the base
    // ==========================================
    
    // Keyboard dimensions
    const keyboardWidth = baseWidth * 0.9;
    const keyboardDepth = baseDepth * 0.85;
    const keyboardHeight = 0.001 * SCALE; // Very thin
    
    // Create keyboard as a box (not a plane)
    const keyboardGeometry = new THREE.BoxGeometry(keyboardWidth, keyboardHeight, keyboardDepth);
    const keyboardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a2a,
      metalness: 0.6,
      roughness: 0.3,
      opacity: 1.0,
      transparent: false
    });
    
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    
    // Position keyboard on top of the base (Y is up)
    keyboard.position.y = baseHeight/2 + keyboardHeight/2 + 0.001 * SCALE;
    
    // Add keyboard to base
    base.add(keyboard);
    
    // ==========================================
    // STEP 3: Create keys that lie flat on the keyboard
    // ==========================================
    
    // Function to create key rows
    const createKeyRow = (zOffset, numKeys, rowWidth) => {
      const row = new THREE.Group();
      const keySpacing = rowWidth / numKeys;
      
      // Define key dimensions
      const keyWidth = keySpacing * 0.8;
      const keyHeight = 0.01 * SCALE; // Key height (thickness)
      const keyDepth = keySpacing * 0.6; // Key depth (front to back)
      
      for (let i = 0; i < numKeys; i++) {
        // Create key with BoxGeometry
        const keyGeometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
        const keyMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x1a1a1a,
          metalness: 0.7,
          roughness: 0.3,
          opacity: 1.0,
          transparent: false
        });
        
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        
        // Position key in row
        key.position.x = (i * keySpacing) - (rowWidth / 2) + (keySpacing / 2);
        key.position.y = keyHeight / 2; // Half height above keyboard
        
        row.add(key);
      }
      
      // Position row on keyboard
      row.position.z = zOffset;
      return row;
    };
    
    // Create key rows (in keyboard's coordinate system)
    const rowSpacing = keyboardDepth / 5;
    
    const rowWidth1 = keyboardWidth * 0.95;
    const rowWidth2 = keyboardWidth * 0.9;
    const rowWidth3 = keyboardWidth * 0.85;
    const rowWidth4 = keyboardWidth * 0.8;
    
    const row1 = createKeyRow(keyboardDepth * 0.35, 12, rowWidth1);
    const row2 = createKeyRow(keyboardDepth * 0.15, 11, rowWidth2);
    const row3 = createKeyRow(keyboardDepth * -0.05, 10, rowWidth3);
    const row4 = createKeyRow(keyboardDepth * -0.25, 9, rowWidth4);
    
    // Add rows to keyboard
    keyboard.add(row1);
    keyboard.add(row2);
    keyboard.add(row3);
    keyboard.add(row4);
    
    // ==========================================
    // STEP 4: Create trackpad that lies flat on the keyboard
    // ==========================================
    
    // Trackpad dimensions
    const trackpadWidth = keyboardWidth * 0.4;
    const trackpadDepth = rowSpacing * 2;
    const trackpadHeight = 0.005 * SCALE; // Very thin
    
    // Create trackpad with BoxGeometry
    const trackpadGeometry = new THREE.BoxGeometry(trackpadWidth, trackpadHeight, trackpadDepth);
    const trackpadMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1d1d1d,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.5,
      opacity: 1.0,
      transparent: false
    });
    
    const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    
    // Position trackpad on keyboard
    trackpad.position.z = keyboardDepth * -0.45; // Lower on Z axis
    trackpad.position.y = trackpadHeight / 2; // Half height above keyboard
    
    // Add trackpad to keyboard
    keyboard.add(trackpad);
    
    // ==========================================
    // STEP 5: Create screen that covers entire width
    // ==========================================
    
    // Screen dimensions (exactly matching base width)
    const screenWidth = baseWidth;
    const screenHeight = 1.5 * SCALE;
    const screenThickness = 0.05 * SCALE;
    
    // Create screen
    const screenGeometry = new THREE.BoxGeometry(screenWidth, screenHeight, screenThickness);
    const screenMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x303030,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 0.5,
      clearcoat: 0.3,
      opacity: 1.0,
      transparent: false
    });
    
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    
    // Move pivot to bottom edge for proper rotation
    screenGeometry.translate(0, screenHeight/2, 0);
    
    // Position screen precisely at the back edge of base
    screen.position.set(0, baseHeight, -baseDepth/2);
    
    // Set screen tilt angle
    screen.rotation.x = -Math.PI / 6;
    
    // Add screen to laptop group
    laptopGroup.add(screen);
    
    // ==========================================
    // STEP 6: Create display on screen
    // ==========================================
    
    // Load screen texture
    const textureLoader = new THREE.TextureLoader();
    let screenLoaded = false;
    
    // Function to create display with texture or code editor
    const createDisplay = (texture = null) => {
      // Display dimensions (slightly smaller than screen for bezel)
      const displayWidth = screenWidth * 0.96;
      const displayHeight = screenHeight * 0.94;
    
      // Create display plane
      const displayGeometry = new THREE.PlaneGeometry(displayWidth, displayHeight);
    
      // Create material based on whether we have a texture
      const displayMaterial = texture 
        ? new THREE.MeshBasicMaterial({ 
            map: texture,
            opacity: 1.0,
            transparent: false
          }) 
        : new THREE.MeshBasicMaterial({ 
            color: 0x0f1118, // Dark background
            opacity: 1.0,
            transparent: false
          });
    
      const display = new THREE.Mesh(displayGeometry, displayMaterial);
    
      // Position display precisely on screen face:
      display.position.z = screenThickness / 2 + 0.002 * SCALE;
      display.position.y = screenHeight / 2; // Reposition higher to align with the laptop screen back
    
      // Add to screen
      screen.add(display);
    
      // Add camera notch
      const notchWidth = 0.1 * SCALE;
      const notchHeight = 0.02 * SCALE;
      const notchGeometry = new THREE.BoxGeometry(notchWidth, notchHeight, 0.01 * SCALE);
      const notchMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        opacity: 1.0,
        transparent: false
      });
      const notch = new THREE.Mesh(notchGeometry, notchMaterial);
      notch.position.y = displayHeight / 2 - notchHeight / 2 - 0.02 * SCALE;
      notch.position.z = 0.001 * SCALE;
      display.add(notch);
    
      // If no texture, add code editor content
      if (!texture) {
        createCodeEditorContent(display, displayWidth, displayHeight);
      }
      
      return display;
    };
    
    // Function to create code editor content
    const createCodeEditorContent = (display, displayWidth, displayHeight) => {
      // Create editor background
      const editorWidth = displayWidth * 0.94;
      const editorHeight = displayHeight * 0.94;
      const editorGeometry = new THREE.PlaneGeometry(editorWidth, editorHeight);
      const editorMaterial = new THREE.MeshBasicMaterial({
        color: 0x1e1e2d, // Editor background
        opacity: 1.0,
        transparent: false
      });
      
      const editor = new THREE.Mesh(editorGeometry, editorMaterial);
      editor.position.z = 0.002 * SCALE;
      display.add(editor);
      
      // Add more code lines with higher contrast
      for (let i = 0; i < 16; i++) {
        // Variable width lines
        const lineWidth = (0.8 + Math.random() * 0.6) * SCALE;
        const lineHeight = 0.05 * SCALE; // Taller, more visible lines
        const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineHeight);
        
        // Alternate between bright purple and cyan
        const lineColor = i % 2 === 0 ? 0x9d7bff : 0x4cc9f0;
        
        const lineMaterial = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0.95
        });
        
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        
        // Position lines evenly from top to bottom
        const topOffset = editorHeight * 0.46;
        const spacing = editorHeight / 18;
        line.position.y = topOffset - (i * spacing);
        
        // Indent lines for code style
        const indent = Math.floor(i / 3) * 0.2 * SCALE;
        line.position.x = -editorWidth * 0.42 + indent + (lineWidth / 2);
        
        // Ensure line is in front of editor
        line.position.z = 0.003 * SCALE;
        editor.add(line);
      }
    };
    
    // Try to load the screen image
    textureLoader.load(
      '/images/screen.png',
      
      // Success callback
      (texture) => {
        console.log('Screen image loaded successfully');
        screenLoaded = true;
        createDisplay(texture);
      },
      
      // Progress callback
      undefined,
      
      // Error callback - fallback to code editor
      (error) => {
        console.warn('Failed to load screen image:', error);
        if (!screenLoaded) {
          createDisplay(); // Create display with code editor
        }
      }
    );
    
    // ==========================================
    // STEP 7: Add improved lighting
    // ==========================================
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(1, 1, 1);
    scene.add(mainLight);
    
    // Cyan accent light
    const cyanLight = new THREE.DirectionalLight(0x4cc9f0, 1.0);
    cyanLight.position.set(-1, 0.5, -0.5);
    scene.add(cyanLight);
    
    // Purple accent light
    const purpleLight = new THREE.DirectionalLight(0x9d7bff, 0.8);
    purpleLight.position.set(0, -1, 0);
    scene.add(purpleLight);
    
    // ==========================================
    // STEP 8: Position and animate laptop
    // ==========================================
    
    // Add laptop group to scene
    scene.add(laptopGroup);
    
    // Position laptop in scene - lower for the larger model
    laptopGroup.position.y = -0.5 * SCALE;
    
    // Animation function
    const animate = () => {
      if (!container) return;
      
      const animationId = requestAnimationFrame(animate);
      window.requestAnimationFrameId = animationId;
      
      // Gentle rotation of the laptop
      laptopGroup.rotation.y += 0.003;
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      [baseGeometry, screenGeometry, keyboardGeometry, trackpadGeometry].forEach(geo => {
        if (geo) geo.dispose();
      });
      
      [baseMaterial, screenMaterial, keyboardMaterial, trackpadMaterial].forEach(mat => {
        if (mat) mat.dispose();
      });
      
      // Cancel animation frame
      if (window.requestAnimationFrameId) {
        cancelAnimationFrame(window.requestAnimationFrameId);
      }
    };
  } catch (error) {
    console.error('Error loading MacBook animation:', error);
    // Fallback to simple SVG version if Three.js fails to load
    if (container) {
      container.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" class="w-full h-full opacity-80">
          <g transform="translate(350, 250) scale(10)">
            <rect x="80" y="280" width="140" height="5" rx="2" fill="#303030" />
            <rect x="80" y="100" width="140" height="180" rx="5" fill="#303030" />
            <rect x="85" y="105" width="130" height="170" rx="2" fill="#1e1e2d" />
            <rect x="85" y="105" width="130" height="3" fill="#000000" />
            <rect x="145" y="106" width="10" height="1" fill="#121212" />
            <g fill="#9d7bff" opacity="0.95">
              <rect x="100" y="120" width="100" height="4" />
              <rect x="100" y="130" width="80" height="4" />
              <rect x="100" y="140" width="90" height="4" />
              <rect x="110" y="150" width="70" height="4" />
              <rect x="110" y="160" width="60" height="4" />
              <rect x="100" y="170" width="90" height="4" />
              <rect x="100" y="180" width="70" height="4" />
              <rect x="100" y="190" width="100" height="4" />
            </g>
          </g>
        </svg>
      `;
    }
    return () => {};
  }
};