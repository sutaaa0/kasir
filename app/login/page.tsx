import FormLogin from '@/components/FormLogin'
import { getCurrentUser } from '@/server/actions';
import React from 'react'

const page = async () => {

  const user = await getCurrentUser();

  console.log(user)

  return (
    <FormLogin />
  )
}

export default page