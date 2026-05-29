import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from './types/navigation.types';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  compact?: boolean;
}

function buildDisplayItems(items: BreadcrumbItem[], compact: boolean): BreadcrumbItem[] {
  if (!compact || items.length <= 3) {
    return items;
  }

  const firstItem = items[0];
  const lastItem = items[items.length - 1];

  return [
    firstItem,
    { label: '…' },
    lastItem,
  ];
}

export default function Breadcrumbs({ items, compact = false }: BreadcrumbsProps) {
  const displayItems = useMemo(
    () => buildDisplayItems(items, compact),
    [compact, items],
  );

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Fil d'Ariane">
      <ol className={styles.list}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '…' && !item.to && !item.current;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li className={styles.separator} aria-hidden="true">
                  <svg
                    className={styles.separatorIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </li>
              )}
              <li className={styles.item}>
                {isEllipsis ? (
                  <span className={styles.ellipsis} aria-hidden="true">…</span>
                ) : item.current || isLast ? (
                  <span className={styles.current} aria-current="page">
                    {item.label}
                  </span>
                ) : item.to ? (
                  <Link className={styles.link} to={item.to}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.static}>{item.label}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
