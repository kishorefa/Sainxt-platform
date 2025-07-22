// "use client";

// import React, { useEffect } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// export default function TiptapEditor({ value, onChange }) {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: "", // initial empty
//     injectCSS: false,
//     editorProps: {
//       attributes: {
//         class: "prose min-h-[150px] border p-2",
//       },
//       // ✅ move here
//       handleDOMEvents: {
//         beforeinput: () => false, // dummy to silence warnings
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     autofocus: true,
//     editable: true,
//   });

//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value || "");
//     }
//   }, [editor, value]);

//   useEffect(() => {
//     return () => {
//       if (editor) editor.destroy();
//     };
//   }, [editor]);

//   if (!editor) return null;

//   return <EditorContent editor={editor} />;
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// export default function TiptapEditor({ value, onChange }) {
//   const [isClient, setIsClient] = useState(false);

//   // Avoid running useEditor() until after mount
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const editor = useEditor(
//     isClient
//       ? {
//           extensions: [StarterKit],
//           content: value || "",
//           editorProps: {
//             attributes: {
//               class: "prose min-h-[150px] border p-2",
//             },
//           },
//           onUpdate: ({ editor }) => {
//             onChange(editor.getHTML());
//           },
//           autofocus: true,
//           editable: true,
//           injectCSS: false,
//         }
//       : null
//   );

//   // Update content when external value changes
//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value || "");
//     }
//   }, [editor, value]);

//   useEffect(() => {
//     return () => {
//       if (editor) editor.destroy();
//     };
//   }, [editor]);

//   // Avoid rendering on server at all
//   if (!isClient || !editor) return null;

//   return <EditorContent editor={editor} />;
// }

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // ✅ Correct placement
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
