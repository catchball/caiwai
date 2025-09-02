"use client"

import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import { FilterButton } from "components/elements/form"
import dayjs from "dayjs"
import React, { FC, useEffect, useState } from "react"
import { api } from "services/api"
import { PublisherCategory, snsPublisherMap } from "services/constant"
import { Tweet } from "react-tweet"
import { useSetAtom } from "jotai"
import { loadingAtom } from "services/store"

const publisherCategories: { label: string; value: PublisherCategory }[] = [
  { label: "All", value: undefined },
  { label: "News", value: "news" },
  { label: "YouTube", value: "youtube" },
  { label: "X.com", value: "x" },
  { label: "Other SNS", value: "sns" },
]

export const ProjectIdPage: FC<{ project: ClippingProject }> = ({
  project,
}) => {
  const setLoading = useSetAtom(loadingAtom)
  const [clippings, setClippings] = useState<Clipping[]>()
  const [categrizedClippings, setCategrizedClippings] =
    useState<{ [key in PublisherCategory]: Clipping[] }>()
  const [date, setDate] = useState<dayjs.Dayjs>(
    dayjs().startOf("day").subtract(1, "days")
  )
  const [filter, setFilter] = useState<{
    sourcePublisher?: PublisherCategory
  }>({})
  useEffect(() => {
    const fetch = async () => {
      if (!project) return
      try {
        setLoading(true)
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
        setCategrizedClippings({
          news: clippings
            .filter((c) =>
              Object.values(snsPublisherMap)
                .flat()
                .every((p) => p !== c.source_publisher?.toLowerCase())
            )
            .toSorted((a, b) => b.score - a.score),
          youtube: clippings
            .filter((c) =>
              snsPublisherMap.youtube.includes(
                c.source_publisher?.toLowerCase()
              )
            )
            .toSorted((a, b) => b.score - a.score),
          x: clippings
            .filter((c) =>
              snsPublisherMap.x.includes(c.source_publisher?.toLowerCase())
            )
            .toSorted((a, b) => b.score - a.score),
          sns: clippings
            .filter((c) =>
              snsPublisherMap.sns.includes(c.source_publisher?.toLowerCase())
            )
            .toSorted((a, b) => b.score - a.score),
        })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [date, project, setLoading])

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
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".5rem",
                    padding: ".5rem",
                  }}
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
                  {publisherCategories.map(
                    ({ label, value }) =>
                      (!value || categrizedClippings[value].length > 0) && (
                        <FilterButton
                          key={label}
                          isActive={filter.sourcePublisher === value}
                          onClick={() =>
                            setFilter({ ...filter, sourcePublisher: value })
                          }
                        >
                          {label}
                        </FilterButton>
                      )
                  )}
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
                    <div style={{ fontWeight: "bold" }}>
                      {
                        publisherCategories.find(
                          ({ value }) => filter.sourcePublisher == value
                        ).label
                      }
                    </div>
                    <div style={{ fontSize: ".75rem", lineHeight: 2 }}>
                      {categrizedClippings[filter.sourcePublisher]?.length ??
                        clippings.length}
                      件
                    </div>
                  </div>
                  {categrizedClippings[filter.sourcePublisher || "news"]
                    .slice(0, 20)
                    .map((clipping) => (
                      <React.Fragment key={clipping.id}>
                        {filter.sourcePublisher == "x" ? (
                          <div
                            className="light"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Tweet
                              id={clipping.url.match(/status\/(\d+)/)?.[1]}
                            />
                          </div>
                        ) : (
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
                        )}
                      </React.Fragment>
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
