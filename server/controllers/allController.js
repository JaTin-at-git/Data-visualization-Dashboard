const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const mongoose = require("mongoose");

const json = require("../assets/jsondata.json");
const Risk = require("../model/Risk");
const Stack = require("../util/Stack");
const {Query} = require("mongoose");
const {
    getLikelihoodVsIntensityQuery,
    getRelevanceQuery,
    getYearlyCountQuery,
    getTopicsQuery,
    getIntensityDataQuery,
    getTotalRelevanceQuery,
    getCountryCountQuery
} = require("../util/AggregationQueries");

exports.addAll = catchAsync(async (req, res, next) => {
    await Risk.insertMany(json);
    res.status(200).json({
        status: "success"
    })
});


exports.getFilters = catchAsync(async (req, res, next) => {

    const agg = [{
        '$group': {
            '_id': null, 'sector': {
                '$addToSet': '$sector'
            }, 'end_year': {
                '$addToSet': '$end_year'
            }, 'topic': {
                '$addToSet': '$topic'
            }, 'region': {
                '$addToSet': '$region'
            }, 'start_year': {
                '$addToSet': '$start_year'
            }, 'country': {
                '$addToSet': '$country'
            }, 'pestle': {
                '$addToSet': '$pestle'
            }, 'source': {
                '$addToSet': '$source'
            }
        }
    }, {
        '$project': {
            '_id': 0
        }
    }];

    const aggRes = (await Risk.aggregate(agg))[0];
    const filters = {};
    Object.entries(aggRes).forEach(o => {
        filters[o[0]] = o[1].sort();
    });

    res.status(200).json({
        status: "success", data: {
            filters
        }
    })

});


exports.getGraphData = catchAsync(async (req, res, next) => {
    const arr = req.body.arr; //the requested filters

    //creating a postfix expression and converting to valid mongodb aggregation query
    const stack = new Stack();
    stack.push(arr[0]);

    let i = 1;
    let postfix = [];
    while (!stack.isEmpty() && i < arr.length) {
        const el = arr[i++];
        if (el === ')') {
            while (stack.peek() !== '(' && stack.peek() !== '!(') {
                const op = stack.pop();
                if (op === '∪' || op === '∩') {
                    const e2 = postfix.pop();
                    const e1 = postfix.pop();
                    const newEl = `
                        "$${op === '∩' ? 'and' : 'or'}": [
                            {${e1}},
                            {${e2}}
                        ]
                    `;
                    postfix.push(newEl);
                }
            }
            if (stack.pop() === '!(') postfix.push(`"$nor": [{${postfix.pop()}}]`);
        } else if (el === '∩' || el === '∪') {
            if ((el === '∪' && stack.peek() === '∩') || (el === '∩' && stack.peek() === '∪')) {
                const op = stack.pop();
                const e2 = postfix.pop();
                const e1 = postfix.pop();
                const newEl = `
                        "$${op === '∩' ? 'and' : 'or'}": [
                            {${e1}},
                            {${e2}}
                        ]
                    `;
                postfix.push(newEl);
                i--;
            } else {
                stack.push(el);
            }
        } else if (el === '!(' || el === '(') stack.push(el); else postfix.push(el);
    }

    const matchQueryText = postfix[0] || '';

    //converting postfix to query object
    const likelihoodVsIntensityQueryObj = JSON.parse(getLikelihoodVsIntensityQuery(matchQueryText));
    const likelihoodVsIntensity = (await Risk.aggregate(likelihoodVsIntensityQueryObj));

    const relevanceQueryObj = JSON.parse(getRelevanceQuery(matchQueryText));
    const relevance = (await Risk.aggregate(relevanceQueryObj));

    const yearlyCountQueryObj = JSON.parse(getYearlyCountQuery(matchQueryText));
    const yearlyCountArray = await Risk.aggregate(yearlyCountQueryObj);
    let map = new Map();
    for (let eyo of yearlyCountArray[0].forEndYear) {
        if (!eyo._id) continue;
        map.set(eyo._id, {
            _id: eyo._id, end_year: eyo.count, start_year: 0
        });
    }
    for (let syo of yearlyCountArray[0].forStartYear) {
        if (!syo._id) continue;
        if (map.has(syo)) map.get(syo).start_year = syo.count; else map.set(syo._id, {
            _id: syo._id, end_year: 0, start_year: syo.count
        });
    }
    const yearlyCount = [];
    map.forEach(v => yearlyCount.push(v));


    const topicsDistributionQueryObj = JSON.parse(getTopicsQuery(matchQueryText));
    const topicsDistribution = await Risk.aggregate(topicsDistributionQueryObj);


    const intensityDataQueryObj = JSON.parse(getIntensityDataQuery(matchQueryText));
    let intensityGroup = await Risk.aggregate(intensityDataQueryObj);
    const totalRelevances = await Risk.aggregate(JSON.parse(getTotalRelevanceQuery(matchQueryText)));
    map = new Map();
    for (const obj of totalRelevances) map.set(obj.sector, {tr: obj.totalRelevance, tv: 0});
    for (const o of intensityGroup) {
        const value = o.intensity * o.relevance / map.get(o.sector).tr;
        map.get(o.sector).tv += value;
        delete o.relevance;
        delete o.intensity;
        o.value = value;
    }
    for (const o of intensityGroup) {
        o.value = o.value * 100 / map.get(o.sector).tv;
    }
    intensityGroup.sort((a, b) => {
        if (a.sector === b.sector) return 1 * b.value - 1 * a.value; else return b.sector - a.sector;
    })


    //country count aggregation
    const countryCountQuryObj = JSON.parse(getCountryCountQuery(matchQueryText));
    const countryCounts = await Risk.aggregate(countryCountQuryObj);


    res.status(200).json({
        status: "success", data: {
            likelihoodVsIntensity, relevance, yearlyCount, topicsDistribution, intensityGroup,
            countryCounts
        }
    })

})
