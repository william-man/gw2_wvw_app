import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

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

const Region_Details = () => {
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
  const router = useRouter();

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
          if (id_list[i][0] === "1" && router.query.region_id === "NA") {
            const result = await axios(
              "https://api.guildwars2.com/v2/wvw/matches/" + id_list[i]
            );
            match_data.push(result.data);
          } else if (id_list[i][0] === "2" && router.query.region_id === "EU") {
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

  //sort worlds after data is fetched
  
  const map_worldid = (world_list) => {
    let team = "";
    for (let i = 0; i < worldsState.worldsData.length; i++) {
      if (world_list.includes(worldsState.worldsData[i].id)) {
        if (team === "") {
          team = team + worldsState.worldsData[i].name + ", ";
        } else {
          team = team + worldsState.worldsData[i].name;
        }
      }
    }
    return team;
  };
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
    }
  }, [overviewState.overviewData]);

  return (
    <div className="reg_display_container">
      <div className="back">
        <button type="button" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
      <div className="heading-row">
        {router.query.region_id === "NA" ? (
          <h1>NA region Matchup data</h1>
        ) : (
          <h1>EU region Matchup data</h1>
        )}
      </div>

      {worldsState.isLoadingWorlds === true ||
      matchesState.isLoadingMatches === true ||
      overviewState.isLoadingOverview === true ? (
        <div className="result-row">
          <div className="loader"></div>
        </div>
      ) : worldsState.isWorldsError === true ||
        matchesState.isMatchesError === true ||
        overviewState.isOverviewError === true ? (
        <div className="result-row">
          <div className="error">
            Sorry an error has occurred. Please try again.
          </div>
        </div>
      ) : (
        <div className="result-row">
          {cleanedData.map((data) => {
            return (
              <>
                <h2>Tier {data.id[2]}</h2>
                <table>
                  <tr>
                    <th>World(s)</th>
                    <th>Victory Points</th>
                    <th>History</th>
                  </tr>
                  <tr>
                    <td>{data.redworlds}</td>
                    <td className="points">{data.red_vpoints}</td>
                    <td className="history" rowSpan={3}>
                      <Link
                        href={{
                          pathname: "matchup/[matchup_id]",
                          query: {
                            matchup_id: data.id,
                          },
                        }}
                      >
                        <a>More info</a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>{data.blueworlds}</td>
                    <td className="points">{data.blue_vpoints}</td>
                  </tr>
                  <tr>
                    <td>{data.greenworlds}</td>
                    <td className="points">{data.green_vpoints}</td>
                  </tr>
                  <tr></tr>
                </table>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Region_Details;
