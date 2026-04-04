"use client"

import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
} from "firebase/auth"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { api } from "services/api"
import { auth } from "services/firebase"
import { loadingAtom, userAtom } from "services/store"

export const AuthInitializer = () => {
  const setUser = useSetAtom(userAtom)
  const setIsLoading = useSetAtom(loadingAtom)

  useEffect(() => {
    setIsLoading(true)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn")
      if (email) {
        signInWithEmailLink(auth, email, window.location.href).then(() => {
          window.localStorage.removeItem("emailForSignIn")
        })
      }
    }
    setIsLoading(false)
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoading(true)
        const { user } = await api.v1.meApiV1UsersMeGet()
        setUser(user)
        setIsLoading(false)
      }
    })
  }, [setUser])

  return null
}
