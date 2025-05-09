
import React, { useRef, useEffect } from 'react';

interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
    [key: string]: any;
  };
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ children, initial, animate, exit, transition, className, style, ...props }, ref) => {
      const elementRef = useRef<HTMLDivElement>(null);
      const combinedRef = (node: HTMLDivElement) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };

      useEffect(() => {
        if (elementRef.current && animate) {
          const element = elementRef.current;
          const animateStyles = {
            ...animate,
            transition: transition ? 
              `all ${transition.duration || 0.3}s ${transition.ease || 'ease'} ${transition.delay || 0}s` : 
              'all 0.3s ease'
          };
          
          Object.entries(animateStyles).forEach(([key, value]) => {
            if (key !== 'transition') {
              element.style[key as any] = value as string;
            } else {
              element.style.transition = value as string;
            }
          });
        }
      }, [animate, transition]);

      useEffect(() => {
        if (elementRef.current && initial) {
          const element = elementRef.current;
          Object.entries(initial).forEach(([key, value]) => {
            element.style[key as any] = value as string;
          });
        }
      }, []);

      return (
        <div
          ref={combinedRef}
          className={className}
          style={{
            ...style,
            ...(initial || {})
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
  ),
  
  span: React.forwardRef<HTMLSpanElement, MotionProps & React.HTMLAttributes<HTMLSpanElement>>(
    ({ children, initial, animate, exit, transition, className, style, ...props }, ref) => {
      const elementRef = useRef<HTMLSpanElement>(null);
      const combinedRef = (node: HTMLSpanElement) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };

      useEffect(() => {
        if (elementRef.current && animate) {
          const element = elementRef.current;
          const animateStyles = {
            ...animate,
            transition: transition ? 
              `all ${transition.duration || 0.3}s ${transition.ease || 'ease'} ${transition.delay || 0}s` : 
              'all 0.3s ease'
          };
          
          Object.entries(animateStyles).forEach(([key, value]) => {
            if (key !== 'transition') {
              element.style[key as any] = value as string;
            } else {
              element.style.transition = value as string;
            }
          });
        }
      }, [animate, transition]);

      useEffect(() => {
        if (elementRef.current && initial) {
          const element = elementRef.current;
          Object.entries(initial).forEach(([key, value]) => {
            element.style[key as any] = value as string;
          });
        }
      }, []);

      return (
        <span
          ref={combinedRef}
          className={className}
          style={{
            ...style,
            ...(initial || {})
          }}
          {...props}
        >
          {children}
        </span>
      );
    }
  )
};

export const AnimatePresence: React.FC<{
  initial?: boolean;
  children: React.ReactNode;
}> = ({ children, initial = true }) => {
  return <>{children}</>;
};

export default motion;
