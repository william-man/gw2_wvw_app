import Link from "next/link";

export default function Home() {
  return (
    <div className="index-display">
      <div className="index-heading">
        <h1>Choose your region:</h1>
      </div>
      <div className="index-links">
        <div className="link-NA region-links">
          <Link
            href={{
              pathname: "/region/[region_id]",
              query: { region_id: "NA" },
            }}
          >
            <a>North America</a>
          </Link>
        </div>
        <div className="link-EU region-links">
          <Link
            href={{
              pathname: "/region/[region_id]",
              query: { region_id: "EU" },
            }}
          >
            <a>Europe</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
