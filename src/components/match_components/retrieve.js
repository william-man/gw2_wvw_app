import React from "react";

const Retrieve = (data, id) => {
  const allMatchData = [...data];
  for (let i = 0; i < allMatchData.length; i++) {
    if (allMatchData[i].id === id) {
      return allMatchData[i];
    }
  }
};

export default Retrieve;
