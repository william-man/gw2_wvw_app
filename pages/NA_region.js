import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

const worldsFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING_WORLDS":
      return { isLoadingWorlds: true, isWorldsError: false };
    case "FETCHING_WORLDS_SUCCESS":
      return {
        isLoadingWorlds: false,
        isWorldsError: false,
        worldsData: action.payload,
      };
    case "FETCHING_WORLDS_FAILURE":
      return { isLoadingWorlds: false, isWorldsError: true };
    default:
      return state;
  }
};

const matchesFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING_MATCHES":
      return { isLoadingMatches: true, isMatchesError: false };
    case "FETCHING_MATCHES_SUCCESS":
      return {
        isLoadingMatches: false,
        isMatchesError: false,
        matchesData: action.payload,
      };
    case "FETCHING_MATCHES_FAILURE":
      return { isLoadingMatches: false, isMatchesError: true };
    default:
      return state;
  }
};

const overviewFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING_OVERVIEW":
      return { isLoadingOverview: true, isOverviewError: false };
    case "FETCHING_OVERVIEW_SUCCESS":
      return {
        isLoadingOverview: false,
        isOverviewError: false,
        overviewData: action.payload,
      };
    case "FETCHING_OVERVIEW_FAILURE":
      return { isLoadingOverview: false, isOverviewError: true };
    default:
      return state;
  }
};

const NA_region = () => {
  // world data states
  const [worldsState, dispatchWorlds] = useReducer(worldsFetchReducer, {
    isLoadingWorlds: false,
    isWorldsError: false,
    worldsData: [],
  });
  // match data states
  const [matchesState, dispatchMatches] = useReducer(matchesFetchReducer, {
    isLoadingMatches: false,
    isMatchesError: false,
    matchesData: [],
  });

  // match overview data states
  const [overviewState, dispatchOverview] = useReducer(overviewFetchReducer, {
    isLoadingOverview: false,
    isOverviewError: false,
    overviewData: [],
  });

  // reorganised matchup data into new object
  const [cleanedData, setCleanedData] = useState([]);

  //fetch names of all worlds
  useEffect(() => {
    const fetchWorlds = async () => {
      dispatchWorlds({ type: "FETCHING_WORLDS" });
      try {
        const worldList = await axios(
          "https://api.guildwars2.com/v2/worlds?ids=all"
        );
        dispatchWorlds({
          type: "FETCHING_WORLDS_SUCCESS",
          payload: worldList.data,
        });
      } catch (error) {
        dispatchWorlds({ type: "FETCHING_WORLDS_FAILURE" });
      }
    };
    fetchWorlds();
  }, []);

  //fetch all current matches
  useEffect(() => {
    const fetchMatches = async () => {
      dispatchMatches({ type: "FETCHING_MATCHES" });
      try {
        const matchList = await axios(
          "https://api.guildwars2.com/v2/wvw/matches"
        );
        dispatchMatches({
          type: "FETCHING_MATCHES_SUCCESS",
          payload: matchList.data,
        });
      } catch (error) {
        dispatchMatches({ type: "FETCHING_MATCHES_FAILURE" });
      }
    };
    fetchMatches();
  }, []);

  //fetch overview of all current matches
  useEffect(() => {
    const fetchOverview = async () => {
      dispatchOverview({ type: "FETCHING_OVERVIEW" });
      const match_data = [];
      try {
        let id_list = [...matchesState.matchesData];

        for (let i = 0; i < id_list.length; i++) {
          if (id_list[i][0] === "1") {
            const result = await axios(
              "https://api.guildwars2.com/v2/wvw/matches/" + id_list[i]
            );
            match_data.push(result.data);
          }
        }

        dispatchOverview({
          type: "FETCHING_OVERVIEW_SUCCESS",
          payload: match_data,
        });
      } catch (error) {
        dispatchOverview({ type: "FETCHING_OVERVIEW_FAILURE" });
      }
    };
    fetchOverview();
  }, [matchesState.matchesData]);

  // create new object with the fetched data
  useEffect(() => {
    if (
      overviewState.overviewData !== undefined &&
      overviewState.overviewData.length !== 0
    ) {
      let new_data = [];
      for (let i = 0; i < overviewState.overviewData.length; i++) {
        let id_props = {
          id: overviewState.overviewData[i].id,
          redworlds: map_worldid(overviewState.overviewData[i].all_worlds.red),
          blueworlds: map_worldid(
            overviewState.overviewData[i].all_worlds.blue
          ),
          greenworlds: map_worldid(
            overviewState.overviewData[i].all_worlds.green
          ),
          red_vpoints: overviewState.overviewData[i].victory_points.red,
          blue_vpoints: overviewState.overviewData[i].victory_points.blue,
          green_vpoints: overviewState.overviewData[i].victory_points.green,
        };
        new_data.push(id_props);
      }

      setCleanedData(new_data);
      console.log(new_data);
    }
  }, [overviewState.overviewData]);

  const map_worldid = (world_list) => {
    let team = "";
    for (let i = 0; i < worldsState.worldsData.length; i++) {
      if (world_list.includes(worldsState.worldsData[i].id)) {
        if (i === worldsState.worldsData.length - 2) {
          team = team + worldsState.worldsData[i].name;
        } else {
          team = team + worldsState.worldsData[i].name;
        }
      }
    }

    return team;
  };

  return (
    <div className="display-grid">
      <h1>l</h1>
    </div>
  );
};

export default NA_region;
