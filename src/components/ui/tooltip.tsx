import { type ReactNode, useId } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

interface DasTooltipProps {
  children: ReactNode;
  content: ReactNode;
  place?: Placement;
  delayShow?: number;
  delayHide?: number;
  className?: string;
}

const DasTooltip = ({
  children,
  content,
  place = 'top',
  delayShow = 150,
  delayHide = 100,
  className = '',
}: DasTooltipProps) => {
  const id = useId();

  return (
    <>
      {/* Trigger */}
      <div data-tooltip-id={id} className="inline-flex w-fit">
        {children}
      </div>

      {/* Tooltip */}
      <Tooltip
        id={id}
        place={place}
        delayShow={delayShow}
        delayHide={delayHide}
        opacity={1}
        className={`
          z-50
          rounded-lg
          bg-zinc-900
          text-white
          text-xs
          px-3
          shadow-xl
          border
          border-white/10
          backdrop-blur-sm
          ${className}
        `}
        render={() =>
          typeof content === 'string' ? (
            <span>{content}</span>
          ) : (
            <div className="flex flex-col gap-1">{content}</div>
          )
        }
      />
    </>
  );
};

export default DasTooltip;
