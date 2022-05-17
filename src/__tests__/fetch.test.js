import fetcher from "../components/region_components/fetch_data";

test("test data fetching with axios", () => {
  expect(fetcher("https://api.guildwars2.com/v2/worlds?ids=all")).toBe({});
});
