import { ImageResponse } from "next/og";
import { getProject } from "@/data/projects";

export const alt = "Stephen Hung — case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);

  const title = project?.title ?? "case study";
  const summary = project?.summary ?? "";
  const award = project?.award ?? "";
  const stack = project?.stack ?? [];
  const year = project?.year ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            color: "#b3b3b3",
            fontFamily: "monospace",
          }}
        >
          <span>stephenhung.me / works / {slug}</span>
          <span>{year}</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: "28px",
              color: "#b3b3b3",
              fontFamily: "monospace",
              marginBottom: "24px",
            }}
          >
            case study
          </div>
          <div
            style={{
              fontSize: title.length > 10 ? "180px" : "220px",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: "-0.06em",
              color: "#000000",
              marginBottom: "32px",
            }}
          >
            {title}
          </div>
          {summary && (
            <div
              style={{
                fontSize: "28px",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                color: "#333333",
                maxWidth: "1000px",
                fontWeight: 500,
              }}
            >
              {summary.length > 140 ? summary.slice(0, 137) + "..." : summary}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "20px",
            color: "#666666",
            fontFamily: "monospace",
          }}
        >
          {award && (
            <div style={{ color: "#000000", fontWeight: 500 }}>
              {award.length > 90 ? award.slice(0, 87) + "..." : award}
            </div>
          )}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, color: "#000000" }}>stephen hung</span>
            {stack.length > 0 && <span>·</span>}
            {stack.slice(0, 5).map((tech, i) => (
              <span key={tech} style={{ display: "flex", gap: "20px" }}>
                {tech}
                {i < Math.min(stack.length, 5) - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
