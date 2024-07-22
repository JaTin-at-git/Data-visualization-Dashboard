const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const mongoose = require("mongoose");

const json = require("../assets/jsondata.json");
const Risk = require("../model/Risk");
const Stack = require("../util/Stack");
const {Query} = require("mongoose");
const {getLikelihoodVsIntensityQuery} = require("../util/AggregationQueries");

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
    console.log(arr)

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

    //converting postfix to query object
    const likelihoodVsIntensityQueryObj = JSON.parse(getLikelihoodVsIntensityQuery(postfix[0] || ''));
    const likelihoodVsIntensity = (await Risk.aggregate(likelihoodVsIntensityQueryObj));




    res.status(200).json({
        status: "success", data: {
            likelihoodVsIntensity,
        }
    })

})
