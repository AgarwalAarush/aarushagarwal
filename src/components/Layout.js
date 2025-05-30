import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Layout({ children }) {
	const [currentTime, setCurrentTime] = useState("");

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const easternTime = now.toLocaleTimeString("en-US", {
				timeZone: "America/New_York",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false
			});
			setCurrentTime(easternTime);
		};

		// Update immediately
		updateTime();
		
		// Update every minute
		const interval = setInterval(updateTime, 60000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex min-h-screen bg-[#1D1E21]">
			<Navbar />
			{/* Main content area with left margin for desktop sidebar */}
			<div className="flex-1 md:ml-64 min-h-screen bg-[#1D1E21]">
				{/* Add top padding for mobile header */}
				<main className="flex-grow pt-16 md:pt-0">{children}</main>
				<footer className="py-8 bg-[#1D1E21] relative">
					<motion.div
						className="max-w-4xl mx-auto px-6 relative z-10"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
							<div className="text-left">
								<p className="text-white font-semibold">Currently working</p>
								<div className="flex items-center gap-2 mt-1">
									<Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
										Reach out →
									</Link>
								</div>
							</div>
							
							<div className="text-right">
								<p suppressHydrationWarning={true} className="text-white text-3xl font-bold">
									{currentTime}
								</p>
								<p className="text-gray-400">
									New York City, USA
								</p>
							</div>
						</div>
					</motion.div>
				</footer>
			</div>
		</div>
	);
}