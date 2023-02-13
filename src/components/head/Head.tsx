import clsx from 'clsx';
import styles from './Head.module.scss';

export const QueueH1: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h1
      {...props}
      className={clsx(styles.H1, className)}
    >
      {children}
    </h1>
  );
};

export const QueueH2: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h2
      {...props}
      className={clsx(styles.H2, className)}
    >
      {children}
    </h2>
  );
};

export const QueueH3: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      {...props}
      className={clsx(styles.H3, className)}
    >
      {children}
    </h3>
  );
};

export const QueueH4: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h4
      {...props}
      className={clsx(styles.H4, className)}
    >
      {children}
    </h4>
  );
};

export const QueueH5: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h5
      {...props}
      className={clsx(styles.H5, className)}
    >
      {children}
    </h5>
  );
};

export const QueueH6: React.FC<React.BaseHTMLAttributes<HTMLHeadElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h6
      {...props}
      className={clsx(styles.H6, className)}
    >
      {children}
    </h6>
  );
};