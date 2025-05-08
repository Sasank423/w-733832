
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-8">
      <div className="container-layout">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-purple-dark">
                ImageGenHub
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Your community hub for creating, sharing, and interacting with the best memes on the internet.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/create" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    Create Meme
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition duration-300">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} ImageGenHub. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            {/* Social media links here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
