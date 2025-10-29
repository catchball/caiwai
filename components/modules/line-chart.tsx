import dynamic from "next/dynamic"

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

export const LineChart = (
  <Chart
    type="line"
    options={{ chart: { background: "transparent" } }}
    width={"100%"}
  />
)
