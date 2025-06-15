import type React from 'react';

import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bebas text-lg text-primary-text mb-4">Nunflix</h4>
            <p className="text-secondary-text text-sm">
              Nunflix is a free streaming website for movies and TV shows.
            </p>
          </div>
          <div>
            <h4 className="font-bebas text-lg text-primary-text mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dmca" className="text-secondary-text hover:text-primary-text text-sm">DMCA</Link></li>
              <li><Link to="/terms" className="text-secondary-text hover:text-primary-text text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-secondary-text hover:text-primary-text text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bebas text-lg text-primary-text mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="mailto:nunflix@proton.me" className="text-secondary-text hover:text-primary-text text-sm">nunflix@proton.me</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-secondary-text text-sm">
            © 2025 Nunflix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
