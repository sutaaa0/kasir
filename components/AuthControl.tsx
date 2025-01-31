import { getCurrentUser } from '@/server/actions'
import { redirect } from 'next/navigation';

const AuthControl = async () => {
  const currentUser = await getCurrentUser();

  if(!currentUser) {
    redirect('/login')
  }else if(currentUser.level === "ADMIN") {
    redirect('/dashboard')
  }else {
    redirect('/kasir')
  }
}

export default AuthControl