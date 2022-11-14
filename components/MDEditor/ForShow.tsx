import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  bold,
  italic,
  group,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  strikethrough,
  hr,
  divider,
  link,
  quote,
  code,
  image,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  codeBlock,
} from "@uiw/react-md-editor/lib/commands";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface MarkdownEditor {
  height?: number;
  mdText?: string;
}

//It doesn't have save functionality, compared to MarkdownEditorForEdit
const MarkdownEditorForShow = ({ height, mdText }: MarkdownEditor) => {
  const [value, setValue] = useState(mdText);

  const commands = [
    bold,
    italic,
    strikethrough,
    hr,
    group([title1, title2, title3, title4, title5, title6], {
      name: "title",
      groupName: "title",
      buttonProps: { title: "Insert title" },
    }),
    divider,
    link,
    quote,
    code,
    codeBlock,
    image,
    divider,
    unorderedListCommand,
    orderedListCommand,
    checkedListCommand,
  ];

  return (
    <MDEditor
      value={value}
      onChange={setValue}
      height={height}
      commands={commands}
      visibleDragbar={false}
    />
  );
};

export default MarkdownEditorForShow;
