import React from 'react';
import { providers, signIn, getSession, csrfToken } from "next-auth/client";

export default function Signin({ providers, csrfToken }){
  return (
      <h1>This is Login</h1>
  ) 
}