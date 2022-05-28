const dataReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING_DATA":
      return {
        isLoading: true,
        isLoadingError: false,
      };
    case "FETCHING_SUCCESS":
      return {
        isLoading: false,
        isLoadingError: false,
        fetchedData: action.payload,
      };
    case "FETCHING_FAILURE":
      return {
        isLoading: false,
        isLoadingError: true,
      };
    case "RETRIEVE_FROM_STORAGE":
      return {
        isLoading: false,
        isLoadingError: false,
        fetchedData: action.payload,
      }
    default:
      return state;
  }
};

export default dataReducer;
