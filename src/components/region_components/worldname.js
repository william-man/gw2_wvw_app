import React from 'react'

//sort worlds after data is fetched
const mapWorldid = (current_team,worlds_list) => {
   let team = "";
   for (let i = 0; i < worlds_list.length; i++) {
     if (current_team.includes(worlds_list[i].id)) {
       if (team.length === 0) {
         team = team + worlds_list[i].name;
       } else {
         team = team + ", " + worlds_list[i].name;
       }
     }
   }
   return team;
}

export default mapWorldid