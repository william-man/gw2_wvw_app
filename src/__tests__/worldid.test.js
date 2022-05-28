import mapWorldid from "../components/region_components/worldname";
import { worlds } from "../mocks/data";

const team_A = [1001, 1002];

test("check world is mapped to respective id", () => {
  expect(mapWorldid(team_A, worlds)).toBe("Anvil Rock, Borlis Pass");
});
