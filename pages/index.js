import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <h1>Choose your region:</h1>
      </div>
      <div>
        <Link href="/NA_region">
          <a>NA</a>
        </Link>

        <Link href="/EU_region">
          <a>EU</a>
        </Link>
      </div>
    </>
  );
}
