'use client';
import { useEffect } from "react";
import AuthGuard from "../components/AuthGuard";
import axios from 'axios';

export default function AuthLayout({children}: {
  children: React.ReactNode;
}) 
{


  return <AuthGuard>{children}</AuthGuard>;
}
