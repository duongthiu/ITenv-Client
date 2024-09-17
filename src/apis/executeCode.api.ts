// import {  LangVersionType } from '../utils/constants/codeLanguage';

// const API_URL = 'https://emkc.org/api/v2/piston/execute';

// type ExecuteCodeType = (language: LangVersionType, sourceCode: string) => Promise<any>;

// export const executeCode: ExecuteCodeType = async (language, sourceCode) => {
//   const data = {
//     language: language.name,
//     version: language.version.split(' ')[1],
//     files: [
//       {
//         content: sourceCode
//       }
//     ]
//   };

//   const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   });

//   if (!response.ok) {
//     throw new Error(`API request failed with status ${response.status}`);
//   }

//   return await response.json();
// };
