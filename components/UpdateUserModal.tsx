import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  level: z.string(),
})

type UpdateUserModalProps = {
  user: { id: number; username: string; level: string } | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: number, username: string, level: string) => void
}

export function UpdateUserModal({ user, isOpen, onClose, onUpdate }: UpdateUserModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user?.username || "",
      level: user?.level || "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        level: user.level,
      })
    }
  }, [user, form])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (user) {
      onUpdate(user.id, data.username, data.level)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold mb-4">Update User</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:bg-[#FFA6F6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:bg-[#FFA6F6]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PETUGAS">Petugas</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={onClose} className="bg-white border-2 border-black hover:bg-gray-100">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

