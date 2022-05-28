import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import DrawLineChart from "../../../components/match_components/charts/line";
import Link from "next/link";
import mapWorldid from "../../../components/region_components/worldname";
import dataReducer from "../../../components/reducers/data_reducers";
import Retrieve from "../../../components/match_components/retrieve";

const COLORS = ["#bf2626", "#2db2e3", "#40bf26"];

const MatchupDetails = () => {
  const [worldsState, dispatchWorlds] = useReducer(dataReducer, {
    isLoading: false,
    isLoadingError: false,
    fetchedData: [],
  });
  const [dataState, dispatchData] = useReducer(dataReducer, {
    isLoading: false,
    isLoadingError: false,
    fetchedData: [],
  });
  const [lineData, setLineData] = useState([]);
  const [redWorlds, setRedWorlds] = useState("");
  const [blueWorlds, setBlueWorlds] = useState("");
  const [greenWorlds, setGreenWorlds] = useState("");
  const [height, setHeight] = useState(360);
  const router = useRouter();

  //fetch names of all worlds
  useEffect(() => {
    dispatchWorlds({
      type: "FETCHING_DATA",
    });
    if (sessionStorage.getItem("worlds")) {
      dispatchWorlds({
        type: "FETCHING_SUCCESS",
        payload: JSON.parse(sessionStorage.getItem("worlds")),
      });
    } else {
      dispatchWorlds({
        type: "FETCHING_FAILURE",
      });
    }
  }, []);

  //fetch overview of selected match
  useEffect(() => {
    dispatchData({
      type: "FETCHING_DATA",
    });
    let targetData = "";
    if (router.query.region_id === "EU" && sessionStorage.getItem("EU_data")) {
      targetData = "EU_data";
      dispatchData({
        type: "FETCHING_SUCCESS",
        payload: Retrieve(
          JSON.parse(sessionStorage.getItem("EU_data")),
          router.query.matchup_id
        ),
      });
    } else if (
      router.query.region_id === "NA" &&
      sessionStorage.getItem("NA_data")
    ) {
      targetData = "NA_data";
      dispatchData({
        type: "FETCHING_SUCCESS",
        payload: Retrieve(
          JSON.parse(sessionStorage.getItem("NA_data")),
          router.query.matchup_id
        ),
      });
    } else {
      dispatchData({
        type: "FETCHING_FAILURE",
      });
    }
  }, []);

  // sort worlds after data is fetched

  useEffect(() => {
    if (dataState.fetchedData && worldsState.fetchedData.length > 0) {
      setRedWorlds(
        mapWorldid(
          dataState.fetchedData.all_worlds.red,
          worldsState.fetchedData
        )
      );
      setBlueWorlds(
        mapWorldid(
          dataState.fetchedData.all_worlds.blue,
          worldsState.fetchedData
        )
      );
      setGreenWorlds(
        mapWorldid(
          dataState.fetchedData.all_worlds.green,
          worldsState.fetchedData
        )
      );
    }
  }, [dataState.fetchedData]);

  // reorganise data for drawing Line chart
  useEffect(() => {
    if (
      dataState.fetchedData !== undefined &&
      Object.keys(dataState.fetchedData).length > 0
    ) {
      let skirmishData = [];
      for (let i = 0; i < dataState.fetchedData.skirmishes.length; i++) {
        let sorted = {
          id: dataState.fetchedData.skirmishes[i].id,
          red_team: dataState.fetchedData.skirmishes[i].scores.red,
          blue_team: dataState.fetchedData.skirmishes[i].scores.blue,
          green_team: dataState.fetchedData.skirmishes[i].scores.green,
        };
        skirmishData.push(sorted);
      }
      setLineData(skirmishData);
    }
  }, [dataState.fetchedData, worldsState.fetchedData]);

  //adjust height of line chart and screen sizes above 412px
  useEffect(() => {
    const mqls = window.matchMedia("(max-width: 412px)");
    const sizeChange = (mql) => {
      if (mql.matches) {
        setHeight(360);
      } else {
        setHeight(400);
      }
    };
    sizeChange(mqls);
    mqls.addEventListener("change", sizeChange);
    return () => mqls.removeEventListener("change", sizeChange);
  }, []);

  return (
    <div className="matchup-display-container">
      <div className="back">
        <Link
          href={{
            pathname: "/region/[region_id]",
            query: { region_id: router.query.region_id },
          }}
        >
          <a>Go Back</a>
        </Link>
      </div>

      {worldsState.isLoading || dataState.isLoading ? (
        <div className="Loader"></div>
      ) : worldsState.isLoadingError || dataState.isLoadingError ? (
        <div className="match-result-row">
          <div className="error">
            Sorry an error has occurred. Please try again.
          </div>
        </div>
      ) : (
        dataState.fetchedData &&
        Object.keys(dataState.fetchedData).length > 0 && (
          <div className="match-result-row">
            <div className="match-heading">
              <h3>Current Matchup: Tier {dataState.fetchedData.id[2]}</h3>
            </div>

            <div className="match-result-table">
              <h3 className="subhead">Scores:</h3>
              <table>
                <thead>
                  <tr>
                    <th>World(s)</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                    <th>K/D</th>
                    <th>War Score</th>
                    <th>Victory Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="red-team">
                    <td>{redWorlds}</td>
                    <td>{dataState.fetchedData.kills.red}</td>
                    <td>{dataState.fetchedData.deaths.red}</td>
                    <td>
                      {Math.floor(
                        (dataState.fetchedData.kills.red /
                          dataState.fetchedData.deaths.red) *
                          10
                      ) / 10}
                    </td>
                    <td>{dataState.fetchedData.scores.red}</td>
                    <td>{dataState.fetchedData.victory_points.red}</td>
                  </tr>
                  <tr className="blue-team">
                    <td>{blueWorlds}</td>
                    <td>{dataState.fetchedData.kills.blue}</td>
                    <td>{dataState.fetchedData.deaths.blue}</td>
                    <td>
                      {Math.floor(
                        (dataState.fetchedData.kills.blue /
                          dataState.fetchedData.deaths.blue) *
                          10
                      ) / 10}
                    </td>
                    <td>{dataState.fetchedData.scores.blue}</td>
                    <td>{dataState.fetchedData.victory_points.blue}</td>
                  </tr>
                  <tr className="green-team">
                    <td>{greenWorlds}</td>
                    <td>{dataState.fetchedData.kills.green}</td>
                    <td>{dataState.fetchedData.deaths.green}</td>
                    <td>
                      {Math.floor(
                        (dataState.fetchedData.kills.green /
                          dataState.fetchedData.deaths.green) *
                          10
                      ) / 10}
                    </td>
                    <td>{dataState.fetchedData.scores.green}</td>
                    <td>{dataState.fetchedData.victory_points.green}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="match-result-line">
              <h2>Skirmish Scores</h2>
              <h3 className="subhead">Across all borderlands</h3>
              <div>
                {DrawLineChart(
                  lineData,
                  height,
                  redWorlds,
                  blueWorlds,
                  greenWorlds
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MatchupDetails;
