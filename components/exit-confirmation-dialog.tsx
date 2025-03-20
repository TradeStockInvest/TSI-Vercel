"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "lucide-react"

interface ExitConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  onEnableContinuous: () => void
}

export function ExitConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  onEnableContinuous,
}: ExitConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            Active AI Trades
          </DialogTitle>
          <DialogDescription>You have active AI trades. What would you like to do?</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            If you leave without enabling continuous trading, all your AI-managed positions will be closed
            automatically.
          </p>
          <p>
            Alternatively, you can enable continuous trading to let the AI continue managing your positions even after
            you close the browser.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCancel} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button variant="secondary" onClick={onEnableContinuous} className="sm:w-auto w-full">
            Enable Continuous Trading
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="sm:w-auto w-full">
            Close All Positions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

