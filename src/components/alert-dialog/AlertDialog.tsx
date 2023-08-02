import React, { forwardRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import styles from './AlertDialog.module.scss';
import { QueueButton } from 'components/button/Button';
import { QUEUE_UI_SIZE, QUEUE_UI_SIZES } from 'styles/ui/Size';
import { QUEUE_UI_COLOR, QUEUE_UI_COLORS } from 'styles/ui/Color';
import { useRootRenderer } from 'cdk/root-renderer/root-renderer';

export const QueueAlertDialogRoot = ({ children, ...props }: AlertDialog.AlertDialogProps) => {
  return <AlertDialog.Root {...props}>{children}</AlertDialog.Root>;
};

export const QueueAlertDialogPortal = ({ children, ...props }: AlertDialog.AlertDialogProps) => {
  return <AlertDialog.Portal {...props}>{children}</AlertDialog.Portal>;
};

export const QueueAlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  AlertDialog.AlertDialogOverlayProps
>(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Overlay ref={ref} {...props} className={clsx(styles.AlertDialogOverlay, className)}>
      {children}
    </AlertDialog.Overlay>
  );
});

export const QueueAlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialog.AlertDialogContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Content ref={ref} {...props} className={clsx(styles.AlertDialogContent, className)}>
      {children}
    </AlertDialog.Content>
  );
});

export const QueueAlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  AlertDialog.AlertDialogTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Title ref={ref} {...props} className={clsx(styles.AlertDialogTitle, className)}>
      {children}
    </AlertDialog.Title>
  );
});

export const QueueAlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDialog.AlertDialogDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <AlertDialog.Description ref={ref} {...props} className={clsx(styles.AlertDialogDescription, className)}>
      {children}
    </AlertDialog.Description>
  );
});

export interface QueueAlertDialogFooterProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const QueueAlertDialogFooter = forwardRef<
  HTMLDivElement,
  QueueAlertDialogFooterProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(styles.AlertDialogFooter, className)}>
      {children}
    </div>
  );
});

const QueueAlertDialog = {
  Root: QueueAlertDialogRoot,
  Portal: QueueAlertDialogPortal,
  Overlay: QueueAlertDialogOverlay,
  Title: QueueAlertDialogTitle,
  Content: QueueAlertDialogContent,
  Description: QueueAlertDialogDescription,
  Footer: QueueAlertDialogFooter,
};

export interface QueueAlertParams {
  /**
   * @description
   * Modal 의 헤더에 들어가는 내용
   */
  title: JSX.Element | string;

  /**
   * @description
   * Modal 의 본문에 들어가는 내용
   */
  description: JSX.Element | string;

  /**
   * @description
   * Modal 의 열림 여부가 변경될 때 호출되는 콜백 함수
   */
  onOpenChange?: (opened: boolean) => void;

  /**
   * @description
   * AlertDialog 하단에 들어갈 버튼들
   */
  buttons?: {
    /**
     * @description
     * 버튼의 라벨
     */
    label: string | JSX.Element;

    /**
     * @description
     * 버튼의 크기
     */
    size?: QUEUE_UI_SIZES;

    /**
     * @description
     * 버튼의 색상
     */
    color?: QUEUE_UI_COLORS;

    /**
     * @description
     * 버튼을 클릭했을 때 Dialog 가 닫힐 지 여부
     * @default true
     */
    closeOnClick?: boolean;

    /**
     * @description
     * 버튼을 클릭했을 때 호출되는 콜백 함수
     */
    onClick?: () => void;
  }[];
}

export const useAlertDialog = () => {
  const rootRenderer = useRootRenderer();

  return {
    open: (params: QueueAlertParams): string => {
      const key = rootRenderer.render(
        <QueueAlertDialog.Root
          open={true}
          defaultOpen={true}
          onOpenChange={(opened) => {
            !opened && rootRenderer.clear(key);
            params.onOpenChange?.(opened);
          }}
        >
          <QueueAlertDialog.Overlay />
          <QueueAlertDialog.Content asChild={false}>
            {params.title && (
              <QueueAlertDialog.Title>{params.title}</QueueAlertDialog.Title>
            )}
            {params.description && (
              <QueueAlertDialog.Description>{params.description}</QueueAlertDialog.Description>
            )}
            {params.buttons?.length && (
              <QueueAlertDialog.Footer>
                {params.buttons.map(({
                  closeOnClick = true,
                  ...button
                }, index) => (
                  <QueueButton
                    key={index}
                    size={button.size || QUEUE_UI_SIZE.MEDIUM}
                    color={button.color || QUEUE_UI_COLOR.BLUE}
                    onClick={() => {
                      button.onClick?.();
                      closeOnClick && rootRenderer.clear(key);
                    }}>
                    {button.label}
                  </QueueButton>
                ))}
              </QueueAlertDialog.Footer>
            )}
          </QueueAlertDialog.Content>
        </QueueAlertDialog.Root>
      );
      return key;
    },
    close: (key: string) => {
      rootRenderer.clear(key);
    },
  };
};
