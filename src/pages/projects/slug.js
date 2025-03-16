import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProjectDetail({ project }) {
  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <Head>
        <title>{project.title} | Your Name</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="container px-4 mx-auto">
        <Link 
          href="/projects"
          className="inline-flex items-center mb-8 text-purple-700 hover:text-purple-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div 
            className="relative w-full overflow-hidden rounded-lg shadow-lg aspect-video"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-purple-100">
                <span className="text-purple-600">No Image Available</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="mb-4 text-3xl font-bold text-gray-800">{project.title}</h1>
            <p className="mb-6 text-lg text-gray-600">{project.description}</p>
            
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 font-medium text-white transition-colors duration-300 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                View on GitHub
              </a>
              {project.demo && (
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 font-medium text-white transition-colors duration-300 bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Project Details</h2>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="mb-4">
              This is where you would provide more detailed information about your project.
              Discuss challenges you faced, solutions you implemented, and what you learned.
              This section could be quite lengthy and include multiple paragraphs.
            </p>
            <p className="mb-4">
              You might want to talk about the architecture of your application, why you chose
              certain technologies, and how different components interact with each other.
            </p>
            <p>
              Don&apos;t forget to mention any notable features or functionality that set this
              project apart from others. This is your chance to really showcase your skills
              and thought process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // In a real implementation, these would come from an API or file system
  const projects = [
    { id: 'project-1' },
    { id: 'project-2' },
    { id: 'project-3' },
    { id: 'project-4' },
    { id: 'project-5' },
    { id: 'project-6' },
  ];

  const paths = projects.map((project) => ({
    params: { slug: project.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  // In a real implementation, this would fetch from an API or file system
  const projectData = {
    'project-1': {
      id: 'project-1',
      title: 'E-commerce Platform',
      description: 'A full-featured online store with cart, checkout, and payment integration.',
      image: '/images/project1.jpg',
      github: 'https://github.com/yourusername/ecommerce',
      demo: 'https://ecommerce-demo.vercel.app',
      technologies: ['React', 'Next.js', 'Stripe', 'MongoDB']
    },
    'project-2': {
      id: 'project-2',
      title: 'Task Management App',
      description: 'A productivity app for managing tasks with drag-and-drop organization.',
      image: '/images/project2.jpg',
      github: 'https://github.com/yourusername/task-manager',
      demo: 'https://task-app-demo.vercel.app',
      technologies: ['React', 'Redux', 'Firebase', 'Tailwind CSS']
    },
    // Add more projects
  };

  const project = projectData[params.slug] || null;

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
    },
    revalidate: 60, // Revalidate at most once per minute
  };
}