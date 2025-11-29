import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  sendNewsletter,
  uploadNewsletterImage,
} from "../../services/adminService";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import EmojiPicker from "emoji-picker-react";
import CustomImage from "../../component/CustomImage";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { FaUndo, FaRedo, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminNewsletter = () => {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({
        placeholder: "Write your divine message here...",
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      CustomImage,
      HorizontalRule,
      Color,
      TextStyle,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: "",
  });

  const handleSend = async (e) => {
    e.preventDefault();
    const message = editor?.getHTML() || "";
    if (!subject.trim() || !message || message === "<p></p>") {
      toast.error("Please fill in both subject and message");
      return;
    }

    try {
      setLoading(true);
      await sendNewsletter({ subject, message });
      toast.success("📬 Newsletter sent successfully!");
      setSubject("");
      editor?.commands.setContent("");
    } catch (error) {
      console.error("Newsletter error:", error);
      toast.error("Failed to send newsletter");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploading(true);
        const { url } = await uploadNewsletterImage(formData);
        if (url) {
          editor?.chain().focus().setImage({ src: url, width: "100%" }).run();
        } else {
          toast.error("Upload failed");
        }
      } catch (err) {
        toast.error("Image upload failed");
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
  };

  const toolbarButtons = [
    {
      label: "H1",
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor?.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor?.isActive("heading", { level: 2 }),
    },
    { label: "Bold", action: () => editor?.chain().focus().toggleBold().run() },
    {
      label: "Italic",
      action: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      action: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strike",
      action: () => editor?.chain().focus().toggleStrike().run(),
    },
    {
      label: "Highlight",
      action: () => editor?.chain().focus().toggleHighlight().run(),
    },
    {
      label: "Color",
      action: () => {
        const color = prompt("Enter hex code (e.g. #ff0000):");
        if (color) editor?.chain().focus().setColor(color).run();
      },
    },
    {
      label: "Bullet List",
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Left",
      action: () => editor?.chain().focus().setTextAlign("left").run(),
    },
    {
      label: "Center",
      action: () => editor?.chain().focus().setTextAlign("center").run(),
    },
    {
      label: "Right",
      action: () => editor?.chain().focus().setTextAlign("right").run(),
    },
    { label: "Code", action: () => editor?.chain().focus().toggleCode().run() },
    {
      label: "Code Block",
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "HR",
      action: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      label: "Link",
      action: () => {
        const url = prompt("Enter link:");
        if (url) editor?.chain().focus().setLink({ href: url }).run();
      },
    },
    {
      label: "Image URL",
      action: () => {
        const url = prompt("Enter image URL:");
        if (url)
          editor?.chain().focus().setImage({ src: url, width: "100%" }).run();
      },
    },
    { label: "📤 Upload Image", action: handleImageUpload },
    {
      label: "📋 Table",
      action: () =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
  ];

  return (
    <section className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-rose-100 to-purple-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-pink-200">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8">
          🌸 Send a Beautiful Newsletter
        </h2>

        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a meaningful subject..."
              className="w-full border border-pink-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Message
            </label>

            <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
              {toolbarButtons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={btn.action}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition shadow-sm border ${
                    btn.active
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}

              {uploading && (
                <p className="text-sm text-pink-600 italic mb-2 flex items-center gap-2">
                  <span className="animate-spin border-2 border-pink-300 border-t-transparent rounded-full w-4 h-4"></span>
                  Uploading image...
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowEmoji((prev) => !prev)}
                className="text-xl px-2"
                title="Emoji Picker"
              >
                😊
              </button>
              <button
                type="button"
                onClick={() => setPreview((prev) => !prev)}
                title="Toggle HTML Preview"
                className="text-xl px-2"
              >
                {preview ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                title="Undo"
                className="text-xl px-2"
              >
                <FaUndo />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                title="Redo"
                className="text-xl px-2"
              >
                <FaRedo />
              </button>
              <button
                type="button"
                onClick={() => editor?.commands.clearContent()}
                title="Clear Content"
                className="text-xl px-2"
              >
                <FaTrash />
              </button>
            </div>

            {showEmoji && (
              <div className="mb-3">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    editor
                      ?.chain()
                      .focus()
                      .insertContent(emojiData.emoji)
                      .run();
                    setShowEmoji(false);
                  }}
                  height={350}
                />
              </div>
            )}

            {editor && editor.isActive("image") && (
              <div className="flex items-center gap-4 my-2">
                <label className="text-sm text-gray-600">Width:</label>
                <input
                  type="text"
                  className="border px-2 py-1 rounded text-sm w-24"
                  value={editor.getAttributes("image").width || ""}
                  onChange={(e) => {
                    editor.commands.updateAttributes("image", {
                      width: e.target.value,
                    });
                  }}
                  placeholder="e.g. 300px or 50%"
                />

                <label className="text-sm text-gray-600">Height:</label>
                <input
                  type="text"
                  className="border px-2 py-1 rounded text-sm w-24"
                  value={editor.getAttributes("image").height || ""}
                  onChange={(e) => {
                    editor.commands.updateAttributes("image", {
                      height: e.target.value,
                    });
                  }}
                  placeholder="auto"
                />
              </div>
            )}

            {preview ? (
              <div className="border-2 border-pink-300 rounded-xl p-4 bg-gray-100 text-sm text-gray-800 whitespace-pre-wrap min-h-[250px]">
                <code>{editor?.getHTML()}</code>
              </div>
            ) : (
              <div className="border border-pink-300 rounded-lg bg-white shadow-inner p-4 min-h-[300px] max-h-[500px] overflow-auto prose prose-sm prose-p:my-2 prose-headings:my-3 prose-table:table-auto prose-th:border prose-td:border">
                <EditorContent
                  editor={editor}
                  className="h-full w-full tiptap [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 [&_img]:max-w-full [&_img]:h-auto [&_.resizer]:bg-pink-400 [&_.resizer]:rounded-full [&_.resizer]:w-3 [&_.resizer]:h-3"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-pink-700 shadow-lg transition disabled:opacity-50 block mx-auto"
          >
            {loading ? "Sending..." : "✨ Send Newsletter"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminNewsletter;
