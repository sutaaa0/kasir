import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, message }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-white border-2 border-black hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

