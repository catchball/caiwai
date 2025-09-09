import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import dayjs from "dayjs"
import { FC, Fragment } from "react"
import { compactPublisherCatetoriesWithLabel } from "services/constant"

const colors: { [key in "news" | "youtube" | "x" | "sns"]: string } = {
  news: "#495057",
  youtube: "#c4302b",
  x: "#111",
  sns: "#d97706",
}

const lightColors: { [key in "news" | "youtube" | "x" | "sns"]: string } = {
  news: "#eef2f6",
  youtube: "#ffebee",
  x: "#eef2f6",
  sns: "#fff3e0",
}

const groupScore = (group: Clipping[]) =>
  group.reduce((p, c) => p + c.score, 0) + group.length - 1

const Rank: FC<{ rank: number }> = ({ rank }) => (
  <div
    style={{
      display: "flex",
      gap: ".06125rem",
      height: ".5rem",
    }}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <span
        key={i}
        style={{
          border: `solid .75px ${rank >= i ? "#668" : "#ddd"}`,
        }}
      />
    ))}
  </div>
)

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
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexFlow: "column",
      }}
    >
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: "normal",
          padding: ".75rem",
          textAlign: "center",
        }}
      >
        {project.name} Caiwai [{dayjs().subtract(1, "day").format("M/D")}]
      </h2>
      <div
        style={{
          background: "#eef2f6",
          display: "flex",
          flexDirection: "column",
          gap: ".15rem",
          maxWidth: "36rem",
        }}
      >
        {compactPublisherCatetoriesWithLabel
          .filter(({ value }) => clippingGroups[value].length > 0)
          .map(({ label, value }) => (
            <Fragment key={value}>
              <div
                style={{
                  background: lightColors[value],
                  borderLeft: `solid 3px ${colors[value]}`,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: ".25rem .75rem",
                }}
              >
                <div style={{ color: colors[value], fontWeight: "bolder" }}>
                  {label}
                </div>
                <div style={{ fontSize: ".75rem", lineHeight: 2 }}>
                  {clippingGroups[value].length}件
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
                      gap: ".125rem",
                      textDecoration: "none",
                      padding: ".25rem .75rem",
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
                          color: "#888",
                          fontSize: ".75rem",
                        }}
                      >
                        {clipping.source_publisher}
                        {clipping.category && (
                          <>&nbsp;&gt; {clipping.category}</>
                        )}
                      </p>
                      <Rank
                        rank={
                          groupScore(clippingGroups[value][0]) > 0
                            ? Math.ceil(
                                (Math.log(
                                  groupScore([clipping, ...others]) + 1
                                ) /
                                  Math.log(
                                    groupScore(clippingGroups[value][0]) + 1
                                  )) *
                                  4
                              )
                            : 0
                        }
                      />
                    </div>
                    <h3
                      style={{
                        color: "#07f",
                        fontSize: ".875rem",
                        fontWeight: "normal",
                        lineHeight: 1,
                        margin: 0,
                        maxHeight: ".875rem",
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
