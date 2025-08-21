"use client"

import { Clipping, ClippingProject } from "@catchball/tansaku-client/lib"
import dayjs from "dayjs"
import React, { FC, use, useEffect, useState } from "react"
import { api } from "services/api"

const Page: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params)
  const [project, setProject] = useState<ClippingProject>()
  const [clippings, setClippings] = useState<Clipping[]>()
  const [date, setDate] = useState<dayjs.Dayjs>(
    dayjs().startOf("day").subtract(1, "days")
  )
  useEffect(() => {
    const fetch = async () => {
      const { project } = await api.v1.showProjectApiV1ClippingsProjectsIdGet({
        id,
      })
      setProject(project)
      if (project) {
        const { clippings } = await api.v1.indexApiV1ClippingsGet({
          projectId: project.id,
          isPrimary: true,
          publishDate: date.format("YYYY-MM-DD HH:mm:ss"),
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
    }
    fetch()
  }, [])
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
                  {project.name} {date.format("M/D")}
                </h2>
                <div
                  style={{
                    background: "#eef2f6",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".15rem",
                    padding: ".15rem",
                  }}
                >
                  <div
                    style={{
                      borderLeft: "solid 2px #777",
                      padding: ".5rem",
                    }}
                  >
                    News
                  </div>
                  {clippings.map((clipping) => (
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
                        {clipping.title}
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
