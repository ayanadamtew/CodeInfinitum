import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiChevronRight } from "react-icons/fi"; // Example social icons

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 ease-in-out flex items-center"
    >
      <FiChevronRight className="w-3 h-3 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-0 -translate-x-1" />
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-slate-400 hover:text-indigo-400 transition-all duration-200 ease-in-out transform hover:scale-110"
  >
    <Icon size={22} />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const resources = [
    { to: "/problems", label: "Problems" },
    { to: "/topics", label: "Topics" },
    { to: "/tutorials", label: "Tutorials" }, // Assuming /tutorials is a valid route
  ];

  const company = [
    { to: "/problems", label: "Problems" }, // Assuming /project
    { to: "/topics", label: "Topics" }, // Assuming /topics
    { to: "/about", label: "About Us" }, // Assuming /about
    { to: "/contact", label: "Contact" }, // Assuming /contact
    // { to: "/privacy", label: "Privacy Policy" }, // Assuming /privacy
  ];

  const socialLinks = [
    { href: "https://github.com/ayanadamtew", icon: FiGithub, label: "GitHub" },
    { href: "https://twitter.com/ayuda0117", icon: FiTwitter, label: "Twitter" },
    { href: "https://linkedin.com/ayanadamtew", icon: FiLinkedin, label: "LinkedIn" },
    { href: "https://instagram.com/a_yu.da", icon: FiInstagram, label: "Instagram" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                CodeInfinitum
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Elevate your coding skills through consistent practice and community support.
            </p>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-base font-semibold text-slate-100 mb-5 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-base font-semibold text-slate-100 mb-5 tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>
          
          {/* Connect Column */}
          <div className="md:col-start-3 lg:col-start-4">
            <h3 className="text-base font-semibold text-slate-100 mb-5 tracking-wider uppercase">
              Connect With Us
            </h3>
            <div className="flex space-x-5 mb-6">
              {socialLinks.map((social) => (
                <SocialLink key={social.label} href={social.href} icon={social.icon} label={social.label} />
              ))}
            </div>
            <p className="text-sm text-slate-400">
                Stay updated with the latest challenges and features.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-500">
            © {currentYear} LeetCoder. All rights reserved. Built with
            <span role="img" aria-label="love" className="mx-1"> ❤️ </span>
            and passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;