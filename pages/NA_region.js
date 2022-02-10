import React, { useState, useEffect } from "react";
import axios from "axios";

const NA_region = () => {
  const [worlds, setWorlds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [overview, setOverview] = useState([]);

  //fetch names of all worlds
  useEffect(() => {
    const fetchWorlds = async () => {
      const worldList = await axios(
        "https://api.guildwars2.com/v2/worlds?ids=all"
      );
      let na_check = [];
      for (let i = 0; i < worldList.data.length; i++) {
        if (worldList.data[i].id < 2000) {
          na_check.push(worldList.data[i]);
        }
      }
      setWorlds(na_check);
    };
    fetchWorlds();
  }, []);

  //fetch all current matches and overview
  useEffect(() => {
    //fetch all current match id
    const fetchMatches = async () => {
      const matchList = await axios(
        "https://api.guildwars2.com/v2/wvw/matches"
      );
      let na_id_check = [];
      for (let i = 0; i < matchList.data.length; i++) {
        if (matchList.data[i][0] === "1") na_id_check.push(matchList.data[i]);
      }
      setMatches(na_id_check);
    };
    fetchMatches();
  }, []);

  //fetch overview of all current matches
  useEffect(() => {
    const fetchOverview = async () => {
      let match_data = [];
      for (let i = 0; i < matches.length; i++) {
        const overviewResult = await axios(
          "https://api.guildwars2.com/v2/wvw/matches/" + matches[i]
        );
        match_data.push(overviewResult);
      }
      setOverview(match_data);
    };
    fetchOverview();
  }, [matches]);
  console.log(worlds);
  console.log(matches);
  console.log(overview);
  return (
    <div>
    </div>
  );
};

export default NA_region;
