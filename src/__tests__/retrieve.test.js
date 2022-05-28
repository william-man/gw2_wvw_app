import Retrieve from "../components/match_components/retrieve";

const testData = [
  { id: "1-1", data: "abc" },
  { id: "1-2", data: "def" },
];
const testId = "1-1";

test("data retriever returns data respective of the correct id", () => {
  expect(Retrieve(testData, testId)).toStrictEqual({
    id: "1-1",
    data: "abc",
  });
});
