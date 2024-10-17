/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor, Monaco } from '@monaco-editor/react';
import { Form, FormItemProps } from 'antd';
import { motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { THEME } from '../../redux/app/app.slice';
import { useAppSelector } from '../../redux/app/hook';
import { ProblemType } from '../../types/ProblemType';
import { LANG_VERSIONS, LangVersionType } from '../../utils/constants/codeLanguage';
import { CODE_TEMPLATES } from '../../utils/constants/codeTemplate';
import { cn } from '../../utils/helpers/cn';
import './CodeEditor.style.scss';
import Output from './Output';
import Problem from './Problem';
const DEFAULT_LANGUAGE = 'javascript';

interface CodeEditorType extends Omit<FormItemProps<any>, 'children'> {
  name?: FormItemProps['name'];
  defaultValue?: string;
  problem: ProblemType;
  containerClassName?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorType> = ({
  name,
  defaultValue,
  problem,
  containerClassName,
  className,
  ...passProps
}) => {
  const theme = useAppSelector((state) => state.app.theme);
  const editorRef = useRef(null);
  const mHeight = useMotionValue(400);
  const mWidth = useMotionValue(600);
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [language, setLanguage] = useState(LANG_VERSIONS[0]);

  const outputHeight = useMotionValue(window.innerHeight - 680);
  const [isWidthDragging, setWidthDragging] = useState(false);
  const [isHeightDragging, setHeightDragging] = useState(false);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = (newValue: any) => {
    setCode(newValue);
  };

  const handleSetLanguage = useCallback(
    (newLanguage: LangVersionType) => {
      setLanguage(newLanguage);
      const selectedCodeTemplate = CODE_TEMPLATES.find((template) => template.name === newLanguage.name);
      if (selectedCodeTemplate) {
        setCode(selectedCodeTemplate.code);
      }
    },
    [setLanguage, setCode]
  );

  const handleDragHeight = (event: any, info: any) => {
    const newHeight = mHeight.get() + info.delta.y;
    if (newHeight > 30 && newHeight < window.innerHeight - 100) {
      mHeight.set(newHeight);
      outputHeight.set(window.innerHeight - newHeight - 100);
    }
  };

  const handleDragWidth = (event: any, info: any) => {
    const newWidth = mWidth.get() - info.delta.x;
    if (newWidth > 20 && newWidth < 1200) {
      mWidth.set(newWidth);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const value = window.innerHeight - mHeight.get() - 280;
      outputHeight.set(value > 300 ? value : 300);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mHeight, outputHeight]);

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('OneDarkPro', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', foreground: 'ffffff', background: '282828' }],
      colors: {
        'editor.background': '#282828'
      }
    });
  };
  console.log(mHeight.get());
  return (
    <div style={{ height: 'calc(100vh-20px)' }} className="flex w-full justify-end">
      <motion.div className="b card h-[calc(100vh-60px)] flex-1 overflow-auto rounded-lg shadow-md">
        <Problem problem={problem} />
      </motion.div>
      <Form.Item
        name={name}
        style={{ maxHeight: 'calc(100vh-20px )' }}
        className={cn(containerClassName, 'mb-0 w-fit')}
      >
        <motion.div
          className="relative flex w-fit flex-col overflow-hidden"
          style={{ height: 'calc(100vh - 60px)' }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={cn(
              'card ml-2 max-w-full rounded-lg p-0 shadow-md',
              mWidth.get() < 30 && 'flex items-center justify-center'
            )}
          >
            <div className="flex items-center justify-between">
              {/* <LanguageSelector language={language} onSelect={handleSetLanguage} /> */}
            </div>
            <motion.div className={cn('py-3')} style={{ height: mHeight, width: mWidth }}>
              {mWidth.get() > 30 ? (
                <Editor
                  theme={theme === THEME.DARK ? 'OneDarkPro' : 'light'}
                  height="100%"
                  width="100%"
                  defaultLanguage={language.name || DEFAULT_LANGUAGE}
                  language={language.name}
                  defaultValue={defaultValue}
                  beforeMount={handleEditorDidMount}
                  onMount={handleMount}
                  value={code}
                  onChange={handleChange}
                  className={cn(className)}
                  {...passProps}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex rotate-90 items-center gap-5">
                    <IoCodeSlashOutline size={22} color="#21a1d3" />
                    <span className="font-semibold">Code</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              className="flex h-[5px] w-full cursor-row-resize items-center justify-center text-center"
              style={{
                lineHeight: '3px'
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={handleDragHeight}
              onDragStart={() => setHeightDragging(true)}
              onDragEnd={() => setHeightDragging(false)}
            >
              <div
                className={cn(
                  'flex h-[2px] w-full items-center justify-center hover:bg-blue-200',
                  isHeightDragging && 'bg-blue-200'
                )}
              >
                <div className="line h-[2px] w-[30px] rounded-sm"></div>
              </div>
            </motion.div>
          </div>
          <div className="absolute left-0 top-0 flex h-full items-center justify-center">
            <motion.div
              style={{
                lineHeight: '20px'
              }}
              className="flex h-full w-[8px] cursor-col-resize items-center justify-center text-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={handleDragWidth}
              onDragStart={() => setWidthDragging(true)}
              onDragEnd={() => setWidthDragging(false)}
            >
              <div
                className={cn(
                  'flex h-full w-[3px] items-center justify-center hover:bg-blue-200',
                  isWidthDragging && 'bg-blue-200'
                )}
              >
                <div className="line h-[30px] w-[3px] rounded-sm"></div>
              </div>
            </motion.div>
          </div>
          <div className="card ml-2 flex h-full max-w-full items-center justify-center rounded-lg p-5 shadow-md">
            <motion.div style={{ height: outputHeight, width: mWidth }} className="">
              {mWidth.get() < 30 ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex rotate-90 items-center gap-5">
                    <IoCodeSlashOutline size={22} color="#21a1d3" />
                    <span className="font-semibold">Code</span>
                  </div>
                </div>
              ) : (
                <Output language={language} editorRef={editorRef} />
              )}
            </motion.div>
          </div>
        </motion.div>
      </Form.Item>
    </div>
  );
};

export default CodeEditor;
