"use client"

import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import { FilterButton } from "components/elements/form"
import dayjs from "dayjs"
import React, { FC, useEffect, useState } from "react"
import { api } from "services/api"
import {
  publisherCategoriesWithLabel,
  PublisherCategory,
  snsPublisherMap,
} from "services/constant"
import { Tweet } from "react-tweet"
import { useSetAtom } from "jotai"
import { loadingAtom } from "services/store"
import {
  ExportActiveClippingStatusList,
  groupize,
} from "@catchball/saku2-admin-lib"
import { clippingGroupSortFunc } from "services/group"

export const ProjectIdPage: FC<{ project: ClippingProject }> = ({
  project,
}) => {
  const setLoading = useSetAtom(loadingAtom)
  const [clippings, setClippings] = useState<Clipping[][]>()
  const [categrizedClippings, setCategrizedClippings] =
    useState<{ [key in PublisherCategory]: Clipping[][] }>()
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

        const { clippings: clippingIndexes } =
          await api.v1.indexApiV1ClippingsGet({
            projectId: project.id,
            publishDate: date.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
            publishDateBefore: date
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            statusList: ExportActiveClippingStatusList,
          })

        const { clippings } = await api.v1.selectApiV1ClippingsSelectPost({
          requestBody: { ids: clippingIndexes.map((c) => c.id) },
        })

        setClippings(
          groupize({ clippings, project }).toSorted(clippingGroupSortFunc)
        )
        setCategrizedClippings({
          news: groupize({
            project,
            clippings: clippings.filter((c) =>
              Object.values(snsPublisherMap)
                .flat()
                .every((p) => p !== c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
          youtube: groupize({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.youtube.includes(
                c.source_publisher?.toLowerCase()
              )
            ),
          }).toSorted(clippingGroupSortFunc),
          x: groupize({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.x.includes(c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
          sns: groupize({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.sns.includes(c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
        })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [date, project, setLoading])

  const selectedClippings = filter.sourcePublisher
    ? categrizedClippings[filter.sourcePublisher]
    : clippings

  return (
    <>
      {project ? (
        <>
          <div>
            {categrizedClippings && (
              <>
                <h2
                  style={{
                    fontSize: "3rem",
                    margin: "0",
                    padding: "0.5rem",
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
                    {Array(14)
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
                  {publisherCategoriesWithLabel.map(
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
                    borderLeft: "solid 2px #777",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: ".5rem",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {
                      publisherCategoriesWithLabel.find(
                        ({ value }) => filter.sourcePublisher == value
                      ).label
                    }
                  </div>
                  <div style={{ fontSize: ".75rem", lineHeight: 2 }}>
                    {selectedClippings.length}件
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedClippings.slice(0, 200).map((clipping) => (
                    <React.Fragment key={clipping[0].id}>
                      {filter.sourcePublisher == "x" ? (
                        <div
                          className="light"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Tweet
                            id={clipping[0].url.match(/status\/(\d+)/)?.[1]}
                          />
                        </div>
                      ) : (
                        <a
                          key={clipping[0].id}
                          href={clipping[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: clipping.some((c) => c.is_main_content)
                              ? "#f3f3fc"
                              : "#f6f6f9",
                            borderBottom: "solid 1px #ddd",
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "space-between",
                            maxWidth: "32rem",
                            minWidth: "16rem",
                            padding: "1rem",
                            textDecoration: "none",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexFlow: "column",
                              gap: ".25rem",
                              minWidth: 0,
                              position: "relative",
                            }}
                          >
                            <p
                              style={{
                                fontSize: ".625rem",
                              }}
                            >
                              {clipping.length > 1 && (
                                <>
                                  <span
                                    style={{
                                      color: "#666",
                                    }}
                                  >
                                    {clipping.length}+
                                  </span>
                                  &nbsp;
                                </>
                              )}
                              {clipping[0].source_publisher}
                              {clipping[0].category && (
                                <>&nbsp;&gt; {clipping[0].category}</>
                              )}
                            </p>
                            <h3
                              style={{
                                color: "#66c",
                                fontSize: "1rem",
                                fontWeight: "normal",
                                margin: 0,
                                maxHeight: "3rem",
                                overflow: "hidden",
                                padding: 0,
                              }}
                            >
                              {(
                                clipping[0].original_title ?? clipping[0].title
                              ).slice(0, 80)}
                            </h3>
                            <p style={{ color: "#999", fontSize: ".625rem" }}>
                              {clipping[0].body.slice(0, 100)}
                            </p>
                          </div>
                          {clipping.some((c) => !!c.thumbnail_url) && (
                            <div>
                              <figure
                                style={{
                                  backgroundImage: `url(${clipping.find((c) => !!c.thumbnail_url)?.thumbnail_url})`,
                                  backgroundSize: "cover",
                                  width: "8rem",
                                  height: "6rem",
                                }}
                              ></figure>
                            </div>
                          )}
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
