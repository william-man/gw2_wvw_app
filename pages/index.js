import Link from "next/link";

export default function Home() {
  return (
    <div className="index-display">
      <div className="index-heading">
        <h3>Choose your region:</h3>
      </div>

      <div className="link-NA">
        <Link
          href={{
            pathname: "/region/[region_id]",
            query: { region_id: "NA" },
          }}
        >
          <a>North America</a>
        </Link>
      </div>
      <div className="link-EU">
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
  );
}
