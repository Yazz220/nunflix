import React, { useState, ReactNode } from 'react';
import styles from './DropdownPanel.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export interface DropdownPanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  startOpen?: boolean;
}

const DropdownPanel: React.FC<DropdownPanelProps> = ({ title, icon, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.panel}>
      <button className={styles.header} onClick={toggleOpen}>
        <div className={styles.titleContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h3 className={styles.title}>{title}</h3>
        </div>
        <span className={styles.chevron}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownPanel;
