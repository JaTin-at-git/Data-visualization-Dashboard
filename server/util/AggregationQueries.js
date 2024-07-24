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

exports.getTopicsQuery = (matchQueryText) => {
    return `
    [ {
    "$match": {
        ${matchQueryText}
        }
    },
      {
        "$group": {
          "_id": {
            "sector": "$sector",
            "topic": "$topic"
          },
          "count": {
            "$sum": 1
          }
        }
      },
      {
        "$group": {
          "_id": "$_id.sector",
          "children": {
            "$push": {
              "name": "$_id.topic",
              "value": "$count"
            }
          }
        }
      },
      {
        "$project": {
          "_id": 0,
          "name": "$_id",
          "children": "$children"
        }
      }
    ]
    `;
}


exports.getIntensityDataQuery = (matchQueryText) => {
    return `
         [
          {
            "$match": {
                ${matchQueryText}
            }
          },
          {
            "$group": {
              "_id": {
                "sector": "$sector",
                "topic": "$topic"
              },
              "relevance": {
                "$sum": "$relevance"
              },
              "intensity": {
                "$sum": "$intensity"
              }
            }
          },{
            "$project": {
              "sector": "$_id.sector",
              "topic": "$_id.topic",
              "relevance": 1,
              "intensity": 1,
              "_id": 0
            }
          }
        ] 
    `
}

exports.getTotalRelevanceQuery = (matchQueryText) => {
    return `
    
    [
      {
        "$match": {
             ${matchQueryText}    
        }
      },
      {
        "$group": {
          "_id": {
            "sector": "$sector"
          },
          "totalRelevance": {
            "$sum": "$relevance"
          }  
        }
      },{
        "$project": {
          "sector": "$_id.sector",
          "totalRelevance": 1
        }
      }
    ]
    
    `
}

exports.getCountryCountQuery = (matchQueryText) => {
    return `   
    [
      {
        "$match": {
            ${matchQueryText}
        }
      },
      {
        "$group": {
          "_id": "$country",
          "count": {
            "$sum": 1
          }
        }
      }
    ]
    `;
}
