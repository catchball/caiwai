"use client"

import { ClippingProject } from "@catchball/tansaku-client/lib"
import { PrivateLock } from "components/commons/private-lock"
import { ProfileCard } from "components/modules/profile-card"
import { ProjectList } from "components/modules/project-list"
import { useAtomValue } from "jotai"
import Link from "next/link"
import React, { FC, Suspense, useEffect, useState } from "react"
import { api } from "services/api"
import { userAtom } from "services/store"

const Page: FC = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<>Loading</>}>
        <PrivateLock>
          <Projects />
        </PrivateLock>
      </Suspense>
    </React.Fragment>
  )
}

const Projects: FC = () => {
  const [projects, setProjects] = useState<ClippingProject[]>([])
  const user = useAtomValue(userAtom)

  useEffect(() => {
    const fetchProjects = async () => {
      const { projects } = await api.v1.projectsApiV1ProjectsGet()
      setProjects(projects)
    }
    if (user) fetchProjects()
  }, [user])

  if (!user) return null
  return (
    <>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        <ProfileCard user={user} />
        <ProjectList projects={projects} />
      </div>
    </>
  )
}

export default Page
