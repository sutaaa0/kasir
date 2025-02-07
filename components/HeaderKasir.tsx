// import { Container } from "./ui/container"
// import LogoutBtn from "./BtnLogout"

// const Header = () => {
//   return (
//     <Container className="rounded-none border-t-0 border-x-0 bg-secondary">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Kasir</h1>
//         <LogoutBtn/>
//       </div>
//     </Container>
//   )
// }

// export default Header

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderKasirProps {
  onMenuClick: () => void;
}

const HeaderKasir = ({ onMenuClick }: HeaderKasirProps) => {
  return (
    <header className="bg-white p-4 shadow-md">
      <Button 
        onClick={onMenuClick} 
        variant="ghost" 
        size="sm"
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>
      {/* Add other header content here */}
    </header>
  );
};

export default HeaderKasir;
