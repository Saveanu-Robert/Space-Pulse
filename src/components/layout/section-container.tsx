'use client';

import { motion } from 'framer-motion';
import { MOTION } from '@/lib/config/constants';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ id, children, className }: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      className={cn('py-8 md:py-12 scroll-mt-20', className)}
      {...MOTION.sectionEntry}
    >
      {children}
    </motion.section>
  );
}
