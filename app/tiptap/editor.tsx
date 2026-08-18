"use client";

import NotificationsPopover from "../notifications-popover";
import { MemberAvatars } from "../avatars";
import UserPicker from "../user-picker";
import { useCallback, useMemo, useState } from "react";
import { useEditor, EditorContent, Editor, Extension } from "@tiptap/react";
import {
  useLiveblocksExtension,
  FloatingComposer,
  FloatingThreads,
  AnchoredThreads,
  Toolbar,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";
import { Thread, ThreadProps } from "@liveblocks/react-ui";
import StarterKit from "@tiptap/starter-kit";
import { useThreads } from "@liveblocks/react";
import { useIsMobile } from "./use-is-mobile";
import VersionsDialog from "../version-history-dialog";
import { useAutoSubscribeThreads } from "../use-auto-subscribe-threads";
import ThreadHighlightEditor from "./thread-highlight-editor";

const NODE_TYPES = ["Entry", "Trigger", "Intent Clarity", "Planning"] as const;
type NodeType = (typeof NODE_TYPES)[number];

export default function TiptapEditor() {
  const liveblocks = useLiveblocksExtension({field:'input'});
  const [nodeType, setNodeType] = useState<NodeType>("Entry");
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);

  // Subscribe to every thread in this room, so notifications arrive for all of
  // them and not just the threads this user created or was mentioned in
  useAutoSubscribeThreads();

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Add styles to editor element
        class: "outline-none flex-1 transition-all",
      },
    },
    extensions: [
      StarterKit.configure({
        undoRedo: false,
      }),
      liveblocks as Extension,
    ],
  });

  const handleThreadFocus = useCallback((threadId: string) => {
    setFocusedThreadId(threadId);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="h-[60px] flex items-center justify-end gap-2 px-4 border-b border-border/80 bg-background">
        <select
          value={nodeType}
          onChange={(e) => setNodeType(e.target.value as NodeType)}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {NODE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <MemberAvatars />
        <UserPicker />
        <VersionsDialog editor={editor} />
        <NotificationsPopover />
      </div>
      <div className="border-b border-border/80 bg-background">
        <Toolbar editor={editor} className="w-full" />
      </div>
      <div className="relative flex flex-row justify-between w-full pt-16 xl:pl-[80px] pl-[40px] gap-[24px]">
        <div className="main-editor-surface relative flex flex-1 flex-col gap-2">
          <EditorContent editor={editor} />
          <FloatingComposer
            editor={editor}
            metadata={{ nodeType }}
            className="w-[350px]"
          />
          <FloatingToolbar editor={editor} />
        </div>

        <div className="xl:[&:not(:has(.lb-tiptap-anchored-threads))]:pr-[200px] [&:not(:has(.lb-tiptap-anchored-threads))]:pr-[50px]">
          <Threads editor={editor} onThreadFocus={handleThreadFocus} />
        </div>
      </div>

      <div className="w-full px-[40px] xl:px-[80px] pb-16">
        <ThreadHighlightEditor focusedThreadId={focusedThreadId} />
      </div>
    </div>
  );
}

function Threads({
  editor,
  onThreadFocus,
}: {
  editor: Editor | null;
  onThreadFocus: (threadId: string) => void;
}) {
  const { threads } = useThreads();
  const isMobile = useIsMobile();

  // Never swap this between defined and undefined — Liveblocks renders it
  // through a single stable wrapper component, so the hook count has to hold
  const components = useMemo(
    () => ({
      Thread: (props: ThreadProps) => (
        <Thread
          {...props}
          onClick={(event) => {
            // Let Liveblocks select the thread first, so the mark decoration
            // and active-card offset still happen
            props.onClick?.(event);
            onThreadFocus(props.thread.id);
          }}
        />
      ),
    }),
    [onThreadFocus]
  );

  if (!threads || !editor) {
    return null;
  }

  return isMobile ? (
    <FloatingThreads threads={threads} editor={editor} components={components} />
  ) : (
    <AnchoredThreads
      threads={threads}
      editor={editor}
      components={components}
      className="w-[350px]"
    />
  );
}
