import { title as defaultTitle } from "@/app/layout";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f4f5",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #6f8b96 2%, transparent 0%), " +
            "radial-gradient(circle at 75px 75px, #6f8b96 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "40px 60px",
            boxShadow: "0 4px 6px rgba(111, 139, 150, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "72px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #6f8b96 0%, #4a6572 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
            }}
          >
            Profitory
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "6px",
              fontSize: "28px",
              color: "#4a6572",
              textAlign: "center",
              maxWidth: "800px",
              marginBottom: "32px",
              lineHeight: 1.4,
            }}
          >
            <span style={{ display: "flex" }}>Professional</span>{" "}
            <span
              style={{ display: "flex", color: "#6f8b96", fontWeight: "bold" }}
            >
              eBay
            </span>{" "}
            <span style={{ display: "flex" }}>Inventory Management</span>{" "}
            <span style={{ display: "flex" }}>&</span>{" "}
            <span
              style={{ display: "flex", color: "#6f8b96", fontWeight: "bold" }}
            >
              Analytics
            </span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#6f8b96",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "12px",
                fontFamily: "Geist Mono",
              }}
            >
              Track Inventory
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #6f8b96",
                color: "#6f8b96",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "12px",
                fontFamily: "Geist Mono",
              }}
            >
              View Analytics
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
