import { ImageResponse } from "next/og";

export const alt = "Stephen Hung - full-stack developer, UC Berkeley";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
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
          <span>stephenhung.me</span>
          <span>available for work</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "24px",
                color: "#b3b3b3",
                fontFamily: "monospace",
                marginBottom: "20px",
              }}
            >
              full-stack developer · uc berkeley
            </div>
            <div
              style={{
                fontSize: "180px",
                fontWeight: 600,
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                color: "#000000",
              }}
            >
              Stephen Hung
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#333333",
            fontFamily: "monospace",
            display: "flex",
            gap: "32px",
          }}
        >
          <span>opal</span>
          <span>·</span>
          <span>darwin</span>
          <span>·</span>
          <span>bip</span>
          <span>·</span>
          <span>clarifai</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
