import Link from "next/link"
import React, { FC, Suspense, use } from "react"
import { api } from "services/api"

const Page: FC = ({ ...props }) => {
  return (
    <React.Fragment {...props}>
      <Suspense fallback={<>Loading</>}>
        <Projects />
      </Suspense>
    </React.Fragment>
  )
}

const Projects: FC = () => {
  const fetchProjects = async () => {
    const { projects } = await api.v1.projectsApiV1ClippingsProjectsGet({
      status: "Active",
      take: 1000,
    })

    return projects.filter((p) => p.has_scheduled_export)
  }
  const projects = use(fetchProjects())
  return (
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
          href={`/project/${project.id}/compact`}
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
  )
}

export default Page
