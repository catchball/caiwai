"use client"

import {
  Clipping,
  ClippingProject,
  ArticlePosition,
} from "@catchball/tansaku-client/lib"
import { Button, CheckBox, FilterButton } from "components/elements/form"
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
  filterExportClippingGroup,
} from "@catchball/saku2-admin-lib"
import { clippingGroupSortFunc } from "services/group"
import { Modal } from "components/commons/modal"

const g = (props: { clippings: Clipping[]; project: ClippingProject }) =>
  filterExportClippingGroup(groupize(props))

const ArticlePostions: ArticlePosition[] = ["Title", "Beginning", "Body"]
const ArticlePostionNameMap: { [key in ArticlePosition]: string } = {
  Title: "タイトル",
  Beginning: "冒頭",
  Body: "本文",
}

export const ProjectIdPage: FC<{ project: ClippingProject }> = ({
  project,
}) => {
  const setLoading = useSetAtom(loadingAtom)
  const [clippings, setClippings] = useState<Clipping[][]>()
  const [categrizedClippings, setCategrizedClippings] =
    useState<{ [key in PublisherCategory]: Clipping[][] }>()
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs().startOf("day"))
  const [filter, setFilter] = useState<{
    sourcePublisher?: PublisherCategory
    keywordPositions?: ArticlePosition[]
  }>({ keywordPositions: ArticlePostions })
  const [isOpenTweetModal, setIsOpenTweetModal] = useState<boolean>(false)
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

        setClippings(g({ clippings, project }).toSorted(clippingGroupSortFunc))
        setCategrizedClippings({
          news: g({
            project,
            clippings: clippings.filter((c) =>
              Object.values(snsPublisherMap)
                .flat()
                .every((p) => p !== c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
          youtube: g({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.youtube.includes(
                c.source_publisher?.toLowerCase()
              )
            ),
          }).toSorted(clippingGroupSortFunc),
          x: g({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.x.includes(c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
          sns: g({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.sns.includes(c.source_publisher?.toLowerCase())
            ),
          }).toSorted(clippingGroupSortFunc),
          release: g({
            project,
            clippings: clippings.filter((c) =>
              snsPublisherMap.release.includes(
                c.source_publisher?.toLowerCase()
              )
            ),
          }).toSorted(clippingGroupSortFunc),
        })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [date, project, setLoading])

  useEffect(() => {
    if (filter.keywordPositions.length == 0)
      setFilter({ ...filter, keywordPositions: ArticlePostions })
  }, [filter, filter.keywordPositions])

  const selectedClippings = (
    filter.sourcePublisher
      ? categrizedClippings[filter.sourcePublisher]
      : clippings
  )?.filter((group) =>
    filter.keywordPositions
      ? group.some((c) =>
          filter.keywordPositions?.includes(
            c.keyword_position as (typeof ArticlePostions)[number]
          )
        )
      : true
  )

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
                  {Array(7)
                    .fill(0)
                    .map((_, i) =>
                      dayjs()
                        .subtract(6 - i, "days")
                        .startOf("day")
                    )
                    .map((day, i) => (
                      <FilterButton
                        key={i}
                        isActive={day.date() == date.date()}
                        onClick={() => setDate(day)}
                      >
                        {day.format("M/D ddd")}
                      </FilterButton>
                    ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".5rem",
                    padding: ".5rem",
                  }}
                >
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
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".5rem",
                    justifyContent: "space-between",
                    padding: ".5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      fontSize: ".875rem",
                      gap: ".5rem",
                    }}
                  >
                    {project.keyword_list.map((keyword) => (
                      <span key={keyword}>「{keyword}」</span>
                    ))}
                    を
                    {ArticlePostions.map((label) => (
                      <CheckBox
                        label={ArticlePostionNameMap[label]}
                        key={label}
                        checked={filter.keywordPositions?.includes(label)}
                        onChange={({ target: { checked } }) =>
                          setFilter({
                            ...filter,
                            keywordPositions: checked
                              ? [...(filter.keywordPositions || []), label]
                              : (filter.keywordPositions || []).filter(
                                  (p) => p !== label
                                ),
                          })
                        }
                      />
                    ))}
                    に含む
                  </div>
                  {filter.sourcePublisher == "x" && (
                    <div>
                      <Button onClick={() => setIsOpenTweetModal(true)}>
                        Embeddingで表示
                      </Button>
                    </div>
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
                  {selectedClippings.slice(0, 200).map((clippings) => (
                    <React.Fragment key={clippings[0].id}>
                      <a
                        key={clippings[0].id}
                        href={clippings[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: clippings.some((c) => c.is_main_content)
                            ? "#f3f3fc"
                            : "#f6f6f9",
                          borderBottom: "solid 1px #ddd",
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "space-between",
                          maxWidth: "32rem",
                          minWidth: "16rem",
                          overflow: "hidden",
                          padding: "1rem",
                          position: "relative",
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
                            {clippings[0].source_publisher}
                            {clippings[0].category && (
                              <>&nbsp;&gt; {clippings[0].category}</>
                            )}
                            {clippings.length > 1 && (
                              <>
                                <span
                                  style={{
                                    color: "#666",
                                  }}
                                >
                                  &nbsp;
                                  {clippings.length}+
                                </span>
                                &nbsp;
                              </>
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
                              clippings[0].original_title ?? clippings[0].title
                            ).slice(0, 80)}
                          </h3>
                          <p
                            style={{
                              color: "#999",
                              fontSize: ".625rem",
                              maxHeight: "1.875rem",
                              overflow: "hidden",
                            }}
                          >
                            {clippings[0].body.slice(0, 100)}
                          </p>
                        </div>
                        {clippings.some((c) => !!c.thumbnail_url) && (
                          <div>
                            <figure
                              style={{
                                backgroundImage: `url(${clippings.find((c) => !!c.thumbnail_url)?.thumbnail_url})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                width: "8rem",
                                height: "4.5rem",
                              }}
                            ></figure>
                          </div>
                        )}
                        <div
                          style={{
                            background: clippings.some(
                              (c) => c.keyword_position == "Title"
                            )
                              ? "#14a"
                              : clippings.some(
                                    (c) => c.keyword_position == "Beginning"
                                  )
                                ? "#289"
                                : undefined,
                            color: "#f0f0f0",
                            fontSize: ".5rem",
                            height: "1rem",
                            left: "-.5rem",
                            position: "absolute",
                            textAlign: "center",
                            top: "-.5rem",
                            transform: "rotate(-45deg)",
                            width: "1rem",
                          }}
                        ></div>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
          <Modal
            isOpen={isOpenTweetModal}
            onClose={() => setIsOpenTweetModal(false)}
          >
            <div
              className="light"
              style={{
                display: "flex",
                flexFlow: "row",
                flexWrap: "wrap",
                gap: ".5rem",
                justifyContent: "center",
              }}
            >
              {filter.sourcePublisher == "x" &&
                selectedClippings?.map((clippings, i) => (
                  <Tweet
                    key={i}
                    id={clippings[0].url.match(/status\/(\d+)/)?.[1]}
                  />
                ))}
            </div>
          </Modal>
        </>
      ) : (
        <>
          <h2>Loading</h2>
        </>
      )}
    </>
  )
}
