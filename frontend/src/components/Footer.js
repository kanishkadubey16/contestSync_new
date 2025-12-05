import React, { useState } from "react";

const Footer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Feedback from ${formData.name}`;
    const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0A%0AMessage:%0A${formData.message}`;
    window.open(
      `mailto:kanishka.dubey2024@nst.rishihood.edu.in?subject=${subject}&body=${body}`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 dark:border-gray-600 pb-2">Quick Links</h3>
          <nav className="flex flex-col space-y-3">
            <a href="/" className="text-white dark:text-gray-300 hover:text-gray-400 dark:hover:text-blue-400 transition-colors text-base font-medium cursor-pointer">
              Home
            </a>
            <a href="/dashboard" className="text-white dark:text-gray-300 hover:text-gray-400 dark:hover:text-blue-400 transition-colors text-base font-medium cursor-pointer">
              Contests
            </a>
            <a href="/dashboard?tab=history" className="text-white dark:text-gray-300 hover:text-gray-400 dark:hover:text-blue-400 transition-colors text-base font-medium cursor-pointer">
              History
            </a>
            <a href="/admin" className="text-white dark:text-gray-300 hover:text-gray-400 dark:hover:text-blue-400 transition-colors text-base font-medium cursor-pointer">
              Admin Panel
            </a>
          </nav>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 dark:border-gray-600 pb-2">Contact</h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 rounded bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 uppercase tracking-wide text-sm drop-shadow-md whitespace-nowrap"
            >
              Send Feedback
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 dark:border-gray-600 pb-2">Connect</h3>
          <div className="flex space-x-4 mt-4">
            {/* Email Icon */}
            <a
              href="mailto:kanishka.dubey2024@nst.rishihood.edu.in"
              className="bg-gray-800 dark:bg-gray-900 p-4 rounded-full hover:bg-indigo-600 dark:hover:bg-blue-600 transition-colors shadow-lg dark:shadow-xl"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M1.5 4.5h21v15h-21v-15zm10.5 7.5l10.5-7.5h-21l10.5 7.5z" />
              </svg>
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/kanishka-dubey-3b6b29316"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 dark:bg-gray-900 p-4 rounded-full hover:bg-indigo-600 dark:hover:bg-blue-600 transition-colors shadow-lg dark:shadow-xl"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5-1.37 0-2.49-1.12-2.49-2.5C.01 2.12 1.13 1 2.5 1 3.87 1 4.98 2.12 4.98 3.5zM.5 24V7h4.97v17H.5zM7.5 7h4.77v2.33h.07c.66-1.25 2.27-2.57 4.67-2.57 5 0 5.93 3.29 5.93 7.57V24H18v-7.91c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.17V24H7.5V7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 dark:border-gray-700 pt-6 text-center text-gray-400 dark:text-gray-500 text-sm select-none">
        © ContestSync – Built with <span role="img" aria-label="heart">❤️</span>
      </div>
    </footer>
  );
};

export default Footer;