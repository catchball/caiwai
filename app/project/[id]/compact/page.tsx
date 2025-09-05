import { groupize } from "@catchball/saku2-admin-lib/dist"
import { Clipping } from "@catchball/tansaku-client/lib"
import { ProjectIdCompactPage } from "components/pages/project-id-compact"
import dayjs from "dayjs"
import { FC, use } from "react"
import { api } from "services/api"
import { snsPublisherMap } from "services/constant"

const clippingSortFunc = (a: Clipping[], b: Clipping[]) =>
  b.reduce((p, c) => c.score + p, b.length) -
  a.reduce((p, c) => c.score + p, a.length)

const Page: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params)
  const { project } = use(
    api.v1.showProjectApiV1ClippingsProjectsIdGet({
      id,
    })
  )
  const { clippings } = use(
    api.v1.indexApiV1ClippingsGet({
      projectId: project.id,
      publishDate: dayjs()
        .startOf("day")
        .subtract(1, "days")
        .format("YYYY-MM-DD HH:mm:ss"),
      publishDateBefore: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    })
  )
  const categorized = {
    news: groupize({
      project,
      clippings: clippings.filter((c) =>
        Object.values(snsPublisherMap)
          .flat()
          .every((p) => p !== c.source_publisher?.toLowerCase())
      ),
    }).toSorted(clippingSortFunc),
    youtube: groupize({
      project,
      clippings: clippings.filter((c) =>
        snsPublisherMap.youtube.includes(c.source_publisher?.toLowerCase())
      ),
    }).toSorted(clippingSortFunc),
    x: groupize({
      project,
      clippings: clippings.filter((c) =>
        snsPublisherMap.x.includes(c.source_publisher?.toLowerCase())
      ),
    }).toSorted(clippingSortFunc),
    sns: groupize({
      project,
      clippings: clippings.filter((c) =>
        snsPublisherMap.sns.includes(c.source_publisher?.toLowerCase())
      ),
    }).toSorted(clippingSortFunc),
  }

  return <ProjectIdCompactPage project={project} clippingGroups={categorized} />
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
