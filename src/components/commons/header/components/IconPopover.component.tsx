import { Badge, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { ReactNode, SetStateAction } from 'react';

interface ComponentPopoverProps {
  content: ReactNode;
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  icon: ReactNode;
  placement: TooltipPlacement;
  total?: number;
}

export const ComponentPopover: React.FC<ComponentPopoverProps> = ({
  content,
  isOpen,
  setOpen,
  icon,
  placement,
  total = 0
}) => (
  <Popover
    
    rootClassName="popover-wrapper"
    placement={placement || 'bottom'}
    content={content}
    trigger="click"
    arrow={false}
    className="popover-notification cursor-pointer"
    overlayClassName="max-w-[45rem] max-h-[40rem] p-0"
    autoAdjustOverflow={false}
    open={isOpen}
    onOpenChange={(visible) => setOpen(visible)}
    
  >
    <Badge count={total}>{icon}</Badge>
  </Popover>
);
