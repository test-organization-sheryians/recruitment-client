// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// import Underline from "@tiptap/extension-underline";
// import Heading from "@tiptap/extension-heading";
// import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
// import Blockquote from "@tiptap/extension-blockquote";

// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import TextAlign from "@tiptap/extension-text-align";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { createLowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";

// import ToolbarNav from "./ToolbarNav";

// const lowlight = createLowlight();
// lowlight.register({ javascript });

// export default function RichEditor() {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit,
//       Underline,
//       Heading.configure({ levels: [1,2,3] }),
//       BulletList,
//       OrderedList,
//       ListItem,
//       Blockquote,
//       Image,
//       Link,
//       TextAlign.configure({ types: ["heading","paragraph"] }),
//       CodeBlockLowlight.configure({ lowlight }),
//     ],
//     content: "<p>Start writing your story…</p>",
//   });

//   return (
//     <div className="w-full flex justify-center px-4 pt-4">
//       {/* Editor container centered with max width like Medium */}
//       <div className="w-full max-w-3xl">

//         {/* toolbar at top always visible */}
//         <ToolbarNav editor={editor} />

//         {/* editor body with readable typography */}
//         <div className="prose prose-invert max-w-none">
//           <EditorContent editor={editor} className="min-h-[60vh]" />
//         </div>

//       </div>
//     </div>
//   );
// }






// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";

// import Underline from "@tiptap/extension-underline";
// import Heading from "@tiptap/extension-heading";
// import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
// import Blockquote from "@tiptap/extension-blockquote";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import TextAlign from "@tiptap/extension-text-align";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { createLowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";

// import ToolbarNav from "./ToolbarNav";

// const lowlight = createLowlight();
// lowlight.register({ javascript });

// export default function RichEditor() {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [
//       StarterKit,

//       // 🟢 Placeholder extension configured
//       Placeholder.configure({
//         placeholder: "Write something awesome...", // ✍️ Your custom placeholder
//         showOnlyWhenEditable: true,
//       }),

//       Underline,
//       Heading.configure({ levels: [1, 2, 3] }),
//       BulletList,
//       OrderedList,
//       ListItem,
//       Blockquote,
//       Image,
//       Link,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//       CodeBlockLowlight.configure({ lowlight }),
//     ],

//     content: "",

//     onUpdate: ({ editor }) => {
//       console.log("Editor content HTML:", editor.getHTML());
//     },
//   });

//   return (
//     <div className="w-full flex justify-center px-4 pt-4">
//       <div className="w-full max-w-3xl">
//         <ToolbarNav editor={editor} />

//         <div className="prose prose-invert max-w-none relative">
//           <EditorContent editor={editor} className="min-h-[60vh]" />
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import Blockquote from "@tiptap/extension-blockquote";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";

import ToolbarNav from "./ToolbarNav";

const lowlight = createLowlight();
lowlight.register({ javascript });

export default function RichEditor() {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type your content here…", // ☝️ This is your placeholder
        showOnlyWhenEditable: true,
      }),
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Image,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],

    content: "",

    // 🟢 This runs when content changes
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();   // HTML output
      const text = editor.getText();   // Plain text output
      const json = editor.getJSON();   // JSON structured

      console.log("---------- Tiptap Content Updated ----------");
      console.log("HTML:", html);       // full HTML
      console.log("Text:", text);       // just readable text
      console.log("JSON:", json);       // json content
      console.log("------------------------------------------------");
    },
  });

  return (
    <div className="w-full flex justify-center px-4 pt-4">
      <div className="w-full max-w-3xl">
        <ToolbarNav editor={editor} />

        <div className="prose prose-invert max-w-none relative">
          <EditorContent editor={editor} className="min-h-[60vh]" />
        </div>
      </div>
    </div>
  );
}



