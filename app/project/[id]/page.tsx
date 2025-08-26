"use client"

import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import { FilterButton } from "components/elements/form"
import dayjs from "dayjs"
import React, { FC, use, useEffect, useState } from "react"
import { api } from "services/api"

const impactScore = (c: Clipping) =>
  (c.hatena_bookmark_count ?? 0) +
  (c.yahoo_comment_count ?? 0) +
  (c.facebook_engagement_count ?? 0) +
  (c.view_count ?? 0)

const snsPublisherMap: { [key: string]: string[] } = {
  x: ["x.com"],
  youtube: ["youtube"],
  sns: ["facebook", "tiktok", "instagram", "threads"],
} as const

const Page: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params)
  const [project, setProject] = useState<ClippingProject>()
  const [clippings, setClippings] = useState<Clipping[]>()
  const [date, setDate] = useState<dayjs.Dayjs>(
    dayjs().startOf("day").subtract(1, "days")
  )
  const [filter, setFilter] = useState<{
    sourcePublisher?: "news" | "youtube" | "x" | "sns"
  }>({})
  useEffect(() => {
    const fetch = async () => {
      if (project) return
      const { project: p } =
        await api.v1.showProjectApiV1ClippingsProjectsIdGet({
          id,
        })
      setProject(p)
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => {
    const fetch = async () => {
      if (!project) return
      const { clippings } = await api.v1.indexApiV1ClippingsGet({
        projectId: project.id,
        publishDate: date.format("YYYY-MM-DD HH:mm:ss"),
        publishDateBefore: date.add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        statusList: [
          "SystemAccepted",
          "SystemDenied",
          "SystemPending",
          "UserAccepted",
          "UserDenied",
          "UserPending",
          "UnKnownHost",
          "Error",
        ],
      })
      setClippings(clippings)
    }
    fetch()
  }, [project, date])

  const filteredClippings = clippings
    ?.filter(
      (c) =>
        !filter.sourcePublisher ||
        (filter.sourcePublisher === "news"
          ? Object.values(snsPublisherMap)
              .flat()
              .every((p) => p !== c.source_publisher?.toLowerCase())
          : snsPublisherMap[filter.sourcePublisher].includes(
              c.source_publisher?.toLowerCase()
            ))
    )
    .toSorted((a, b) => impactScore(b) - impactScore(a))
  return (
    <>
      {project ? (
        <>
          <div>
            {clippings && (
              <>
                <h2
                  style={{
                    fontSize: "1rem",
                    margin: "0",
                    padding: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {project.name}
                </h2>
                <div
                  style={{ display: "flex", gap: ".5rem", padding: ".5rem" }}
                >
                  <select
                    onChange={(e) => setDate(dayjs(e.target.value))}
                    style={{
                      background: "#f9f9f9",
                      border: "none",
                      borderRadius: "1rem",
                      padding: ".5rem",
                    }}
                  >
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <option
                          key={i}
                          value={dayjs()
                            .startOf("day")
                            .subtract(i + 1, "days")
                            .startOf("day")
                            .format("YYYY-MM-DD HH:mm:ss")}
                        >
                          {dayjs()
                            .startOf("day")
                            .subtract(i + 1, "days")
                            .format("M/D")}
                        </option>
                      ))}
                  </select>
                  <FilterButton
                    isActive={!filter.sourcePublisher}
                    onClick={() =>
                      setFilter({ ...filter, sourcePublisher: undefined })
                    }
                  >
                    All
                  </FilterButton>
                  <FilterButton
                    isActive={filter.sourcePublisher === "news"}
                    onClick={() =>
                      setFilter({ ...filter, sourcePublisher: "news" })
                    }
                  >
                    News
                  </FilterButton>
                  <FilterButton
                    isActive={filter.sourcePublisher === "youtube"}
                    onClick={() =>
                      setFilter({ ...filter, sourcePublisher: "youtube" })
                    }
                  >
                    YouTube
                  </FilterButton>
                  <FilterButton
                    isActive={filter.sourcePublisher === "x"}
                    onClick={() =>
                      setFilter({ ...filter, sourcePublisher: "x" })
                    }
                  >
                    X.com
                  </FilterButton>
                  <FilterButton
                    isActive={filter.sourcePublisher === "sns"}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        sourcePublisher: "sns",
                      })
                    }
                  >
                    Other SNS
                  </FilterButton>
                </div>
                <div
                  style={{
                    background: "#eef2f6",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".15rem",
                  }}
                >
                  <div
                    style={{
                      borderLeft: "solid 2px #777",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: ".5rem",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>News</div>
                    <div style={{ fontSize: ".75rem", lineHeight: 2 }}>
                      {filteredClippings.length}件
                    </div>
                  </div>
                  {filteredClippings.slice(0, 20).map((clipping) => (
                    <a
                      key={clipping.id}
                      href={clipping.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#f8f9fa",
                        display: "block",
                        textDecoration: "none",
                        padding: "0.5rem",
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
                      <h3
                        style={{
                          color: "#66c",
                          fontSize: ".8rem",
                          fontWeight: "normal",
                          height: "1.2rem",
                          margin: 0,
                          overflow: "hidden",
                          padding: 0,
                        }}
                      >
                        {clipping.original_title ?? clipping.title}
                      </h3>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Loading</h2>
        </>
      )}
    </>
  )
}

export default Page
