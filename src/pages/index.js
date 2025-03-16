import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { useState, useEffect } from 'react';

export default function Home({ projects, posts }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run Three.js code on the client side
    if (!isMounted) return;

    // Create an async function to load Three.js
    const loadThreeJS = async () => {
      try {
        // Use dynamic import with proper error handling
        const THREE = await import('three');
        
        // Import OrbitControls only if needed
        let OrbitControls;
        try {
          const OrbitControlsModule = await import('three/examples/jsm/controls/OrbitControls');
          OrbitControls = OrbitControlsModule.OrbitControls;
        } catch (err) {
          console.log('OrbitControls not loaded, continuing without it');
        }
        
        // Create scene
        const scene = new THREE.Scene();
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75, 
          window.innerWidth / window.innerHeight, 
          0.1, 
          1000
        );
        camera.position.z = 5;
        
        // Create renderer
        const container = document.getElementById('computer-container');
        if (!container) return;
        
        const renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create laptop model with simple geometry
        const laptopGroup = new THREE.Group();
        
        // Laptop base (thinner for MacBook-like appearance)
        const baseGeometry = new THREE.BoxGeometry(2.2, 0.08, 1.6);
        const baseMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x1a1a1a // Darker gray for MacBook
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        
        // Rounded corners for base
        const roundedRectBase = new THREE.Shape();
        roundedRectBase.moveTo(-1.1, -0.8);
        roundedRectBase.lineTo(1.1, -0.8);
        roundedRectBase.lineTo(1.1, 0.8);
        roundedRectBase.lineTo(-1.1, 0.8);
        roundedRectBase.lineTo(-1.1, -0.8);
        
        // MacBook logo on the cover
        const logoGeometry = new THREE.PlaneGeometry(0.3, 0.3);
        const logoMaterial = new THREE.MeshBasicMaterial({
          color: 0x4cc9f0,
          transparent: true,
          opacity: 0.8
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.y = 0.05;
        logo.position.z = -0.2;
        logo.rotation.x = Math.PI / 2;
        base.add(logo);
        
        // Laptop screen (thinner for MacBook-like appearance)
        const screenGeometry = new THREE.BoxGeometry(2.2, 1.4, 0.08);
        const screenBorderMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x1a1a1a // Darker gray for MacBook
        });
        const screen = new THREE.Mesh(screenGeometry, screenBorderMaterial);
        screen.position.y = 0.7;
        screen.position.z = -0.8;
        screen.rotation.x = -Math.PI / 6; // Tilt the screen
        
        // Screen display with bezel (thinner bezels for modern MacBook)
        const displayGeometry = new THREE.PlaneGeometry(2.1, 1.3);
        const displayMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x0f1118, // Dark screen
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.z = 0.045;
        screen.add(display);
        
        // MacBook camera notch
        const notchGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.02);
        const notchMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const notch = new THREE.Mesh(notchGeometry, notchMaterial);
        notch.position.y = 0.65;
        notch.position.z = 0.046;
        display.add(notch);
        
        // Screen content - code editor style
        const codeEditorGeometry = new THREE.PlaneGeometry(2.0, 1.2);
        const codeEditorMaterial = new THREE.MeshBasicMaterial({
          color: 0x1e1e2d, // Editor background
        });
        const codeEditor = new THREE.Mesh(codeEditorGeometry, codeEditorMaterial);
        codeEditor.position.z = 0.001;
        display.add(codeEditor);
        
        // Create code lines
        const createCodeLine = (y, width, color) => {
          const lineGeometry = new THREE.PlaneGeometry(width, 0.02);
          const lineMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
          });
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          line.position.y = y;
          line.position.z = 0.002;
          line.position.x = -0.8 + (width / 2);
          return line;
        };
        
        // Add code lines to editor
        for (let i = 0; i < 12; i++) {
          const lineWidth = 0.6 + Math.random() * 0.8;
          const lineColor = Math.random() > 0.7 ? 0x4cc9f0 : 0x6e56cf;
          const line = createCodeLine(0.5 - (i * 0.08), lineWidth, lineColor);
          codeEditor.add(line);
        }
        
        // Keyboard with Touch Bar
        const keyboardGeometry = new THREE.PlaneGeometry(2.0, 1.4);
        const keyboardMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x1a1a1a // Darker gray for MacBook
        });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.y = 0.041;
        keyboard.position.z = 0.3;
        keyboard.rotation.x = -Math.PI / 2;
        base.add(keyboard);
        
        // Create key rows
        const createKeyRow = (z, numKeys, width, height) => {
          const rowGroup = new THREE.Group();
          const keySpacing = width / numKeys;
          
          for (let i = 0; i < numKeys; i++) {
            const keyGeometry = new THREE.PlaneGeometry(keySpacing * 0.8, height);
            const keyMaterial = new THREE.MeshBasicMaterial({
              color: 0x2a2a2a,
              transparent: true,
              opacity: 0.9
            });
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.x = (i * keySpacing) - (width / 2) + (keySpacing / 2);
            key.position.z = 0.001;
            rowGroup.add(key);
          }
          
          rowGroup.position.z = z;
          return rowGroup;
        };
        
        // Add keyboard rows
        const row1 = createKeyRow(0.5, 12, 1.9, 0.1);
        const row2 = createKeyRow(0.35, 11, 1.8, 0.1); 
        const row3 = createKeyRow(0.2, 10, 1.7, 0.1);
        const row4 = createKeyRow(0.05, 9, 1.6, 0.1);
        
        // Touchbar
        const touchbarGeometry = new THREE.PlaneGeometry(1.0, 0.04);
        const touchbarMaterial = new THREE.MeshBasicMaterial({
          color: 0x2a2a2a,
          transparent: true,
          opacity: 0.9
        });
        const touchbar = new THREE.Mesh(touchbarGeometry, touchbarMaterial);
        touchbar.position.z = 0.7;
        touchbar.position.y = 0.001;
        
        // Trackpad
        const trackpadGeometry = new THREE.PlaneGeometry(0.8, 0.5);
        const trackpadMaterial = new THREE.MeshBasicMaterial({
          color: 0x2d2d2d,
          transparent: true,
          opacity: 0.95
        });
        const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
        trackpad.position.z = -0.2;
        trackpad.position.y = 0.001;
        
        // Add all keyboard elements
        keyboard.add(row1);
        keyboard.add(row2);
        keyboard.add(row3);
        keyboard.add(row4);
        keyboard.add(touchbar);
        keyboard.add(trackpad);
        
        // Add parts to laptop group
        laptopGroup.add(base);
        laptopGroup.add(screen);
        
        // Create glowing edges for laptop
        const edges = new THREE.EdgesGeometry(baseGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ 
          color: 0x4cc9f0,
          transparent: true,
          opacity: 0.5
        });
        const baseLines = new THREE.LineSegments(edges, edgesMaterial);
        base.add(baseLines);
        
        const screenEdges = new THREE.EdgesGeometry(screenGeometry);
        const screenLines = new THREE.LineSegments(screenEdges, edgesMaterial);
        screen.add(screenLines);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        
        // Add directional light
        const light1 = new THREE.DirectionalLight(0x4cc9f0, 1);
        light1.position.set(1, 1, 1);
        scene.add(light1);
        
        const light2 = new THREE.DirectionalLight(0x6e56cf, 1);
        light2.position.set(-1, -1, -1);
        scene.add(light2);
        
        // Add the laptop to the scene
        scene.add(laptopGroup);
        
        // Position the laptop
        laptopGroup.position.y = -0.5;
        
        // Animation function
        const animate = () => {
          if (!container) return;
          
          requestAnimationFrame(animate);
          
          // Rotate the laptop
          laptopGroup.rotation.y += 0.005;
          
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
        
        // Clean up function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (container && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          
          // Dispose of geometries and materials
          baseGeometry.dispose();
          baseMaterial.dispose();
          screenGeometry.dispose();
          screenBorderMaterial.dispose();
          displayGeometry.dispose();
          displayMaterial.dispose();
          keyboardGeometry.dispose();
          keyboardMaterial.dispose();
          edges.dispose();
          edgesMaterial.dispose();
          screenEdges.dispose();
          
          // Cancel animation frame if needed
          if (window.requestAnimationFrameId) {
            cancelAnimationFrame(window.requestAnimationFrameId);
          }
        };
      } catch (error) {
        console.error('Error loading Three.js:', error);
        // Fallback to simple SVG version if Three.js fails to load
        const container = document.getElementById('computer-container');
        if (container) {
          container.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" class="w-full h-full opacity-20">
              <g transform="translate(350, 250) scale(1.8)">
                <polygon points="120,280 180,280 170,300 130,300" fill="#4cc9f0" opacity="0.8" />
                <rect x="145" y="260" width="10" height="20" fill="#6e56cf" opacity="0.7" />
                <polygon points="140,260 160,260 170,220 130,220" fill="#6e56cf" opacity="0.6" />
                <rect x="80" y="100" width="140" height="120" rx="5" fill="#1e1e2d" />
                <rect x="90" y="110" width="120" height="100" fill="#0f1118" />
                <g fill="#4cc9f0" opacity="0.8">
                  <rect x="100" y="120" width="100" height="2" />
                  <rect x="100" y="130" width="80" height="2" />
                  <rect x="100" y="140" width="90" height="2" />
                  <rect x="110" y="150" width="70" height="2" />
                  <rect x="110" y="160" width="60" height="2" />
                  <rect x="100" y="170" width="90" height="2" />
                  <rect x="100" y="180" width="70" height="2" />
                  <rect x="100" y="190" width="100" height="2" />
                </g>
                <rect x="90" y="230" width="120" height="20" rx="3" fill="#1e1e2d" />
                <rect x="95" y="235" width="110" height="10" rx="2" fill="#0f1118" />
                <ellipse cx="230" cy="240" rx="10" ry="15" fill="#1e1e2d" />
              </g>
            </svg>
          `;
        }
      }
    };
    
    // Load Three.js
    loadThreeJS();
  }, [isMounted]); // Only run when the component is mounted
  
  return (
    <div className="min-h-screen bg-[#0f1118]">
      <Head>
        <title>Aarush Agarwal - Personal Website</title>
        <meta name="description" content="Personal website showcasing projects and blog posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#080a12]">
          {/* Three.js Computer Container - Positioned behind the text */}
          <div className="absolute inset-0 z-10" id="computer-container"></div>
          
          {/* Particle effect overlay */}
          <div className="absolute inset-0 z-20 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#6e56cf" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#080a12" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-gradient)" />
              
              {/* Grid lines */}
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke="#4cc9f0" strokeWidth="0.5" />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#4cc9f0" strokeWidth="0.5" />
                ))}
              </g>
              
              {/* Random dots as "particles" */}
              {[...Array(50)].map((_, i) => (
                <circle 
                  key={`p-${i}`} 
                  cx={Math.random() * 100 + "%"} 
                  cy={Math.random() * 100 + "%"} 
                  r={Math.random() * 2 + 1}
                  fill="#4cc9f0"
                  opacity={Math.random() * 0.5 + 0.2}
                />
              ))}
            </svg>
          </div>
          
          <div className="container relative z-30 px-4 mx-auto text-center">
            <motion.h1 
              className="mb-6 text-5xl font-bold text-[#f0f0f0] uppercase tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AARUSH AGARWAL
            </motion.h1>
            <motion.p 
              className="max-w-lg mx-auto mb-10 text-xl text-[#a0a0a0] uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Software Engineer & Problem Solver
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="#projects" className="px-6 py-3 mt-6 text-[#080a12] bg-[#4cc9f0] rounded-lg hover:bg-[#6e56cf] transition-colors duration-300 inline-block font-medium">
                View My Work
              </a>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-[#080a12] relative">
          {/* Grid background - extended throughout the section */}
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line key={`ph-${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke="#4cc9f0" strokeWidth="0.5" />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line key={`pv-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#4cc9f0" strokeWidth="0.5" />
                ))}
              </g>
              
              {/* Random dots as "particles" */}
              {[...Array(30)].map((_, i) => (
                <circle 
                  key={`pp-${i}`} 
                  cx={Math.random() * 100 + "%"} 
                  cy={Math.random() * 100 + "%"} 
                  r={Math.random() * 2 + 1}
                  fill="#4cc9f0"
                  opacity={Math.random() * 0.5 + 0.2}
                />
              ))}
            </svg>
          </div>
          
          <div className="container relative z-10 px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[#f0f0f0] uppercase">Projects</h2>
              <Link href="/projects" className="px-4 py-2 text-[#4cc9f0] transition-colors duration-300 border border-[#4cc9f0] rounded-lg hover:bg-[#4cc9f0] hover:text-[#080a12] uppercase">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects && projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-[#0f1118] relative">
          {/* Grid background - extended throughout the section */}
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2">
                {[...Array(20)].map((_, i) => (
                  <line key={`bh-${i}`} x1="0" y1={i * 30} x2="100%" y2={i * 30} stroke="#6e56cf" strokeWidth="0.5" />
                ))}
                {[...Array(30)].map((_, i) => (
                  <line key={`bv-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#6e56cf" strokeWidth="0.5" />
                ))}
              </g>
              
              {/* Random dots as "particles" */}
              {[...Array(30)].map((_, i) => (
                <circle 
                  key={`bp-${i}`} 
                  cx={Math.random() * 100 + "%"} 
                  cy={Math.random() * 100 + "%"} 
                  r={Math.random() * 2 + 1}
                  fill="#6e56cf"
                  opacity={Math.random() * 0.5 + 0.2}
                />
              ))}
            </svg>
          </div>
          
          <div className="container relative z-10 px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[#f0f0f0]">Latest Posts</h2>
              <Link href="/blog" className="px-4 py-2 text-[#6e56cf] transition-colors duration-300 border border-[#6e56cf] rounded-lg hover:bg-[#6e56cf] hover:text-[#f0f0f0]">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts && posts.slice(0, 2).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="p-6 transition-transform duration-300 bg-[#1e1e2d] rounded-lg shadow-md border border-[#4cc9f030] hover:border-[#6e56cf] hover:shadow-[0_10px_30px_rgba(110,86,207,0.15)] hover:-translate-y-1">
                    <h3 className="mb-3 text-xl font-semibold text-[#f0f0f0]">{post.title}</h3>
                    <p className="mb-4 text-[#a0a0a0]">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-[#a0a0a0]">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
    // Get files from the projects directory
    const projectFiles = fs.readdirSync(path.join(process.cwd(), 'src/content/projects'));
  
    // Get slug and frontmatter from markdown files
    const projects = projectFiles.map(filename => {
      // Create id from filename
      const id = filename.replace('.md', '');
      
      // Read markdown file as string
      const markdownWithMeta = fs.readFileSync(
        path.join(process.cwd(), 'src/content/projects', filename),
        'utf-8'
      );
      
      // Parse markdown frontmatter
      const { data: frontmatter } = matter(markdownWithMeta);
      
      // Return id and data
      return {
        id,
        title: frontmatter.title,
        description: frontmatter.description,
        image: frontmatter.image,
        github: frontmatter.github,
        demo: frontmatter.demo,
        technologies: frontmatter.technologies
      };
    });

  const posts = [
    {
      slug: 'first-post',
      title: 'My First Blog Post',
      excerpt: 'This is a summary of my first blog post.',
      date: '2023-01-01',
      readingTime: 4
    },
    // Add more posts
  ];

  return {
    props: {
      projects,
      posts
    },
    revalidate: 60 // Revalidate at most once per minute
  };
}