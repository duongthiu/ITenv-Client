import { Tabs } from 'antd';
import Preview from './Preview';
import ITenvChat from './ITenvChat';
import './PreviewPanel.style.scss';
interface PreviewPanelProps {
  hasHtmlFiles: boolean;
  fileMap: Record<string, any>;
  mainHtmlPath: string | null;
  sandboxId: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ hasHtmlFiles, fileMap, mainHtmlPath, sandboxId }) => {
  const items = [
    {
      key: 'preview',
      label: 'Preview',
      children: <Preview fileMap={fileMap} mainHtmlPath={mainHtmlPath} />
    },
    {
      key: 'chat',
      label: 'ITenv Chat',
      children: <ITenvChat sandboxId={sandboxId} />
    }
  ];

  return (
    <Tabs
      type="card"
      defaultActiveKey={hasHtmlFiles ? 'preview' : 'sandboxResult'}
      items={items}
      className="preview-panel_wrapper h-full"
    />
  );
};

export default PreviewPanel;
