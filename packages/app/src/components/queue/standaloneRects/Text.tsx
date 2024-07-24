import { StandaloneTextObject } from '@legacy/model/standalone-object';
import { memo } from 'react';

export const StandaloneText = memo(
  ({ rect, rotate, fade, scale, text }: StandaloneTextObject) => {
    if (!text) {
      return null;
    }

    const verticalAlign =
      text.verticalAlign === 'middle'
        ? 'center'
        : text.verticalAlign === 'top'
          ? 'flex-start'
          : 'flex-end';

    const textAlign =
      text.horizontalAlign === 'center'
        ? 'center'
        : text.horizontalAlign === 'left'
          ? 'left'
          : 'right';

    return (
      <div
        className="tw-absolute tw-flex"
        style={{
          alignItems: verticalAlign,
          fontFamily: text.fontFamily,
          top: `${rect.y}px`,
          left: `${rect.x}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          transformOrigin: 'center center',
          transform: `rotate(${rotate.degree}deg) scale(${scale.scale})`,
          opacity: `${fade.opacity}`,
        }}>
        <div
          className="tw-relative tw-inline-block tw-text-center tw-w-full tw-outline-none tw-break-all"
          style={{
            textAlign: textAlign,
            fontFamily: text.fontFamily,
            color: text.fontColor,
            fontSize: text.fontSize,
          }}
          dangerouslySetInnerHTML={{ __html: text.text }}></div>
      </div>
    );
  },
);
