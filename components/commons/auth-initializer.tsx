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

export const AuthInitializer = () => {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn")
      if (email) {
        signInWithEmailLink(auth, email, window.location.href).then(() => {
          window.localStorage.removeItem("emailForSignIn")
        })
      }
    }
    return onAuthStateChanged(auth, (user) => setUser(user))
  }, [setUser])

  return null
}
