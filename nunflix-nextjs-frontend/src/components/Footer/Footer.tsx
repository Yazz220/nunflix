import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css'; // Assuming CSS Modules

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footer_text}>
          Learn More about the #SaveWarriorNun campaign at{' '}
          <a href="https://www.warriornun.com/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            warriornun.com
          </a>
        </p>
        <div className={styles.footerLinks}>
          <Link href="/dmca" legacyBehavior><a>DMCA</a></Link>
          <Link href="/privacy" legacyBehavior><a>Privacy Policy</a></Link>
          <Link href="/terms" legacyBehavior><a>Terms of Service</a></Link>
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} Nunflix. All Rights Reserved. (This is a fictional site)
        </p>
      </div>
    </footer>
  );
};

export default Footer;