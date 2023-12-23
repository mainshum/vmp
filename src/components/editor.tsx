"use client";

import React from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import { Button } from "./ui/button";

interface EditorProps {
  // eslint-disable-next-line no-unused-vars
  onSave: (data?: Promise<OutputData>) => void;
  initialData: OutputData;
  editorblock: string;
}

const Editor = ({ initialData, onSave, editorblock }: EditorProps) => {
  const ref = React.useRef<EditorJS | null>();

  React.useEffect(() => {
    if (ref.current) return;

    const editor = new EditorJS({
      holder: editorblock,
      data: initialData,
      async onChange(api) {
        await api.saver.save();
      },
      tools: {
        header: Header,
        Paragraph: Paragraph,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
      },
    });

    ref.current = editor;

    return () => {
      ref.current?.destroy();
    };
  }, [editorblock, initialData]);

  return (
    <>
      <div id={editorblock} />
      <Button onClick={() => onSave(ref.current?.saver.save())}>
        Next page
      </Button>
    </>
  );
};

export default Editor;
