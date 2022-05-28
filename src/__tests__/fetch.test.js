import fetcher from "../components/region_components/fetch_data";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { worlds } from "../mocks/data";

const server = setupServer(
  rest.get("https://api.guildwars2.com/v2/worlds?ids=all", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(worlds));
  })
);

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
afterEach(() => {
  server.resetHandlers();
});

test("test data fetching with axios", async () => {
  const fetchedData = await fetcher(
    "https://api.guildwars2.com/v2/worlds?ids=all"
  );
  expect(fetchedData.data).toStrictEqual(worlds);
});

test("test fetching response failue with axios", async () => {
  server.use(
    rest.get(
      "https://api.guildwars2.com/v2/worlds?ids=all",
      (req, res, ctx) => {
        return res(ctx.status(404));
      }
    )
  );
  const fetchedData = await fetcher(
    "https://api.guildwars2.com/v2/worlds?ids=all"
  );
  expect(fetchedData.response.status).toStrictEqual(404);
});
