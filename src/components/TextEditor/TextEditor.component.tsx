import { Editor } from '@tinymce/tinymce-react';
import React, { memo, useEffect, useState } from 'react';
import './TextEditor.style.scss';
import { Skeleton } from 'antd';
import { useAppSelector } from '../../redux/app/hook';
import { RootState } from '../../redux/store';
import { THEME } from '../../redux/app/app.slice';
import axios from 'axios';
type TextEditorProps = {
  content: string;
  setContent: (content: any, editor: any) => void;
};
const TextEditorComponent: React.FC<TextEditorProps> = ({ content, setContent }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useAppSelector((state: RootState) => state.app);

  const handleImageUpload = async (blobInfo: any, progress: any) => {
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
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  //  const handleImageUpload = async (blobInfo: any, progress: any): Promise<string> => {
  //    return new Promise<string>((resolve, reject) => {
  //      const formData = new FormData();
  //      formData.append('image', blobInfo.blob(), blobInfo.filename());
  //      uploadSingleImage(formData)
  //        .then((response) => {
  //          console.log('Upload successful:', response);
  //          if (response?.data?.url) {
  //            resolve(response.data.url);
  //          } else {
  //            console.error('Image upload failed: No URL returned');
  //            reject(new Error('Image upload failed: No URL returned'));
  //          }
  //        })
  //        .catch((error) => {
  //          reject(new Error('Image upload failed: ' + (error.message || 'Unknown error')));
  //        });
  //    });
  //  };
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
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap codesample | removeformat',
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
          images_upload_handler: handleImageUpload // Handle image upload
          
          // file_picker_callback: function (callback, value, meta) {
          //   if (meta.filetype === 'image') {
          //     const input = document.createElement('input');
          //     input.setAttribute('type', 'file');
          //     input.setAttribute('accept', 'image/*');

          //     input.onchange = function () {
          //       const file = (input.files as FileList)[0];
          //       const reader = new FileReader();
          //       reader.onload = function () {
          //         const id = 'blobid' + new Date().getTime();
          //         const blobCache = Editor?.editorUpload?.blobCache;
          //         const base64 = (reader.result as string).split(',')[1];
          //         const blobInfo = blobCache.create(id, file, base64);
          //         blobCache.add(blobInfo);
          //         callback(blobInfo.blobUri(), { title: file.name });
          //       };
          //       reader.readAsDataURL(file);
          //     };

          //     input.click();
          //   }
          // },
          // paste_data_images: true
        }}
        value={content}
      />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(TextEditorComponent);
