import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React from "react"

export function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen max-w-full rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={100}>
        <div className="h-full w-full p-6">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
