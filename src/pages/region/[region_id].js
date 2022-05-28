import React, { useState, useEffect, useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import fetcher from "../../components/region_components/fetch_data";
import dataReducer from "../../components/reducers/data_reducers";
import organiseData from "../../components/region_components/organise_data";

const Region_Details = () => {
  // world data states
  const [worldsState, dispatchWorlds] = useReducer(dataReducer, {
    isLoading: false,
    isLoadingError: false,
    fetchedData: [],
  });
  // match data states
  const [matchesState, dispatchMatches] = useReducer(dataReducer, {
    isLoading: false,
    isLoadingError: false,
    fetchedData: [],
  });

  // match score data states
  const [scoreState, dispatchScore] = useReducer(dataReducer, {
    isLoading: false,
    isLoadingError: false,
    fetchedData: [],
  });

  // reorganised matchup data into new object
  const [cleanedData, setCleanedData] = useState([]);
  const router = useRouter();

  //fetch names of all worlds
  useEffect(() => {
    const fetchWorlds = async () => {
      dispatchWorlds({ type: "FETCHING_DATA" });
      const result = await fetcher(
        "https://api.guildwars2.com/v2/worlds?ids=all"
      );
      if (result.status === 200) {
        dispatchWorlds({
          type: "FETCHING_SUCCESS",
          payload: JSON.stringify(result.data),
        });
      } else {
        dispatchWorlds({ type: "FETCHING_FAILURE" });
      }
    };
    if (!sessionStorage.getItem("worlds")) {
      fetchWorlds();
    } else if (sessionStorage.getItem("matches")) {
      dispatchWorlds({
        type: "RETRIEVE_FROM_STORAGE",
        payload: sessionStorage.getItem("worlds"),
      });
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("worlds") && worldsState.fetchedData) {
      sessionStorage.setItem("worlds", worldsState.fetchedData);
    }
  }, [worldsState.fetchedData]);

  //fetch all current matches
  useEffect(() => {
    const fetchMatches = async () => {
      dispatchMatches({ type: "FETCHING_DATA" });
      const result = await fetcher("https://api.guildwars2.com/v2/wvw/matches");
      if (result.status === 200) {
        dispatchMatches({
          type: "FETCHING_SUCCESS",
          payload: JSON.stringify(result.data),
        });
      } else {
        dispatchMatches({ type: "FETCHING_FAILURE" });
      }
    };
    if (!sessionStorage.getItem("matches")) {
      fetchMatches();
    } else if (sessionStorage.getItem("matches")) {
      dispatchMatches({
        type: "RETRIEVE_FROM_STORAGE",
        payload: sessionStorage.getItem("matches"),
      });
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("matches") && matchesState.fetchedData) {
      sessionStorage.setItem("matches", matchesState.fetchedData);
    }
  }, [matchesState.fetchedData]);

  //fetch score of all current matches
  useEffect(() => {
    const fetchscore = async (n) => {
      dispatchScore({ type: "FETCHING_DATA" });
      let match_list = "";
      const fetched_matches = JSON.parse(matchesState.fetchedData);
      for (let i = 0; i < fetched_matches.length; i++) {
        if (fetched_matches[i][0] === n) {
          match_list = match_list + fetched_matches[i] + ",";
        }
      }
      const result = await fetcher(
        "https://api.guildwars2.com/v2/wvw/matches?ids=" + match_list
      );
      if (result.status === 206) {
        dispatchScore({
          type: "FETCHING_SUCCESS",
          payload: JSON.stringify(result.data),
        });
      } else {
        dispatchScore({
          type: "FETCHING_FAILURE",
        });
      }
    };
    if (matchesState.fetchedData && matchesState.fetchedData.length > 0) {
      if (
        router.query.region_id === "NA" &&
        !sessionStorage.getItem("NA_data")
      ) {
        fetchscore("1");
      } else if (
        router.query.region_id === "EU" &&
        !sessionStorage.getItem("EU_data")
      ) {
        fetchscore("2");
      } else if (
        router.query.region_id === "NA" &&
        sessionStorage.getItem("NA_data")
      ) {
        dispatchScore({
          type: "RETRIEVE_FROM_STORAGE",
          payload: sessionStorage.getItem("NA_data"),
        });
      } else if (
        router.query.region_id === "EU" &&
        sessionStorage.getItem("EU_data")
      ) {
        dispatchScore({
          type: "RETRIEVE_FROM_STORAGE",
          payload: sessionStorage.getItem("EU_data"),
        });
      }
    }
  }, [matchesState.fetchedData]);

  useEffect(() => {
    if (
      router.query.region_id === "NA" &&
      scoreState.fetchedData &&
      !sessionStorage.getItem("NA_data")
    ) {
      sessionStorage.setItem("NA_data", scoreState.fetchedData);
    } else if (
      router.query.region_id === "EU" &&
      scoreState.fetchedData &&
      !sessionStorage.getItem("EU_data")
    ) {
      sessionStorage.setItem("EU_data", scoreState.fetchedData);
    }
  }, [scoreState.fetchedData]);

  // create new object with the fetched data
  useEffect(() => {
    if (
      scoreState.fetchedData &&
      scoreState.fetchedData.length > 0 &&
      worldsState.fetchedData &&
      worldsState.fetchedData.length > 0
    ) {
      const data = organiseData(
        JSON.parse(scoreState.fetchedData),
        JSON.parse(worldsState.fetchedData)
      );
      setCleanedData(data);
    }
  }, [scoreState.fetchedData, worldsState.fetchedData]);

  return (
    <div className="reg_display_container">
      <div className="back">
        <Link
          href={{
            pathname: "/",
          }}
        >
          <a>Go Back</a>
        </Link>
      </div>
      <div className="heading-row">
        {router.query.region_id === "NA" ? (
          <h3>NA region match up data</h3>
        ) : (
          <h3>EU region match up data</h3>
        )}
      </div>

      {worldsState.isLoading === true ||
      matchesState.isLoading === true ||
      scoreState.isLoading === true ? (
        <div className="result-row">
          <div className="loader"></div>
        </div>
      ) : worldsState.isWorldsError === true ||
        matchesState.isMatchesError === true ||
        scoreState.isscoreError === true ? (
        <div className="result-row">
          <div className="error">
            Sorry an error has occurred. Please try again.
          </div>
        </div>
      ) : (
        <div className="result-row">
          {cleanedData.map((data) => {
            return (
              <div key={router.query.region_id + data.id}>
                <h3>Tier {data.id[2]}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>World(s)</th>
                      <th>Victory Points</th>
                      <th>History</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data.redworlds}</td>
                      <td className="points">{data.red_vpoints}</td>
                      <td className="history" rowSpan={3}>
                        <Link
                          href={{
                            pathname: "matchup/[matchup_id]",
                            query: {
                              matchup_id: data.id,
                              region_id: router.query.region_id,
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
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Region_Details;
