"use client";

import NotificationsPopover from "../notifications-popover";
import { MemberAvatars } from "../avatars";
import UserPicker from "../user-picker";
import { useState } from "react";
import { useEditor, EditorContent, Editor, Extension } from "@tiptap/react";
import {
  useLiveblocksExtension,
  FloatingComposer,
  FloatingThreads,
  AnchoredThreads,
  Toolbar,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useThreads } from "@liveblocks/react";
import { useIsMobile } from "./use-is-mobile";
import VersionsDialog from "../version-history-dialog";
import { useAutoSubscribeThreads } from "../use-auto-subscribe-threads";

const NODE_TYPES = ["Entry", "Trigger", "Intent Clarity", "Planning"] as const;
type NodeType = (typeof NODE_TYPES)[number];

export default function TiptapEditor() {
  const liveblocks = useLiveblocksExtension();
  const [nodeType, setNodeType] = useState<NodeType>("Entry");

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
      <div className="relative flex flex-row justify-between w-full py-16 xl:pl-[250px] pl-[100px] gap-[50px]">
        <div className="relative flex flex-1 flex-col gap-2">
          <EditorContent editor={editor} />
          <FloatingComposer
            editor={editor}
            metadata={{ nodeType }}
            className="w-[350px]"
          />
          <FloatingToolbar editor={editor} />
        </div>

        <div className="xl:[&:not(:has(.lb-tiptap-anchored-threads))]:pr-[200px] [&:not(:has(.lb-tiptap-anchored-threads))]:pr-[50px]">
          <Threads editor={editor} />
        </div>
      </div>
    </div>
  );
}

function Threads({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads();
  const isMobile = useIsMobile();

  if (!threads || !editor) {
    return null;
  }

  return isMobile ? (
    <FloatingThreads threads={threads} editor={editor} />
  ) : (
    <AnchoredThreads
      threads={threads}
      editor={editor}
      className="w-[350px] xl:mr-[100px] mr-[50px]"
    />
  );
}
