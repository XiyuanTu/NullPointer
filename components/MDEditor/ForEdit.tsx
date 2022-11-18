import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
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
  ICommand,
} from "@uiw/react-md-editor/lib/commands";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import axios from "axios";
import { Feedback } from "../../types/constants";
import { setNote } from "../../state/slices/noteSlice";
import { feedback } from "../../utils/feedback";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface MarkdownEditor {
  height?: number;
}

const MarkdownEditorForEdit = ({ height }: MarkdownEditor) => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => state.note.value);
  const [startSave, setStartSave] = useState(false);
  const [value, setValue] = useState<string | undefined>("");
  const [isJustRendered, setIsJustRendered] = useState(true);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);

  const saveBtn: ICommand = {
    name: "save",
    keyCommand: "save",
    buttonProps: { title: "save", "aria-label": "save" },
    groupName: "save",
    render: (command, disabled, executeCommand) => {
      return (
        <button
          aria-label="save"
          //seems it can't get the latest component's states, so have to do it this way
          //bug: after it is clicked, it will be focused. Don't know how to remove it
          disabled={isSaveBtnDisabled}
          onClick={(e) => {
            e.stopPropagation();
            setStartSave(true);
          }}
        >
          Save
        </button>
      );
    },
  };

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
    divider,
    saveBtn,
  ];

  useEffect(() => {
    if (note) {
      setValue(note.mdText);
    }
  }, [note]);

  //the change of the content can be stored in redux immediately
  //isJustRendered: otherwise when a note just rendered, the mdText in redux will be set to ''
  useEffect(() => {
    if (note) {
      isJustRendered
        ? setIsJustRendered(false)
        : dispatch(setNote({ ...note, mdText: value! }));
    }
  }, [value]);

  useEffect(() => {
    if (startSave) {
      note && save();
      setStartSave(false);
    }
  }, [startSave]);

  const save = async () => {

    setIsSaveBtnDisabled(true);

    feedback(dispatch, Feedback.Info, "Saving the note...", false);
    try {
      const lastModified = new Date();
      await axios.patch(`/api/note/${note!._id}`, {
        property: "multiple",
        value: { mdText: value, lastModified },
      });

      //the lastModified in info component can update immediately
      dispatch(
        setNote({ ...note!, lastModified: lastModified.toLocaleString() })
      );
      feedback(dispatch, Feedback.Success, "Successfully save the note.");
    } catch (e) {
      feedback(
        dispatch,
        Feedback.Error,
        "Fail to save the note. Internal error. Please try later."
      );
    }
    setIsSaveBtnDisabled(false);
  }

  return (
    <MDEditor
      value={value}
      onChange={setValue}
      height={height}
      commands={commands}
      visibleDragbar={false}
      style={{ borderRadius: "0" }}
    />
  );
};

export default MarkdownEditorForEdit;
