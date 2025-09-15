import { PrivateLock } from "components/commons/private-lock"
import { ProjectIdPage } from "components/pages/project-id"
import { FC, use } from "react"
import { api } from "services/api"

const Page: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params)
  const { project } = use(
    api.v1.showProjectApiV1ClippingsProjectsIdGet({
      id,
    })
  )
  return (
    <PrivateLock>
      <ProjectIdPage project={project} />
    </PrivateLock>
  )
}

export default Page

export const generateStaticParams = async () => {
  const { projects } = await api.v1.projectsApiV1ClippingsProjectsGet({
    status: "Active",
  })

  return projects
    .filter((p) => p.has_scheduled_export)
    .map((project) => ({ id: project.id }))
}
