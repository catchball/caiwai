"use client"

import { ClippingProject } from "@catchball/tansaku-client/lib"
import { PrivateLock } from "components/commons/private-lock"
import { useAtomValue } from "jotai"
import Link from "next/link"
import React, { FC, Suspense, useEffect, useState } from "react"
import { api } from "services/api"
import { userAtom } from "services/store"

const Page: FC = ({ ...props }) => {
  return (
    <React.Fragment {...props}>
      <PrivateLock>
        <Suspense fallback={<>Loading</>}>
          <Projects />
        </Suspense>
      </PrivateLock>
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

  return (
    <>
      <div>{user.displayName}</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: ".5rem",
          padding: "1rem",
        }}
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            style={{
              background: "#f9f9f9",
              borderRadius: "2rem",
              display: "block",
              padding: ".25rem .75rem",
            }}
          >
            {project.name}
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
