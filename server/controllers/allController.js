const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const mongoose = require("mongoose");

const json = require("../assets/jsondata.json");
const Risk = require("../model/Risk");

exports.addAll = catchAsync(async (req, res, next) => {
    await Risk.insertMany(json);
    res.status(200).json({
        status: "success"
    })
});
