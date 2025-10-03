import { Loading } from "components/commons/loading"
import "../styles/global.css"

export const metadata = {
  title: "Caiwai",
  description: "Curatred news and articles for public relations professionals",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#f8f9fa",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <h1 style={{ fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>
            Caiwai
          </h1>
        </header>
        <main
          style={{
            margin: "auto",
            maxWidth: "64rem",
          }}
        >
          {children}
        </main>
        <Loading />
        <footer style={{ textAlign: "center", padding: "1rem" }}>
          <p>&copy; 2025 Cathball, Inc.</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
