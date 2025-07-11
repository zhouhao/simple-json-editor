# Simple JSON Editor

A comprehensive online JSON editor built with React, TypeScript, and Monaco Editor. This application provides a powerful and user-friendly interface for viewing, editing, formatting, and managing JSON documents.

## ✨ Features

### 🎯 Core Functionality
- **Monaco Editor Integration** - Professional code editing experience with syntax highlighting
- **Tree View** - Interactive JSON tree visualization for easy navigation
- **Real-time Validation** - Instant JSON syntax validation with error highlighting
- **Auto-formatting** - One-click JSON formatting and beautification
- **Document Management** - Create, save, delete, and switch between multiple JSON documents

### 🎨 User Experience
- **Multiple Themes** - Support for light, dark, and high contrast themes
- **Auto-save** - Automatic saving of changes with 500ms debounce
- **Local Storage** - Persistent storage of documents and preferences
- **Download Support** - Export JSON files directly to your device
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🔧 Advanced Features
- **Dual View Modes** - Switch between code editor and interactive tree view
- **Line Numbers** - Clear line numbering for easy reference
- **Bracket Pair Colorization** - Enhanced readability with colored brackets
- **Word Wrap** - Automatic text wrapping for long lines
- **Command Palette** - Access formatting and other actions via Monaco's command palette

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zhouhao/simple-json-editor.git
   cd simple-json-editor
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start using the JSON editor.

### Building for Production

```bash
pnpm build
```

The built files will be available in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## 📖 Usage

### Basic Operations
1. **Creating Documents** - Click the document selector and choose "New Document"
2. **Editing JSON** - Type or paste JSON content in the editor
3. **Formatting** - Use the "Format" button or Monaco's command palette (Ctrl/Cmd + Shift + P)
4. **Switching Views** - Toggle between Code View and Tree View using the view selector
5. **Downloading** - Click the "Download" button to save your JSON file

### Keyboard Shortcuts
- **Format JSON** - Available through Monaco's command palette
- **Standard Editor Shortcuts** - All Monaco Editor shortcuts are supported
- **Auto-completion** - JSON schema-aware auto-completion

### Theme Selection
Choose from multiple editor themes:
- **Light Theme** (`vs`) - Clean light interface
- **Dark Theme** (`vs-dark`) - Dark mode for reduced eye strain
- **High Contrast** (`hc-black`) - High contrast for accessibility

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful, customizable icons
- **Class Variance Authority** - Component variant management

### Editor & Functionality
- **Monaco Editor** - VS Code's editor in the browser
- **React Monaco Editor** - React wrapper for Monaco Editor

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic CSS vendor prefixing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [React](https://reactjs.org/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For the beautiful styling
- [Radix UI](https://www.radix-ui.com/) - For accessible UI components
