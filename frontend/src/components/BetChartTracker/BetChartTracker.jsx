import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import moment from 'moment/moment';

const BetChartTracker = ({ bets, timeFrame }) => {
    //Filter the bets by day, week, month, year and all time
    const filterBetsByTimeFrame = (timeFrame) => {
        const filteredBets = bets.filter((bet) => {
          const betDate = moment(bet.bet_date);
          const now = moment();
          switch (timeFrame) {
            case "day":
              return now.diff(betDate, "days") < 1;
            case "week":
              return now.diff(betDate, "weeks") < 1;
            case "month":
              return now.diff(betDate, "months") < 1;
            case "year":
              return now.diff(betDate, "years") < 1;
            case "all-time":
              return true;
            default:
              return false;
          }
        });
        return filteredBets;
      };

      const getChartData = () => {
        const filteredBets = filterBetsByTimeFrame(timeFrame);
        const data = [["Date", "Bets Won or Lost"]];
        const dailyNet = {}; //object that stores the net wins and losses
    
        filteredBets.forEach((bet) => {
          const betDate = moment(bet.bet_date).format("YYYY-MM-DD");
          const amount = bet.did_user_win ? bet.unit_amount : -bet.unit_amount;
          dailyNet[betDate] = (dailyNet[betDate] || 0) + amount;
        });
        //orders dates of dailyNet in ascending order
        const sortedEntries = Object.entries(dailyNet).sort((a, b) => {
            return moment(a[0]).isBefore(moment(b[0])) ? -1 : 1;
          });
      
          // Loop through each date and the total net balance of the users account, and add it to the chart
          sortedEntries.forEach(([date, net]) => {
            data.push([date, net]);
          });
    
        return data;
      };

    return ( 
        <div>
      <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            loader={<div>Loading Chart</div>}
            data={getChartData()}
            options={{
            hAxis: {
                title: "Date",
            },
            vAxis: {
                title: "Units won/loss",
            },
            }}
      />
    </div>
     );
};
 
export default BetChartTracker;