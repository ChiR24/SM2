declare module 'framer-motion' {
  import * as React from 'react';

  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    mode?: "sync" | "wait" | "popLayout";
    initial?: boolean;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    presenceAffectsLayout?: boolean;
  }

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    variants?: any;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const motion: {
    [key: string]: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<any>>;
  };

  export const AnimatePresence: React.FC<AnimatePresenceProps>;

  export function useSpring(
    initial: number,
    config?: {
      stiffness?: number;
      damping?: number;
      mass?: number;
      velocity?: number;
      restSpeed?: number;
      restDelta?: number;
    }
  ): {
    set: (value: number) => void;
    get: () => number;
  };
}
