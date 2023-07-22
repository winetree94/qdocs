export interface RightPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hello?: 'world';
}

export const RightPanel = ({ hello, ...props }: RightPanelProps) => {
  return <div {...props}>우측 패널임</div>;
};
