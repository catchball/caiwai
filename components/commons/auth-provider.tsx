"use client"

import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
} from "firebase/auth"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { auth } from "services/firebase"
import { userAtom } from "services/store"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const checkSignInLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignIn")
        if (email) {
          await signInWithEmailLink(auth, email, window.location.href)
          window.localStorage.removeItem("emailForSignIn")
        }
      }
    }

    checkSignInLink()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [setUser])

  return <>{children}</>
}
