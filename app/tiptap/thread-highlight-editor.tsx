"use client";

import { useMemo } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useThreads } from "@liveblocks/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Read-only mirror of the main document. It binds to the same Yjs field, so it
 * always shows the full text, and uses Liveblocks' thread filtering to mark
 * only the thread whose anchor is selected — every other comment mark renders
 * with `data-hidden`, which drops its highlight styling.
 *
 * `comments` and `mentions` stay enabled: the shared field holds comment marks
 * and mention nodes, and y-prosemirror can only map them if this editor's
 * schema matches the main one.
 */
export default function ThreadHighlightEditor({
  focusedThreadId,
}: {
  focusedThreadId: string | null;
}) {
  const { threads } = useThreads();

  const focusedThreads = useMemo(
    () => threads?.filter((thread) => thread.id === focusedThreadId) ?? [],
    [threads, focusedThreadId]
  );

  const liveblocks = useLiveblocksExtension({
    field: "input",
    threads_experimental: focusedThreads,
  });

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: "outline-none flex-1",
      },
    },
    extensions: [
      StarterKit.configure({
        undoRedo: false,
      }),
      liveblocks as Extension,
    ],
  });

  return (
    <div className="thread-highlight-mirror flex flex-col gap-2 rounded-md border border-border/80 p-3">
      <div className="text-xs font-medium text-foreground/50">
        {focusedThreadId ? "Thread highlight" : "Select a thread to highlight"}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
