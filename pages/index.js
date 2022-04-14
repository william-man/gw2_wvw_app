import Link from "next/link";

export default function Home() {
  return (
    <div className="index-display">
      <div className="index-heading">
        <h1>Choose your region:</h1>
      </div>
      <div className="index-links">
        <Link
          href={{
            pathname: "/region/[region_id]",
            query: { region_id: "NA" },
          }}
        >
          <a className="index-links NA">North America</a>
        </Link>

        <Link
          href={{
            pathname: "/region/[region_id]",
            query: { region_id: "EU" },
          }}
        >
          <a className="index-links EU">Europe</a>
        </Link>
      </div>
    </div>
  );
}
