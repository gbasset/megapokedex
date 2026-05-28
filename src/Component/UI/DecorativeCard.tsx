import { CSSProperties, ReactNode } from 'react';
import styles from './DecorativeCard.module.css';

type DecorativeCardPattern = 'cornerCircle' | 'pokeball';

interface DecorativeCardProps {
  children: ReactNode;
  color: string;
  className?: string;
  contentClassName?: string;
  pattern?: DecorativeCardPattern;
}

export default function DecorativeCard({
  children,
  color,
  className = '',
  contentClassName = '',
  pattern = 'cornerCircle',
}: DecorativeCardProps) {
  const cardClassName = [
    styles.decorativeCard,
    pattern === 'pokeball' ? styles.pokeballPattern : styles.cornerCirclePattern,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section
      className={cardClassName}
      style={{ '--card-color': color } as CSSProperties}
    >
      <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>{children}</div>
    </section>
  );
}
