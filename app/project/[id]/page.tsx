"use client"

import { ClippingProject } from "@catchball/tansaku-client/lib"
import { ProjectIdPage } from "components/pages/project-id"
import { useAtomValue } from "jotai"
import { FC, useEffect, useState } from "react"
import { api } from "services/api"
import { userAtom } from "services/store"

const Page: FC = () => {
  const [project, setProject] = useState<ClippingProject | null>(undefined)
  const user = useAtomValue(userAtom)

  useEffect(() => {
    const fetch = async () => {
      const projectId = window.location.pathname
        .split("/")
        .filter((t) => t.length > 0)
        .slice(-1)[0]
      try {
        const { project } = await api.v1.showApiV1ProjectsProjectIdGet({
          projectId,
        })
        setProject(project)
      } catch (e) {
        setProject(null)
      }
    }
    if (user) fetch()
  }, [user])

  return <ProjectIdPage project={project} />
}

export default Page
