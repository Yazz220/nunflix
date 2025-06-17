import React from 'react';
import Link from 'next/link';
import styles from './DropdownPanel.module.css';

export interface DropdownLink {
  name: string;
  href: string;
}

interface DropdownPanelProps {
  title: string;
  items: DropdownLink[];
  isOpen?: boolean; // Added isOpen prop
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onLinkClick?: () => void; // To close dropdown when a link is clicked
}

const DropdownPanel: React.FC<DropdownPanelProps> = ({
  title,
  items,
  isOpen, // Destructure isOpen
  onMouseEnter,
  onMouseLeave,
  onLinkClick
}) => {
  return (
    <div
      className={`${styles.dropdownPanel} ${isOpen ? styles.open : ''}`} // Conditionally apply open class
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className={styles.dropdownTitle}>{title}</h3>
      <div className={styles.dropdownGrid}>
        {items.map((item) => (
          <Link key={item.name} href={item.href}>
            <span className={styles.dropdownItem} onClick={onLinkClick}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownPanel;