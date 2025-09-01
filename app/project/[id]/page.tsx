import { ProjectIdPage } from "components/pages/project-id"
import { FC } from "react"
import { api } from "services/api"

const Page: FC<{ params: { id: string } }> = async ({ params: { id } }) => {
  const { project } = await api.v1.showProjectApiV1ClippingsProjectsIdGet({
    id,
  })
  return <ProjectIdPage project={project} />
}

export default Page

// export const generateStaticParams = async () => {
//   const { projects } = await api.v1.projectsApiV1ClippingsProjectsGet({
//     status: "Active",
//   })

//   return projects
//     .filter((p) => p.has_scheduled_export)
//     .map((project) => ({ id: project.id }))
// }

export const dynamicParams = true
