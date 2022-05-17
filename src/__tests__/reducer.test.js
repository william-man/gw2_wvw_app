import dataReducer from "../components/reducers/region_reducers";

const initialState = {
  isLoading: false,
  isLoadingError: false,
  fetchedData: [],
};

test("reducer returns loading state when given action type: FETCHING_DATA", () => {
  expect(dataReducer(initialState, { type: "FETCHING_DATA" })).toStrictEqual({
    isLoading: true,
    isLoadingError: false,
  });
});

test("reducer returns failure state when given action type: FETCHING_FAILURE", () => {
  expect(dataReducer(initialState, { type: "FETCHING_FAILURE" })).toStrictEqual(
    {
      isLoading: false,
      isLoadingError: true,
    }
  );
});

test("reducer returns success state when given action type: FETCHING_SUCCESS", () => {
  expect(
    dataReducer(initialState, { type: "FETCHING_SUCCESS", payload: ["data"] })
  ).toStrictEqual({
    isLoading: false,
    isLoadingError: false,
    fetchedData: ["data"],
  });
});
