// client/src/pages/ContactPage.js
"use client";

import React, { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import api from '../service/api'; // Uncomment if you have a backend endpoint for form submission

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({}); // For field-specific errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    setValidationErrors({}); // Clear previous validation errors

    try {
      // Backend endpoint is /api/contact/submit
      const response = await api.post('/contact/submit', formData);
      setSubmitStatus({ type: 'success', message: response.data.message || 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from express-validator
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.path] = err.msg; // 'path' is used by express-validator v7+
                                          // for older versions, it might be 'param'
        });
        setValidationErrors(fieldErrors);
        setSubmitStatus({ type: 'error', message: 'Please correct the errors below.' });
      } else {
        setSubmitStatus({ type: 'error', message: error.response?.data?.message || 'Failed to send message. Please try again.' });
      }
      console.error("Contact form submission error:", error.response || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <FiMail className="mx-auto text-indigo-400 h-16 w-16 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Have questions, feedback, or just want to say hello? We'd love to
            hear from you!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <section className="p-6 bg-slate-800 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-600 bg-slate-700 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-400"
                  placeholder="Full Name"
                />
                {validationErrors.name && <p className="mt-1 text-xs text-red-400">{validationErrors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-600 bg-slate-700 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-400"
                  placeholder="you@example.com"
                />
                 {validationErrors.email && <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-600 bg-slate-700 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-400"
                  placeholder="Regarding..."
                />
                 {validationErrors.subject && <p className="mt-1 text-xs text-red-400">{validationErrors.subject}</p>}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-600 bg-slate-700 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-400"
                  placeholder="Your message here..."
                ></textarea>
                 {validationErrors.message && <p className="mt-1 text-xs text-red-400">{validationErrors.message}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2 h-5 w-5" /> Send Message
                    </>
                  )}
                </button>
              </div>
              {submitStatus.message && (
                <p
                  className={`mt-4 text-sm text-center ${
                    submitStatus.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {submitStatus.message}
                </p>
              )}
            </form>
          </section>

          {/* Contact Info */}
          <section className="p-6 bg-slate-800 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-6">
              Our Contact Information
            </h2>
            <div className="space-y-6 text-slate-300">
              <div className="flex items-start">
                <FiMail className="flex-shrink-0 h-6 w-6 text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-100">Email Us</h3>
                  <a
                    href="mailto:support@yourplatform.com"
                    className="hover:text-indigo-300 break-all"
                  >
                    support@LeetCoder.com
                  </a>
                  <p className="text-sm text-slate-400">
                    For general inquiries and support.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiPhone className="flex-shrink-0 h-6 w-6 text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-100">Call Us </h3>
                  <a href="tel:+1234567890" className="hover:text-indigo-300">
                    +251 973395537
                  </a>{" "}
                  <br />
                  <a href="tel:+1234567890" className="hover:text-indigo-300">
                    +251 927082152
                  </a>
                  {/* <p className="text-sm text-slate-400">24/7</p> */}
                </div>
              </div>
              {/* <div className="flex items-start">
                <FiMapPin className="flex-shrink-0 h-6 w-6 text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-100">Our Office </h3>
                  <p>123 Coding Lane<br />Tech City, TC 54321<br />United States</p>
                  <p className="text-sm text-slate-400">Please schedule an appointment before visiting.</p>
                </div>
              </div> */}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {/* Replace with your actual social media links and icons */}
                <a
                  href="https://x.com/ayuda0117"
                  target="_blank"
                  className="text-slate-400 hover:text-indigo-300"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    {/* Twitter Icon Example */}
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/ayanadamtew"
                  target="_blank"
                  className="text-slate-400 hover:text-indigo-300"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/a_yu.da"
                  target="_blank"
                  className="text-slate-400 hover:text-indigo-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.7v2.2h.1c.5-.9 1.8-1.9 3.6-1.9 3.8 0 4.5 2.4 4.5 5.5V24h-4v-8.6c0-2-.04-4.6-3-4.6s-3.5 2.2-3.5 4.4V24h-4V8z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/ayanadamtew"
                  target="_blank"
                  className="text-slate-400 hover:text-indigo-300"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
    0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
    -.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.084-.729.084-.729
    1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998
    .108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93
    0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 
    1.005-.322 3.3 1.23a11.52 11.52 0 013.005-.405c1.02.005 
    2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23
    .645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22
    0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
    0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 
    21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </a>

                {/* Add more social icons here */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
