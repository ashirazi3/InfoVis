/**
 * Created by Arash on 11/11/15.
 */
//$(document).ready(function(){
function organizeData(data) {
    $.ajaxSetup({
        async: false
    });
    $.getJSON('../js/data.json',function (data) {
        var db = [];
        for (var i = 0; i < data.length; i++) {
            db[data[i]["City"]] = [];
            db[data[i]["City"]]["Public Transportation Ridership"] = data[i]["Public Transportation Ridership"];
            db[data[i]["City"]]["Congestion Level"] = data[i]["Congestion Level"];
            db[data[i]["City"]]["Walking Score"] = data[i]["Walking Score"];
            db[data[i]["City"]]["Average Rent for 2-Bedroom Apartment"] = data[i]["Average Rent for 2-Bedroom Apartment"];
            db[data[i]["City"]]["Cost of Gallon of Gas"] = data[i]["Cost of Gallon of Gas"];
            db[data[i]["City"]]["Cost of Electricity"] = data[i]["Cost of Electricity"];
            db[data[i]["City"]]["Cost of Grocery"] = data[i]["Cost of Grocery"];
            db[data[i]["City"]]["Cost of Internet"] = data[i]["Cost of Internet"];
            db[data[i]["City"]]["Average Salary"] = data[i]["Average Salary"];
            db[data[i]["City"]]["Unemployment Rate"] = data[i]["Unemployment Rate"];
            db[data[i]["City"]]["Number of Music Venues Per 100,000 People"] = data[i]["Number of Music Venues Per 100,000 People"];
            db[data[i]["City"]]["Number of Cheap Takeout Restaurants Per 100,000 People"] = data[i]["Number of Cheap Takeout Restaurants Per 100,000 People"];
            db[data[i]["City"]]["Number of Laundromats Per 100,000 People"] = data[i]["Number of Laundromats Per 100,000 People"];
            db[data[i]["City"]]["Number of coffee shops relative to the city's population (per 100,000 people)"] = data[i]["Number of coffee shops relative to the city's population (per 100,000 people)"];
            db[data[i]["City"]]["Young, Single Population(%)"] = data[i]["Young, Single Population(%)"];
            db[data[i]["City"]]["Crime Rate"] = data[i]["Crime Rate"];
            db[data[i]["City"]]["Upcoming Event"] = data[i]["Upcoming Event"];
        }
        return db;
    })
}

function normalize(num, min, max) {
    return ((num - min) / (max - min));
}

function findMax(db) {
    var first = true;
    var maxList = [];
    for (var city in db) {
        //console.log("new city");
        if (first) {
            //console.log("first", db[city]);
            for (var attribute in db[city]) {
                //console.log("attribute", attribute);
                maxList[attribute] = db[city][attribute];
            }
            first = false;
        } else {
            //console.log("notFirst", db[city]);
            for (var attribute in db[city]) {
                if (db[city][attribute] > maxList[attribute]) {
                    //console.log("old max", maxList);
                    maxList[attribute] = db[city][attribute];
                    //console.log("new max", maxList);
                }
            }
        }
    }
    return maxList;
}

function findMin(db) {
    var first = true;
    var minList = [];
    for (var city in db) {
        if (first) {
            //console.log("first", db[city]);
            for (var attribute in db[city]) {
                //console.log("attribute", attribute);
                minList[attribute] = db[city][attribute];
            }
            first = false;
        } else {
            //console.log("notFirst", db[city]);
            for (var attribute in db[city]) {
                if (db[city][attribute] < minList[attribute]) {
                    //console.log("old max", minList);
                    minList[attribute] = db[city][attribute];
                    //console.log("new max", minList);
                }
            }
        }
    }
    return minList;
}

function getNormalizedDB(db) {
    //console.log(db["Albuquerque"]);
    //findMin(db);
    normalizeDB = [];
    minList = findMin(db);
    maxList = findMax(db);
    //console.log(minList["Public Transportation Ridership"]);
    for (var city in db) {
        normalizeDB[city] = [];
        for (var attribute in db[city]) {
            //console.log("pre normal", maxList[attribute]);
            normalizeDB[city][attribute] = normalize(db[city][attribute], minList[attribute], maxList[attribute]);
            //normalizeDB[city][attribute] = 5;
        }
        //console.log(db[key]);
    }
    return normalizeDB;
    //for (var i = 0; i < db.length; i++) {
    //    console.log(db["Albuquerque"]);
    //}
}

function getTotals(db) {
    totalsDB = [];
    for (var city in db) {
        for (var attribute in db[city]) {
            if (totalsDB[attribute] == undefined) {
                //console.log("yes");
                totalsDB[attribute] = 0;
            } else {
                //console.log(db[city][attribute]);
                totalsDB[attribute] = totalsDB[attribute] + db[city][attribute];
                //console.log(totalsDB[attribute]);
            }
        }
    }
    console.log(totalsDB);
    return totalsDB;
}

function createMatrix(db, cities, attributes) {

}