import { ProjectIdPage } from "components/pages/project-id"
import { FC, use } from "react"
import { api } from "services/api"

const Page: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params)
  const { project } = use(
    api.admin.showProjectApiAdminProjectsIdGet({
      id,
    })
  )
  return <ProjectIdPage project={project} />
}

export default Page

export const generateStaticParams = async () => {
  const { projects } = await api.admin.projectsApiAdminProjectsGet({
    status: "Active",
    take: 1000,
  })

  return projects
    .filter((p) => p.has_scheduled_export)
    .map((project) => ({ id: project.id }))
}
