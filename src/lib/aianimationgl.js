export function initAIAnimation(container) {
	if (!container) return null;

	// Create and insert the canvas element
	const canvas = document.createElement("canvas");
	canvas.id = "glcanvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	container.appendChild(canvas);

	// Get WebGL context
	const gl =
		canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!gl) {
		alert("WebGL is not supported on this browser.");
		return null;
	}

	// --------------------------------------------------------------------------------
	// SHADERS
	// --------------------------------------------------------------------------------

	// Vertex shader
	// Enhanced for brighter colors, better edge definition, and wave-like connectivity
	const vsSource = `
    precision highp float;

    // Attributes
    attribute vec3 aInitialPosition;
    attribute vec4 aSeed; // random seed for noise & color variations

    // Uniforms
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform float uTime;

    // Varying to fragment shader
    varying vec4 vColor;

    // --- Simplified noise functions for better WebGL 1.0 compatibility ---
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }
    // Simplified 3D noise
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0)) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857; // 1.0/7.0
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    // --- End noise functions ---

    // Connection noise - creates the wave-like connection pattern
    float connectionNoise(vec3 pos, float time) {
      float scale = 2.5;
      float speed = 0.3;
      return snoise(vec3(pos.x * scale, pos.y * scale, pos.z * scale + time * speed));
    }

    void main() {
      // Start with the original position
      vec3 pos = aInitialPosition;
      float dist = length(pos);
      
      // Calculate normalized position for edge effects
      float normDist = dist / 0.7;  // 0.7 is the RADIUS
      
      // Edge intensity factor - stronger effect near the edge
      float edgeFactor = smoothstep(0.8, 1.0, normDist);
      
      // Swirl motion based on noise with stronger effect near edges
      vec3 seedDir = normalize(aSeed.xyz - 0.5);
      float freq = 1.5 + aSeed.w * 4.0;
      float noiseVal = snoise(seedDir * freq + vec3(uTime * 0.5));
      
      // Connection noise for wave-like patterns
      float connVal = connectionNoise(pos, uTime);
      
      // Apply reduced swirl with better cohesion
      float swirlAmplitude = 0.12 + edgeFactor * 0.05; // Reduced by ~50%
      pos += noiseVal * swirlAmplitude * seedDir;
      
      // Enhanced wave-like offset with stronger connectivity between points
      // Using slower frequency and higher connection influence
      float connectionStrength = 5.0; // Increased from 3.0
      float waveAmplitude = 0.025; // Reduced from 0.05
      vec3 waveOffset;
      waveOffset.x = sin(uTime * 1.0 + pos.x * 5.0 + connVal * connectionStrength) * waveAmplitude;
      waveOffset.y = sin(uTime * 1.0 + pos.y * 5.0 + connVal * connectionStrength) * waveAmplitude;
      waveOffset.z = sin(uTime * 1.0 + pos.z * 5.0 + connVal * connectionStrength) * waveAmplitude;
      
      // Apply stronger wave effect near edges
      pos += waveOffset * (1.0 + edgeFactor * 0.5);

      // Transform to clip space
      vec4 worldPos = vec4(pos, 1.0);
      vec4 viewPos = uViewMatrix * worldPos;
      gl_Position = uProjectionMatrix * viewPos;
      
      // Set point size - larger near edges for better definition
      gl_PointSize = 1.5 + edgeFactor * 0.8;

      // Enhanced color gradient: vibrant purple-blue transition
      float gradientFactor = (aInitialPosition.x / 0.7 + 1.0) / 2.0; // 0 to 1
      
      // Even brighter, more blue-dominant colors
      vec3 colorLeft = vec3(0.7, 0.3, 1.0);   // deeper blue-purple 
      vec3 colorMid  = vec3(0.3, 0.5, 1.0);   // intense blue
      vec3 colorRight = vec3(0.4, 0.8, 1.0);  // blue-cyan
      
      vec3 baseColor;
      if (gradientFactor < 0.5) {
        baseColor = mix(colorLeft, colorMid, gradientFactor * 2.0);
      } else {
        baseColor = mix(colorMid, colorRight, (gradientFactor - 0.5) * 2.0);
      }
      
      // Enhanced edge glow effect - make edges even brighter with blue emphasis
      baseColor += vec3(0.1, 0.15, 0.4) * edgeFactor;
      
      // Add a subtle darkening in some areas for more contrast
      float darkZone = snoise(pos * 2.0 + uTime * 0.2) * 0.5 + 0.5;
      if (darkZone < 0.4) {
        // Create some darker areas for contrast
        baseColor *= 0.7 + (darkZone * 0.75);
      } else if (darkZone > 0.7) {
        // Create some extra bright areas
        baseColor = mix(baseColor, vec3(0.8, 0.9, 1.0), (darkZone - 0.7) * 0.8);
      }
      
      // Add subtle random variation from seed
      vec3 randomOffset = (aSeed.xyz - 0.5) * 0.1;
      baseColor += randomOffset;
      baseColor = clamp(baseColor, 0.0, 1.0);
      
      // Enhanced flicker effect tied to connection noise - more dramatic
      float flicker = 0.6 + 0.4 * (noiseVal + connVal) * 0.5;
      baseColor *= flicker;
      
      // Assign final color
      vColor = vec4(baseColor, 1.0);
    }
  `;

	// Fragment shader - enhanced for brighter points with better edge glow and blue emphasis
	const fsSource = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
      // Creating soft circular points with intense center
      vec2 coord = gl_PointCoord - 0.5;
      float len = length(coord);
      
      // Create more intense center with smoother falloff
      float alpha = smoothstep(0.5, 0.25, len);
      
      // Boost brightness at center with blue emphasis
      vec3 color = vColor.rgb;
      if (len < 0.25) {
        // More intense blue boost in center
        float boost = (0.25 - len) * 2.0;
        color += vec3(boost * 0.6, boost * 0.8, boost) * 0.5; 
      }
      
      // Apply slight darkening at outer edges for more contrast
      if (len > 0.35) {
        float darkness = (len - 0.35) * 1.5;
        color *= max(1.0 - darkness, 0.7);
      }
      
      gl_FragColor = vec4(min(color, vec3(1.0)), vColor.a * alpha);
    }
  `;

	// --------------------------------------------------------------------------------
	// COMPILE & LINK SHADERS
	// --------------------------------------------------------------------------------
	function compileShader(gl, source, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const shaderType =
				type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
			console.error(`${shaderType} SHADER COMPILATION ERROR:`);
			console.error(gl.getShaderInfoLog(shader));
			const sourceLines = source.split("\n");
			console.error("First 10 lines of shader source:");
			for (let i = 0; i < Math.min(10, sourceLines.length); i++) {
				console.error(`${i + 1}: ${sourceLines[i]}`);
			}
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

	if (!vertexShader || !fragmentShader) {
		console.error(
			"Failed to compile shaders, cannot continue with WebGL animation"
		);
		return null;
	}

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error(
			"Unable to initialize the shader program:",
			gl.getProgramInfoLog(shaderProgram)
		);
		return null;
	}
	gl.useProgram(shaderProgram);

	// Get attribute/uniform locations
	const programInfo = {
		attribLocations: {
			initialPosition: gl.getAttribLocation(
				shaderProgram,
				"aInitialPosition"
			),
			seed: gl.getAttribLocation(shaderProgram, "aSeed"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(
				shaderProgram,
				"uProjectionMatrix"
			),
			viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
			time: gl.getUniformLocation(shaderProgram, "uTime"),
		},
	};

	// --------------------------------------------------------------------------------
	// CONFIGURABLE PARAMETERS
	// --------------------------------------------------------------------------------
	const EDGE_DENSITY_FACTOR = 5.0; // Controls concentration at edges (1.0-10.0)
	const NUM_POINTS = 20000; // Increased for even better edge density
	const RADIUS = 0.7;

	// Set up clusters near the visual silhouette
	const NUM_CLUSTERS = 4;
	const clusterCenters = [];
	for (let c = 0; c < NUM_CLUSTERS; c++) {
		// Place clusters around the equator (perpendicular to view direction)
		// This ensures they appear at the edges of the 2D projection
		const theta = (c / NUM_CLUSTERS) * 2 * Math.PI;
		const phi = Math.PI / 2; // Equator
		const r = RADIUS * 0.95; // Very close to surface
		const cx = r * Math.sin(phi) * Math.cos(theta);
		const cy = r * Math.cos(phi);
		const cz = r * Math.sin(phi) * Math.sin(theta);
		clusterCenters.push([cx, cy, cz]);
	}

	const positions = new Float32Array(NUM_POINTS * 3);
	const seeds = new Float32Array(NUM_POINTS * 4);

	// Helper function to calculate if a point will appear at the edge of the 2D projection
	// With adjustable strictness based on EDGE_DENSITY_FACTOR
	function isAtVisualEdge(x, y, z, radius) {
		// For a point to appear at the edge of a 2D projection:
		// - It should be near the sphere surface
		// - Its Z coordinate (view direction) should be close to 0
		//   (meaning it's perpendicular to the viewing direction)
		const distFromCenter = Math.sqrt(x * x + y * y + z * z);
		const normalizedZ = Math.abs(z) / distFromCenter;

		// The higher the EDGE_DENSITY_FACTOR, the stricter we are about edge placement
		// When factor is high, we only accept points very close to perfect edge
		const edgeThreshold = 0.35 / (1 + EDGE_DENSITY_FACTOR * 0.1);
		const radiusThreshold = radius * (0.8 - EDGE_DENSITY_FACTOR * 0.01);

		return distFromCenter > radiusThreshold && normalizedZ < edgeThreshold;
	}

	for (let i = 0; i < NUM_POINTS; i++) {
		// 20% chance of being in a cluster
		let inCluster = Math.random() < 0.2;
		let x, y, z;
		let attempts = 0;

		if (inCluster) {
			const clusterIndex = Math.floor(Math.random() * NUM_CLUSTERS);
			const center = clusterCenters[clusterIndex];
			const cr = 0.08; // Tighter clusters
			let rx = (Math.random() - 0.5) * cr;
			let ry = (Math.random() - 0.5) * cr;
			let rz = (Math.random() - 0.5) * cr;
			x = center[0] + rx;
			y = center[1] + ry;
			z = center[2] + rz;
		} else {
			// Create a torus-like distribution that concentrates points around the visual edge
			// of the sphere when projected to 2D - with enhanced edge density

			// Try more attempts based on edge density factor
			do {
				const u = Math.random();
				// Push points very close to surface
				const radial = (0.9 + 0.1 * Math.pow(u, 0.4)) * RADIUS;
				const theta = Math.random() * 2.0 * Math.PI;

				// Stronger bias phi toward the equator (90 degrees) to create the edge effect
				// This makes more points appear around the "silhouette" of the sphere
				const rand = Math.random();
				// Increase the exponent based on EDGE_DENSITY_FACTOR for stronger edge bias
				const equatorBias = 1.5 + EDGE_DENSITY_FACTOR * 0.3;
				const phiBias = Math.pow(rand, equatorBias);
				// Narrow the range toward equator for higher concentration
				const phiRange = Math.PI / (2.0 + EDGE_DENSITY_FACTOR * 0.3);
				const phi = Math.PI / 2 + (phiBias * 2 - 1) * phiRange;

				const sinPhi = Math.sin(phi);
				const cosPhi = Math.cos(phi);
				x = radial * sinPhi * Math.cos(theta);
				y = radial * cosPhi;
				z = radial * sinPhi * Math.sin(theta);

				attempts++;
				// More attempts for higher edge density, up to reasonable limit
			} while (
				!isAtVisualEdge(x, y, z, RADIUS) &&
				attempts < 3 + Math.min(EDGE_DENSITY_FACTOR, 10)
			);

			// If we couldn't find a good point after a few attempts, just use the last one
			// (This prevents infinite loops while still favoring edge points)
		}
		const idx3 = i * 3;
		positions[idx3 + 0] = x;
		positions[idx3 + 1] = y;
		positions[idx3 + 2] = z;
		const idx4 = i * 4;
		seeds[idx4 + 0] = Math.random();
		seeds[idx4 + 1] = Math.random();
		seeds[idx4 + 2] = Math.random();
		seeds[idx4 + 3] = Math.random();
	}

	// Create and bind buffers
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	const seedBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		programInfo.attribLocations.initialPosition,
		3,
		gl.FLOAT,
		false,
		0,
		0
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.initialPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
	gl.vertexAttribPointer(
		programInfo.attribLocations.seed,
		4,
		gl.FLOAT,
		false,
		0,
		0
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.seed);

	// --------------------------------------------------------------------------------
	// MATRICES (View / Projection)
	// --------------------------------------------------------------------------------
	function perspectiveMatrix(fovy, aspect, near, far) {
		const out = new Float32Array(16);
		const f = 1.0 / Math.tan(fovy / 2);
		const nf = 1 / (near - far);
		out[0] = f / aspect;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = f;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[10] = (far + near) * nf;
		out[11] = -1;
		out[12] = 0;
		out[13] = 0;
		out[14] = 2 * far * near * nf;
		out[15] = 0;
		return out;
	}
	function createViewMatrix(angle) {
		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);
		const out = new Float32Array([
			cosA,
			0,
			sinA,
			0,
			0,
			1,
			0,
			0,
			-sinA,
			0,
			cosA,
			0,
			0,
			0,
			-3.0,
			1,
		]);
		return out;
	}

	// --------------------------------------------------------------------------------
	// RENDER LOOP
	// --------------------------------------------------------------------------------
	let previousTime = 0;
	let angle = 0;

	// Enable additive blending for brighter, more vibrant points
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending for brighter effect

	function render(now) {
		now *= 0.001;
		const deltaTime = now - previousTime;
		previousTime = now;
		angle += deltaTime * 0.1; // Even slower rotation for better cohesion visibility

		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.disable(gl.DEPTH_TEST);

		const aspect = canvas.width / canvas.height;
		const projectionMatrix = perspectiveMatrix(
			(45.0 * Math.PI) / 180.0,
			aspect,
			0.1,
			100.0
		);
		const viewMatrix = createViewMatrix(angle);

		gl.useProgram(shaderProgram);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix
		);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.viewMatrix,
			false,
			viewMatrix
		);
		gl.uniform1f(programInfo.uniformLocations.time, now);

		gl.drawArrays(gl.POINTS, 0, NUM_POINTS);
		requestAnimationFrame(render);
	}

	const animationId = requestAnimationFrame(render);

	function handleResize() {
		// Store previous dimensions
		const prevWidth = canvas.width;
		const prevHeight = canvas.height;
		
		// Get new dimensions
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;
		
		// Only update if dimensions changed significantly (prevents resize during mobile scroll)
		// The 5% threshold ignores minor changes that happen during mobile scrolling
		const widthDiff = Math.abs(newWidth - prevWidth) / prevWidth;
		const heightDiff = Math.abs(newHeight - prevHeight) / prevHeight;
		
		if (widthDiff > 0.05 || heightDiff > 0.05) {
			canvas.width = newWidth;
			canvas.height = newHeight;
		}
	}
	
	// Use orientationchange for major layout changes instead of resize for minor scroll adjustments
	window.addEventListener("orientationchange", handleResize);
	window.addEventListener("resize", handleResize);

	return function cleanup() {
		cancelAnimationFrame(animationId);
		window.removeEventListener("resize", handleResize);
		if (container.contains(canvas)) {
			container.removeChild(canvas);
		}
	};
}
