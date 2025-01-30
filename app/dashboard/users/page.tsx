"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from "lucide-react"
import { addUsers, getUsers, updateUser, deleteUser } from "@/server/actions"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { UpdateUserModal } from "@/components/UpdateUserModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"

type User = {
  id: number
  username: string
  level: string
}

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  level: z.string(),
})

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>()
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      level: "",
    },
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newUser = await addUsers(data.username, data.password, data.level)

    if (newUser.code === 200) {
      toast({
        variant: "success",
        title: "Success",
        description: "Pengguna berhasil ditambahkan",
      })
      fetchUsers()
      form.reset()
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Pengguna gagal ditambahkan",
      })
    }
  }

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user)
    setUpdateModalOpen(true)
  }

  const handleUpdate = async (id: number, username: string, level: string) => {
    const result = await updateUser(id, username, level)
    if (result.code === 200) {
      toast({
        variant: "success",
        title: "Success",
        description: "Pengguna berhasil diperbarui",
      })
      fetchUsers()
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Pengguna gagal diperbarui",
      })
    }
  }

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id)
    setConfirmDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const result = await deleteUser(userToDelete)
      if (result.code === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Pengguna berhasil dihapus",
        })
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Pengguna gagal dihapus",
        })
      }
    }
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">Manajemen Pengguna</h2>

      <Container>
        <div className="flex gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-12 justify-center items-center">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FFA6F6] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        placeholder="Username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FFA6F6] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        placeholder="Password"
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" className="placeholder:text-sm text-sm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PETUGAS" className="text-sm">
                          Petugas
                        </SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/80 mt-6">
                <Plus className="mr-2 h-5 w-5" /> Tambah Pengguna
              </Button>
            </form>
          </Form>
        </div>
      </Container>

      <Container noPadding>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.level}</TableCell>
                <TableCell>
                  <Button
                    className="mr-2 bg-primary hover:bg-primary/80"
                    size="sm"
                    onClick={() => handleUpdateClick(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600" size="sm" onClick={() => handleDeleteClick(user.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      <UpdateUserModal
        user={selectedUser}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={handleUpdate}
      />

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this user?"
      />
    </div>
  )
}

