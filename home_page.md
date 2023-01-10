<!--rehype:ignore:start-->
<p align="center">
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md">
    <img alt="react-md-editor logo" src="https://user-images.githubusercontent.com/1680273/146292033-0e5e57fc-6f3e-4032-9fa6-0de05f239e36.png">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@uiw/react-md-editor.svg?style=flat">
  </a>
  <a href="https://www.jsdelivr.com/package/npm/@uiw/react-md-editor" target="__blank">
    <img alt="jsDelivr CDN" src="https://data.jsdelivr.com/v1/package/npm/@uiw/react-md-editor/badge?style=rounded" />
  </a>
  <a href="https://bundlephobia.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@uiw/react-md-editor">
  </a>
  <a href="https://uiwjs.github.io/react-md-editor/coverage/lcov-report" target="__blank">
    <img alt="Coverage Status" src="https://uiwjs.github.io/react-md-editor/coverage/badges.svg" />
  </a>
  <br />
  <a href="https://github.com/uiwjs/react-md-editor/actions" target="__blank">
    <img alt="Build & Deploy" src="https://github.com/uiwjs/react-md-editor/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md" target="__blank">
    <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg">
  </a>
  <a href="https://gitee.com/uiw/react-md-editor" target="__blank">
    <img alt="Gitee" src="https://jaywcjlove.github.io/sb/ico/gitee.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm version" src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg">
  </a>
</p>

<!--rehype:ignore:end-->

A simple markdown editor with preview, implemented with React.js and TypeScript. This React Component aims to provide a simple Markdown editor with syntax highlighting support. This is based on `textarea` encapsulation, so it does not depend on any modern code editors such as Acs, CodeMirror, Monaco etc.

### Features

- 📑 Indent line or selected text by pressing tab key, with customizable indentation.
- ♻️ Based on `textarea` encapsulation, does not depend on any modern code editors.
- 🚧 Does not depend on the [`uiw`](https://github.com/uiwjs/uiw) component library.
- 🚘 Automatic list on new lines.
- 😻 GitHub flavored markdown support.
- 🌒 Support dark-mode/night-mode **@v3.11.0+**.
- 💡 Support [next.js](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341), [Use examples](#support-nextjs) in [next.js](https://nextjs.org/).

### Quick Start

```bash
npm i @uiw/react-md-editor
```

### Using

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark)
[![Open in Github gh-pages](https://img.shields.io/badge/Open%20In-Github%20gh--pages-blue?logo=github)](https://uiwjs.github.io/react-md-editor/)
[![Open in Gitee gh-pages](https://img.shields.io/badge/Open%20In-Gitee%20gh--pages-blue?logo=web)](https://uiw.gitee.io/react-md-editor/)

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}
```