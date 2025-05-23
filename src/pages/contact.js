import Head from "next/head";
import { useState } from "react";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		try {
			// Create email body
			const emailBody = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;

			// Create mailto link
			const mailtoLink = `mailto:aarushaga@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
			
			// Open default email client
			window.location.href = mailtoLink;
			
			setSubmitStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#1D1E21]">
			<Head>
				<title>Contact | Aarush Agarwal</title>
				<meta
					name="description"
					content="Get in touch with Aarush Agarwal - Let's discuss AI, machine learning, or potential collaborations"
				/>
				<link rel="icon" href="/images/profile-pic.png" />
				<link rel="apple-touch-icon" href="/images/profile-pic.png" />
			</Head>

			<main className="max-w-2xl mx-auto px-6 py-16">
				{/* Header Section */}
				<section className="mb-16">
					<h1 className="text-4xl font-bold text-white mb-4">
						Get In Touch
					</h1>
					<p className="text-xl text-gray-300 mb-8">
						Let&apos;s discuss AI, machine learning, research opportunities, or potential collaborations.
					</p>
				</section>

				{/* Contact Form - Centered and Full Width */}
				<div className="w-full">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
								Name *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								placeholder="Your full name"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
								Email *
							</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								placeholder="your.email@example.com"
							/>
						</div>

						<div>
							<label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
								Subject *
							</label>
							<input
								type="text"
								id="subject"
								name="subject"
								required
								value={formData.subject}
								onChange={handleChange}
								className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								placeholder="What's this about?"
							/>
						</div>

						<div>
							<label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
								Message *
							</label>
							<textarea
								id="message"
								name="message"
								required
								rows="6"
								value={formData.message}
								onChange={handleChange}
								className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical"
								placeholder="Tell me about your project, question, or how we can collaborate..."
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Opening Email Client...
								</>
							) : (
								<>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									Send Message
								</>
							)}
						</button>

						{submitStatus === "success" && (
							<div className="p-4 bg-green-800/30 border border-green-600 rounded-md">
								<p className="text-green-400 text-sm">
									Email client opened! Please send the message from your email application.
								</p>
							</div>
						)}

						{submitStatus === "error" && (
							<div className="p-4 bg-red-800/30 border border-red-600 rounded-md">
								<p className="text-red-400 text-sm">
									Something went wrong. You can email me directly at aarushaga@gmail.com
								</p>
							</div>
						)}
					</form>
				</div>

				{/* What I'm Looking For Section */}
				<section className="mt-16">
					<h2 className="text-2xl font-bold text-white mb-6">What I&apos;m Interested In</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
							<h3 className="text-lg font-semibold text-white mb-3">Research Collaborations</h3>
							<p className="text-gray-300 text-sm">
								High-performance computing, CUDA optimization, machine learning for physics applications.
							</p>
						</div>
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
							<h3 className="text-lg font-semibold text-white mb-3">Industry Projects</h3>
							<p className="text-gray-300 text-sm">
								ML engineering, AI infrastructure, optimization problems, and practical AI applications.
							</p>
						</div>
						<div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
							<h3 className="text-lg font-semibold text-white mb-3">Mentorship & Learning</h3>
							<p className="text-gray-300 text-sm">
								Happy to discuss career paths, share experiences, or mentor aspiring AI engineers.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
} 