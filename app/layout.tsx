import { AuthInitializer } from "components/commons/auth-initializer"
import { Loading } from "components/commons/loading"
import "../styles/global.css"
import Link from "next/link"

export const metadata = {
  title: "caiwai",
  description: "Curatred news and articles for public relations professionals",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            display: "flex",
            justifyContent: "space-between",
            padding: ".5rem",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", lineHeight: 1.5, margin: 0 }}>
            caiwai
          </h1>
          <Link
            href="/project"
            style={{ fontSize: ".75rem", fontWeight: "bold" }}
          >
            マイページ
          </Link>
        </header>
        <AuthInitializer />
        <main
          style={{
            margin: "auto",
            maxWidth: "72rem",
          }}
        >
          {children}
        </main>
        <Loading />
        <footer style={{ textAlign: "center", padding: "1rem" }}>
          <p>Curated and Processed by catchball Inc.</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
