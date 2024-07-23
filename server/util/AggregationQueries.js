exports.getLikelihoodVsIntensityQuery = (matchQueryText) => {
    return `
  [
    { 
      "$match": { 
        ${matchQueryText} 
      } 
    },
    { 
      "$group": {
        "_id": "$likelihood",
        "l1": {
          "$sum": {
            "$cond": [
              { "$lte": ["$intensity", 20] },
              1,
              0
            ]
          }
        },
        "l2": {
          "$sum": {
            "$cond": [
              { 
                "$and": [
                  { "$gt": ["$intensity", 20] },
                  { "$lte": ["$intensity", 70] }
                ] 
              },
              1,
              0
            ]
          }
        },
        "l3": {
          "$sum": {
            "$cond": [
              { "$gt": ["$intensity", 70] },
              1,
              0
            ]
          }
        }
      }
    }
  ] 
    `
}


exports.getRelevanceQuery = (matchQueryText) => {
    return `
    [
      {
        "$match": {
            ${matchQueryText}
        }
      },
      {
        "$group": {
          "_id": "$relevance",
          "value": {
            "$sum": 1
          }
        }
      }
    ]
    `
}


exports.getYearlyCountQuery = (matchQueryText) => {
    return `
    [
      {
        "$match": {
          ${matchQueryText}
        }
      },{
        "$facet": {
          "forEndYear": [ 
            {
                "$group": {
                  "_id": "$end_year",
                  "count":{
                    "$sum": 1
                  }
                } 
            }
          ], "forStartYear": [ 
            {
                "$group": {
                  "_id": "$start_year",
                  "count":{
                    "$sum": 1
                  }
                } 
            }
          ]
        }
      }
      
    ]
    `;
}
