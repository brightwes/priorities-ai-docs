import React from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

const SECONDARY_LINKS = [
  { label: 'Get started',    to: '/start/quickstart' },
  { label: 'Concepts',       to: '/concepts/glossary' },
  { label: 'Guides',         to: '/guides/run-headless-session' },
  { label: 'API reference',  to: '/api' },
  { label: 'Integrations',   to: '/integrations' },
  { label: 'Reference',      to: '/reference/errors' },
];

export default function NavbarWrapper(props: object): React.ReactElement {
  const { pathname } = useLocation();

  return (
    <>
      <OriginalNavbar {...props} />
      <nav className={styles.secondaryNav} aria-label="Topic navigation">
        <div className={styles.secondaryInner}>
          <ul className={styles.secondaryList}>
            {SECONDARY_LINKS.map(({ label, to }) => {
              const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`${styles.secondaryLink} ${isActive ? styles.active : ''}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.secondaryRight}>
            <a
              href="https://priorities.ai/changelog"
              className={styles.secondaryLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Changelog
            </a>
            <a
              href="https://priorities.ai/support"
              className={styles.secondaryLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Help ↗
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
