import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import { FC, Fragment } from "react"
import { compactPublisherCatetoriesWithLabel } from "services/constant"

const colors: { [key in "news" | "youtube" | "x" | "sns"]: string } = {
  news: "#777",
  youtube: "#c4302b",
  x: "#111",
  sns: "#d97706",
}

const groupScore = (group: Clipping[]) =>
  group.reduce((p, c) => p + c.score, 0) + group.length - 1

export const ProjectIdCompactPage: FC<{
  project: ClippingProject
  clippingGroups: {
    news: Clipping[][]
    youtube: Clipping[][]
    x: Clipping[][]
    sns: Clipping[][]
  }
}> = ({ project, clippingGroups }) => {
  return (
    <div>
      <h2
        style={{
          fontSize: "1rem",
          padding: ".75rem",
          textAlign: "center",
        }}
      >
        {project.name}
      </h2>
      <div
        style={{
          background: "#eef2f6",
          display: "flex",
          flexDirection: "column",
          gap: ".15rem",
        }}
      >
        {compactPublisherCatetoriesWithLabel
          .filter(({ value }) => clippingGroups[value].length > 0)
          .map(({ label, value }) => (
            <Fragment key={value}>
              <div
                style={{
                  borderLeft: `solid 3px ${colors[value]}`,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: ".5rem",
                }}
              >
                <div style={{ color: colors[value], fontWeight: "bold" }}>
                  {label}
                </div>
                <div style={{ fontSize: ".75rem", lineHeight: 2 }}>
                  {clippingGroups[value].length} 件
                </div>
              </div>
              {clippingGroups[value]
                .slice(0, value == "news" ? 10 : 5)
                .map(([clipping, ...others]) => (
                  <a
                    key={clipping.id}
                    href={clipping.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#f8f9fa",
                      display: "flex",
                      flexDirection: "column",
                      gap: ".25rem",
                      textDecoration: "none",
                      padding: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontSize: ".75rem",
                        }}
                      >
                        {clipping.source_publisher}
                        {clipping.category && (
                          <>&nbsp;&gt; {clipping.category}</>
                        )}
                      </p>
                      <div
                        style={{
                          fontSize: ".5rem",
                        }}
                      >
                        {groupScore(clippingGroups[value][0]) > 0
                          ? (groupScore([clipping, ...others]) /
                              groupScore(clippingGroups[value][0])) *
                            100
                          : 0}
                      </div>
                    </div>
                    <h3
                      style={{
                        color: "#66c",
                        fontSize: ".875rem",
                        fontWeight: "normal",
                        lineHeight: 1,
                        margin: 0,
                        maxHeight: "1.75rem",
                        overflow: "hidden",
                        padding: 0,
                      }}
                    >
                      {clipping.original_title ?? clipping.title}
                    </h3>
                  </a>
                ))}
            </Fragment>
          ))}
      </div>
    </div>
  )
}
