"use client";

import React, { memo } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

interface EditorProps {
  onChange: (data: any) => void;
  initialData: OutputData;
  editorblock: string;
}

const Editor = ({ initialData, onChange, editorblock }: EditorProps) => {
  const ref = React.useRef<EditorJS | null>();

  React.useEffect(() => {
    if (ref.current) return;

    if (typeof window === "undefined") return;

    const editor = new EditorJS({
      holder: editorblock,
      data: initialData,
      async onChange(api, event) {
        const data = await api.saver.save();
      },
    });

    ref.current = editor;

    return () => {
      ref.current?.destroy();
    };
  }, [editorblock, initialData]);

  return <div id={editorblock} />;
};

export default Editor;
