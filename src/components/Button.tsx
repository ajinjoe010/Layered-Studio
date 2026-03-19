import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../utils/cn';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-grey-dark text-white hover:bg-grey-medium',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border border-grey-dark/20 bg-transparent hover:bg-grey-dark/5 text-grey-dark',
      ghost: 'bg-transparent hover:bg-grey-dark/5 text-grey-dark',
    };

    const sizes = {
      sm: 'px-6 py-2 text-xs uppercase tracking-widest font-bold',
      md: 'px-8 py-3 text-xs uppercase tracking-widest font-bold',
      lg: 'px-10 py-4 text-xs uppercase tracking-widest font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
