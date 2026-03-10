import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PageWrapper({ children, title, subtitle }: Props) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-gray-medium)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
}
