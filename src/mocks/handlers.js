import { rest } from "msw";
import { worlds } from "./data";

const data = { id: 1001, name: "Anvil Rock", population: "Medium" };

export const handlers = [
  rest.get("https://api.guildwars2.com/v2/worlds?ids=all", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(worlds)
    );
  }),
];
