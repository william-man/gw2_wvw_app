import React from 'react'
import mapWorldid from './worldname';

const organiseData = (score, world) => {
  let new_data = [];
  const scoredData = score
  const worldData = world

  for (let i=0; i < scoredData.length; i++) {
      let id_props = {
        id: scoredData[i].id,
        redworlds: mapWorldid(scoredData[i].all_worlds.red, worldData),
        blueworlds: mapWorldid(scoredData[i].all_worlds.blue, worldData),
        greenworlds: mapWorldid(scoredData[i].all_worlds.green, worldData),
        red_vpoints: scoredData[i].victory_points.red,
        blue_vpoints: scoredData[i].victory_points.blue,
        green_vpoints: scoredData[i].victory_points.green,
      };
      new_data.push(id_props);
  }
  return new_data
}

export default organiseData