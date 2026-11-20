import { useState, type ReactNode } from "react";
import { Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

import type { FlowListItem } from "./types";

/** A button that opens the name field, then asks to start from the default flow or a blank one. */
export function FlowCreateForm({
  label,
  placeholder,
  preset,
  busy,
  onCreate,
}: {
  label: string;
  placeholder: string;
  preset?: boolean;
  busy?: boolean;
  onCreate: (title: string, preset: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        {label}
      </Button>
    );
  }
  return (
    <form
      className="flex w-full items-center gap-2 sm:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        onCreate(title, submitter?.value === "default");
      }}
    >
      <Input
        autoFocus
        value={title}
        placeholder={placeholder}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
        className="min-w-0 flex-1 sm:w-48 sm:flex-none"
      />
      {preset ? (
        <Button type="submit" value="default" className="shrink-0" disabled={busy}>
          Use default
        </Button>
      ) : null}
      <Button
        type="submit"
        value="blank"
        variant={preset ? "outline" : "default"}
        className="shrink-0"
        disabled={busy}
      >
        {preset ? "Blank" : label}
      </Button>
      <Button type="button" variant="ghost" className="shrink-0" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}

/** Saved flows as cards; the host links each to its page and deletes on request. */
export function FlowList({
  flows,
  empty,
  busy,
  describe = (flow) => (flow.updated_at ? new Date(flow.updated_at).toLocaleDateString() : ""),
  renderLink,
  onDelete,
}: {
  flows: FlowListItem[];
  empty: string;
  busy?: boolean;
  describe?: (flow: FlowListItem) => string;
  renderLink: (flow: FlowListItem, children: ReactNode) => ReactNode;
  onDelete: (id: string) => void;
}) {
  if (flows.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Workflow />
          </EmptyMedia>
          <EmptyTitle>Nothing here yet</EmptyTitle>
          <EmptyDescription>{empty}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {flows.map((flow) => (
        <Card key={flow.id} className="flex flex-row items-center justify-between gap-3 p-4">
          {renderLink(
            flow,
            <>
              <p className="truncate text-sm font-semibold text-foreground">{flow.title}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{describe(flow)}</p>
            </>,
          )}
          <Button
            type="button"
            size="xs"
            variant="ghost"
            disabled={busy}
            onClick={() => onDelete(flow.id)}
          >
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}
