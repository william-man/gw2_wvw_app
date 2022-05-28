import organiseData from "../components/region_components/organise_data";
import { worlds } from "../mocks/data";

const scores = [
  {
    id: "1-1",
    all_worlds: {
      red: [1018, 1017],
      blue: [1002, 1005],
      green: [1004, 1016],
    },
    victory_points: {
      red: 270,
      blue: 276,
      green: 330,
    },
  },
  {
    id: "1-2",
    all_worlds: { red: [1011, 1009], blue: [1001, 1020], green: [1006, 1019] },
    victory_points: { red: 282, blue: 281, green: 313 },
  },
];
test("check data is organised to be displayed", () => {
  expect(organiseData(scores, worlds)).toStrictEqual([
    {
      id: "1-1",
      redworlds: "Tarnished Coast, Northern Shiverpeaks",
      blueworlds: "Borlis Pass, Maguuma",
      greenworlds: "Henge of Denravi, Sea of Sorrows",
      red_vpoints: 270,
      blue_vpoints: 276,
      green_vpoints: 330,
    },
    {
      id: "1-2",
      redworlds: "Fort Aspenwood, Stormbluff Isle",
      blueworlds: "Anvil Rock, Ferguson's Crossing",
      greenworlds: "Sorrow's Furnace, Blackgate",
      red_vpoints: 282,
      blue_vpoints: 281,
      green_vpoints: 313,
    },
  ]);
});
