import { Container } from "./ui/container"
import LogoutBtn from "./BtnLogout"

const Header = () => {
  return (
    <Container className="rounded-none border-t-0 border-x-0 bg-secondary">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Beranda Admin</h1>
        <LogoutBtn/>
      </div>
    </Container>
  )
}

export default Header

