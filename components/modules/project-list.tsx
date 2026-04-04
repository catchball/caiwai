import { ClippingProject } from "@catchball/tansaku-client/lib"
import Link from "next/link"
import { FC } from "react"

export const ProjectList: FC<{ projects: ClippingProject[] }> = ({
  projects,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}

const ProjectItem: FC<{ project: ClippingProject }> = ({ project }) => {
  return (
    <Link
      href={`/project/${project.id}`}
      style={{
        background: "#f9f9f9",
        borderRadius: ".5rem",
        display: "flex",
        flexFlow: "column",
        gap: ".5rem",
        maxWidth: "34.5rem",
        padding: "1rem 1.5rem",
        textDecoration: "none",
        width: "100%",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{project.name}</div>
      <div
        style={{
          color: "#999",
          display: "flex",
          flexWrap: "wrap",
          fontSize: ".75rem",
          gap: ".25rem",
        }}
      >
        {project.keyword_list.map((keyword) => (
          <span
            key={keyword}
            style={{
              background: "#eee",
              borderRadius: "1rem",
              padding: ".125rem .5rem",
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
    </Link>
  )
}
