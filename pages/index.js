import Head from 'next/head'
import React from 'react';
import Layout, { siteTittle } from '../components/layout'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Home(){
  
  const [ session, loading ] = useSession()

  return <> 
    {!session && <> Not signed in <br/> <button onClick={() => signIn()}>Sign in</button> </>}
    {session && <> Signed in as {session.user.email} <br/> <button onClick={() => signOut()}>Sign out</button> </>}
  </>


  // return (
    
  // ) 
}