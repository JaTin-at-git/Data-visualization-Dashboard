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
