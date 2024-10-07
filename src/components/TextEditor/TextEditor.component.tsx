import { Editor } from '@tinymce/tinymce-react';
import { Skeleton } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { THEME } from '../../redux/app/app.slice';
import { useAppSelector } from '../../redux/app/hook';
import { RootState } from '../../redux/store';
import './TextEditor.style.scss';
import { ImageType } from '../../types/common';
type TextEditorProps = {
  content: string;
  setContent: (content: any, editor: any) => void;
  postImages: ImageType[];
  setPostImages: (postImages: ImageType[]) => void;
};
const TextEditorComponent: React.FC<TextEditorProps> = ({ content, setContent, postImages, setPostImages }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useAppSelector((state: RootState) => state.app);
  const handleImageUpload = async (blobInfo: any) => {
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());
      axios
        .post(import.meta.env.VITE_APP_API + 'storage/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          resolve(response.data.data.url);
          setPostImages([...postImages, { url: response.data.data.url, filename: response.data.data.filename }]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return (
    <div className="text-editor-wrapper card h-full flex-1 rounded-sm p-0 shadow-lg">
      {isLoading && (
        <div className="skeleton-wrapper w-full p-10">
          <Skeleton active />
        </div>
      )}
      <Editor
        key={theme}
        onInit={() => {
          setIsLoading(false);
        }}
        onEditorChange={setContent}
        apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
        init={{
          skin: theme === THEME.DARK ? 'oxide-dark' : 'oxide',
          content_css: theme === THEME.DARK ? 'dark' : 'default',
          content_style:
            theme === THEME.DARK
              ? `
              body {
                background-color: #242526 !important;
                color: #f1f1f1 !important;
              }
              .mce-content-body {
                background-color: #242526 !important;
                color: #f1f1f1 !important;
              }
              a {
                color: #4aa3df !important;
              }
              blockquote {
                border-left: 4px solid #4aa3df;
                color: #b0b0b0;
              }
              pre {
                background-color: #333 !important;
                color: #f8f8f2 !important;
              }
              table {
                background-color: #333;
                color: #f1f1f1;
              }
            `
              : '',
          plugins:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
          toolbar:
            'undo redo  | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap codesample | removeformat',
          codesample_languages: [
            { text: 'JavaScript', value: 'javascript' },
            { text: 'PHP', value: 'php' },
            { text: 'Ruby', value: 'ruby' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C#', value: 'csharp' },
            { text: 'C++', value: 'cpp' }
          ],
          images_upload_handler: handleImageUpload
        }}
        value={content}
      />
    </div>
  );
};

export default TextEditorComponent;
