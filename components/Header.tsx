import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Container } from "./ui/container"

const Header = () => {
  return (
    <Container className="rounded-none border-t-0 border-x-0 bg-secondary">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <Button className="bg-primary hover:bg-primary/80">
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </Button>
      </div>
    </Container>
  )
}

export default Header

