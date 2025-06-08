# ITenv - Interactive Learning Environment

ITenv is a modern web application built with React, TypeScript, and Vite, designed to provide an interactive learning environment for programming education.

## Features

- 🚀 Modern tech stack with React + TypeScript + Vite
- 💻 Interactive code editor with real-time execution
- 📝 Problem-solving platform with test cases
- 👥 Social features including friend system and messaging
- 🎨 Beautiful UI with Ant Design components
- 🔄 Real-time updates with WebSocket integration

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Redux Toolkit
- **Data Fetching**: SWR
- **Styling**: SCSS + Tailwind CSS
- **Code Editor**: Monaco Editor
- **Real-time Communication**: Socket.IO

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ITenv.git
cd ITenv/ITenv-Client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
VITE_APP_API=your_api_url
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── redux/         # Redux store and slices
├── services/      # API services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── routes/        # Route configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [SWR](https://swr.vercel.app/)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
