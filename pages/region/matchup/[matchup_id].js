import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const worldsReducer = (state, action) => {
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

const dataReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING_DATA":
      return { isLoadingData: true, isLoadingError: false };
    case "FETCHING_DATA_SUCCESS":
      return {
        isLoadingData: false,
        isLoadingError: false,
        overview: action.payload,
      };
    case "FETCHING_DATA_FAILURE":
      return { isLoadingData: false, isLoadingError: true };
    default:
      return state;
  }
};

const COLORS = ["#bf2626", "#2db2e3", "#40bf26"];

const matchupDetails = () => {
  // world data
  const [worldsState, dispatchWorlds] = useReducer(worldsReducer, {
    isLoadingWorlds: false,
    isWorldsError: false,
    worldsData: [],
  });
  // match overview data
  const [matchData, dispatchData] = useReducer(dataReducer, {
    isLoadingData: true,
    isLoadingError: false,
    overview: [],
  });

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [redWorlds, setRedWorlds] = useState("");
  const [blueWorlds, setBlueWorlds] = useState("");
  const [greenWorlds, setGreenWorlds] = useState("");
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

  //fetch overview of selected match
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatchData({ type: "FETCHING_DATA" });
        const result = await axios(
          "https://api.guildwars2.com/v2/wvw/matches/" + router.query.matchup_id
        );
        dispatchData({ type: "FETCHING_DATA_SUCCESS", payload: result.data });
      } catch (error) {
        dispatchData({ type: "FETCHING_DATA_FAILURE" });
      }
    };
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  // sort worlds after data is fetched

  useEffect(() => {
    const mapWorlds = () => {
      if (matchData.overview !== undefined && matchData.overview.length !== 0) {
        setRedWorlds(map_worldid(matchData.overview.all_worlds.red));
        setBlueWorlds(map_worldid(matchData.overview.all_worlds.blue));
        setGreenWorlds(map_worldid(matchData.overview.all_worlds.green));
      }
    };
    mapWorlds();
  }, [matchData.overview]);

  // Map world id to their names

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

  // reorganise data for drawing Line chart
  useEffect(() => {
    if (matchData.overview !== undefined && matchData.overview.length !== 0) {
      let new_data = [];
      for (let i = 0; i < matchData.overview.skirmishes.length; i++) {
        let skirmishData = {
          id: matchData.overview.skirmishes[i].id,
          red_team: matchData.overview.skirmishes[i].scores.red,
          blue_team: matchData.overview.skirmishes[i].scores.blue,
          green_team: matchData.overview.skirmishes[i].scores.green,
        };
        new_data.push(skirmishData);
      }
      setLineData(new_data);
    }
  }, [matchData.overview]);

  // reorganise data for drawing pie chart
  useEffect(() => {
    if (matchData.overview !== undefined && matchData.overview.length !== 0) {
      let new_piedata = [];
      for (
        let i = 0;
        i < Object.keys(matchData.overview.victory_points).length;
        i++
      ) {
        let points = {
          team: Object.keys(matchData.overview.victory_points)[i],
          points: Object.values(matchData.overview.victory_points)[i],
        };
        new_piedata.push(points);
      }
      setPieData(new_piedata);
    }
  }, [matchData.overview]);

  const drawLineChart = () => {
    return (
      <LineChart width={1200} height={600} data={lineData}>
        <Line type="monotone" dataKey="red_team" stroke="#AA3939" />
        <Line type="monotone" dataKey="blue_team" stroke="#006DD6" />
        <Line type="monotone" dataKey="green_team" stroke="#00E328" />
        <CartesianGrid strokeDasharray={"1 1"} />
        <XAxis
          dataKey={"id"}
          label={{ value: "Skirmish number", position: "insideBottom" }}
        />
        <YAxis label={{ value: "Score", position: "insideLeft", angle: -90 }} />
        <Tooltip />
        <Legend />
      </LineChart>
    );
  };

  const drawPieChart = () => {
    return (
      <PieChart width={300} height={300}>
        <Pie
          data={pieData}
          dataKey="points"
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  };
  return (
    <div className="matchup-display-container">
      <div className="match-heading">
        <h1>
          Current Matchup: {redWorlds} vs {blueWorlds} vs {greenWorlds}{" "}
        </h1>
      </div>

      {worldsState.isLoadingData === true ||
      matchData.isLoadingData === true ? (
        <div className="match-result-row">
          <div>Spinner</div>
        </div>
      ) : worldsState.isLoadingError === true ||
        matchData.isLoadingError === true ? (
        <div className="match-result-row">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="match-result-row">
          <div className="match-result-table">
            <h3>Scores:</h3>
            <table>
              <tr>
                <th>World(s)</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>K/D</th>
              </tr>
              <tr className="red-team">
                <td>{redWorlds}</td>
                <td>{matchData.overview.kills.red}</td>
                <td>{matchData.overview.deaths.red}</td>
                <td>
                  {Math.floor(
                    (matchData.overview.kills.red /
                      matchData.overview.deaths.red) *
                      10
                  ) / 10}
                </td>
              </tr>
              <tr className="blue-team">
                <td>{blueWorlds}</td>
                <td>{matchData.overview.kills.blue}</td>
                <td>{matchData.overview.deaths.blue}</td>
                <td>
                  {Math.floor(
                    (matchData.overview.kills.blue /
                      matchData.overview.deaths.blue) *
                      10
                  ) / 10}
                </td>
              </tr>
              <tr className="green-team">
                <td>{greenWorlds}</td>
                <td>{matchData.overview.kills.green}</td>
                <td>{matchData.overview.deaths.green}</td>
                <td>
                  {Math.floor(
                    (matchData.overview.kills.green /
                      matchData.overview.deaths.green) *
                      10
                  ) / 10}
                </td>
              </tr>
            </table>
          </div>
          <div className="match-result-pie">
            <h3>Victory Points:</h3>
            <div className="pie">{drawPieChart()}</div>
          </div>
          <div className="match-result-line">
            <h2>Skirmish Scores</h2>
            <h3>Across all borderlands</h3>
            <div className="line">{drawLineChart()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default matchupDetails;
