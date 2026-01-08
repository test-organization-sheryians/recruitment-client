// "use client";

// import {
//   FaBold,
//   FaItalic,
//   FaUnderline,
//   FaListUl,
//   FaListOl,
//   FaQuoteRight,
//   FaCode,
//   FaCodeBranch,
//   FaLink,
//   FaImage,
//   FaUndo,
//   FaRedo,
//   FaHeading,
//   FaTrashAlt,
// } from "react-icons/fa";

// export default function ToolbarNav({ editor }: any) {
//   if (!editor) return null;

//   const btn =
//     "p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors";
//   const active = "bg-gray-300 text-gray-900 shadow-inner";

//   return (
//     <nav className="flex flex-wrap gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">

//       {/* Bold */}
//       <button
//         className={`${btn} ${editor.isActive("bold") ? active : ""}`}
//         title="Bold"
//         onClick={() => editor.chain().focus().toggleBold().run()}
//       >
//         <FaBold />
//       </button>

//       {/* Italic */}
//       <button
//         className={`${btn} ${editor.isActive("italic") ? active : ""}`}
//         title="Italic"
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//       >
//         <FaItalic />
//       </button>

//       {/* Underline */}
//       <button
//         className={`${btn} ${editor.isActive("underline") ? active : ""}`}
//         title="Underline"
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//       >
//         <FaUnderline />
//       </button>

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Headings */}
//       {[1, 2, 3].map((lvl) => (
//         <button
//           key={lvl}
//           className={`${btn} ${
//             editor.isActive("heading", { level: lvl }) ? active : ""
//           }`}
//           title={`Heading ${lvl}`}
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: lvl }).run()
//           }
//         >
//           <FaHeading />{lvl}
//         </button>
//       ))}

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Lists */}
//       <button
//         className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
//         title="Bullet List"
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//       >
//         <FaListUl />
//       </button>
//       <button
//         className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}
//         title="Ordered List"
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//       >
//         <FaListOl />
//       </button>

//       {/* Blockquote */}
//       <button
//         className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
//         title="Blockquote"
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//       >
//         <FaQuoteRight />
//       </button>

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Inline Code */}
//       <button
//         className={`${btn} ${editor.isActive("code") ? active : ""}`}
//         title="Inline Code"
//         onClick={() => editor.chain().focus().toggleCode().run()}
//       >
//         <FaCode />
//       </button>

//       {/* Code Block */}
//       <button
//         className={`${btn} ${editor.isActive("codeBlock") ? active : ""}`}
//         title="Code Block"
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//       >
//         <FaCodeBranch />
//       </button>

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Link */}
//       <button
//         className={btn}
//         title="Add Link"
//         onClick={() => {
//           const url = prompt("Enter link URL");
//           if (url)
//             editor
//               .chain()
//               .focus()
//               .extendMarkRange("link")
//               .setLink({ href: url })
//               .run();
//         }}
//       >
//         <FaLink />
//       </button>

//       {/* Unlink */}
//       <button
//         className={btn}
//         title="Remove Link"
//         onClick={() => editor.chain().focus().unsetLink().run()}
//       >
//         <FaTrashAlt />
//       </button>

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Image Upload from Local */}
//       <label className={btn + " cursor-pointer"} title="Upload Image">
//         <FaImage />
//         <input
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               const formData = new FormData();
//               formData.append("file", file);
//               fetch("/api/upload", { method: "POST", body: formData })
//                 .then((res) => res.json())
//                 .then((data) => {
//                   if (data.url)
//                     editor.chain().focus().setImage({ src: data.url }).run();
//                 });
//             }
//           }}
//         />
//       </label>

//       {/* Image from URL */}
//       <button
//         className={btn}
//         title="Image from URL"
//         onClick={() => {
//           const url = prompt("Paste Image URL");
//           if (url) editor.chain().focus().setImage({ src: url }).run();
//         }}
//       >
//         <FaImage />
//       </button>

//       {/* Separator */}
//       <span className="w-px bg-gray-300 mx-1 h-6"></span>

//       {/* Undo / Redo */}
//       <button
//         className={btn}
//         title="Undo"
//         onClick={() => editor.chain().undo().run()}
//       >
//         <FaUndo />
//       </button>
//       <button
//         className={btn}
//         title="Redo"
//         onClick={() => editor.chain().redo().run()}
//       >
//         <FaRedo />
//       </button>
//     </nav>
//   );
// }








"use client";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaCode,
  FaCodeBranch,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaHeading,
  FaTrashAlt,
} from "react-icons/fa";

export default function ToolbarNav({ editor }: any) {
  if (!editor) return null;

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-200 transition";
  const active =
    "bg-gray-300 text-gray-900 shadow-inner";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-300">
      {/* horizontal scroll for small screens */}
      <div className="overflow-x-auto">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2">

          {/* Bold */}
          <button
            className={`${btn} ${editor.isActive("bold") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FaBold />
          </button>

          {/* Italic */}
          <button
            className={`${btn} ${editor.isActive("italic") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FaItalic />
          </button>

          {/* Underline */}
          <button
            className={`${btn} ${editor.isActive("underline") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FaUnderline />
          </button>

          <Divider />

          {/* Headings */}
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              className={`${btn} ${
                editor.isActive("heading", { level: lvl }) ? active : ""
              }`}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: lvl }).run()
              }
            >
              <FaHeading className="mr-1" /> {lvl}
            </button>
          ))}

          <Divider />

          {/* Lists */}
          <button
            className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FaListUl />
          </button>

          <button
            className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FaListOl />
          </button>

          <button
            className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FaQuoteRight />
          </button>

          <Divider />

          {/* Code */}
          <button
            className={`${btn} ${editor.isActive("code") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <FaCode />
          </button>

          <button
            className={`${btn} ${editor.isActive("codeBlock") ? active : ""}`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <FaCodeBranch />
          </button>

          <Divider />

          {/* Link */}
          <button
            className={btn}
            onClick={() => {
              const url = prompt("Enter link URL");
              if (url)
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
            }}
          >
            <FaLink />
          </button>

          <button
            className={btn}
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <FaTrashAlt />
          </button>

          <Divider />

          {/* Image */}
          <label className={`${btn} cursor-pointer`}>
            <FaImage />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                fetch("/api/upload", { method: "POST", body: formData })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.url)
                      editor.chain().focus().setImage({ src: data.url }).run();
                  });
              }}
            />
          </label>

          <button
            className={btn}
            onClick={() => {
              const url = prompt("Paste Image URL");
              if (url)
                editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            <FaImage />
          </button>

          <Divider />

          {/* Undo / Redo */}
          <button
            className={btn}
            onClick={() => editor.chain().undo().run()}
          >
            <FaUndo />
          </button>

          <button
            className={btn}
            onClick={() => editor.chain().redo().run()}
          >
            <FaRedo />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Divider() {
  return <span className="mx-2 h-6 w-px bg-gray-300" />;
}
