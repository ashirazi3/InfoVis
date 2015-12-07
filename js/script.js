////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var screenWidth = $(window).width(),
    mobileScreen = (screenWidth > 400 ? false : true);

var margin = {
        left: 50,
        top: 10,
        right: 50,
        bottom: 10
    },
    width = Math.min(screenWidth, 700) - margin.left - margin.right,
    height = (mobileScreen ? 300 : Math.min(screenWidth, 700) * 5 / 6) - margin.top - margin.bottom;

var svgC = d3.select("#chart").append("svg")
    .attr("width", (width + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom));

//var wrapper = svg.append("g").attr("class", "chordWrapper")
//    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var wrapper = svgC.append("g").attr("class", "chordWrapper")
    .attr("transform", "translate(" + (width / 2 + margin.left +margin.right) + "," + (height / 2 + margin.top) + ")");


var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 90),
    innerRadius = outerRadius * 0.95,
    pullOutSize = (mobileScreen ? 20 : .1),
    opacityDefault = 0.7, //default opacity of chords
    opacityLow = 0.02; //hover opacity of those chords not hovered over

var allColors = ["#FFA8A8", "#FFC8E3", "#F0CBFE ", "#CAFFD8", "#8FFEDD", "#C9DECB ", "#EDEF85", "#A5FFA8", "#FFF06A", "#FFCFA4", "#DDCEFF", "#B8E2EF", "#CEDEF4 ", "#BBEBFF", "#DFDFDF ", "#B3B5C1", "#C0C4B9"];
//var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100),
//    innerRadius = outerRadius * 0.95,
//    pullOutSize = (mobileScreen ? 20 : 50),
//    opacityDefault = 0.7, //default opacity of chords
//    opacityLow = 0.02; //hover opacity of those chords not hovered over
//var wrapper = svg.append("g").attr("class", "chordWrapper")
//    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 ) + ")");
//
//
//var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100),
//    innerRadius = outerRadius * 0.95,
//    pullOutSize = (mobileScreen ? 20 : 50),
//    opacityDefault = 0.7, //default opacity of chords
//    opacityLow = 0.02; //hover opacity of those chords not hovered over
var selectA = ["Public Transportation Usage", "Congestion", "Walking Score"];
var selectC = ["Albuquerque", "Atlanta", "Austin"];

////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////
$.getJSON("../js/data.json", function (data) {
    var db = [];
    //lists all cities


    for (var i = 0; i < data.length; i++) {
        db[data[i]["City"]] = [];
        db[data[i]["City"]]["Events"] = data[i]["Events"];
        db[data[i]["City"]]["Crime"] = data[i]["Crime"];
        db[data[i]["City"]]["Young and Single"] = data[i]["Young and Single"];
        db[data[i]["City"]]["Coffee shops per 100 ppl"] = data[i]["Coffee shops per 100 ppl"];
        db[data[i]["City"]]["Laundromats per 100 ppl"] = data[i]["Laundromats per 100 ppl"];
        db[data[i]["City"]]["Cheap Takeouts per 100k ppl"] = data[i]["Cheap Takeouts per 100k ppl"];
        db[data[i]["City"]]["Music Venues per 100k ppl"] = data[i]["Music Venues per 100k ppl"];
        db[data[i]["City"]]["Unemployment Rate"] = data[i]["Unemployment Rate"];
        db[data[i]["City"]]["Average Salary"] = data[i]["Average Salary"];
        db[data[i]["City"]]["Internet"] = data[i]["Internet"];
        db[data[i]["City"]]["Grocery"] = data[i]["Grocery"];
        db[data[i]["City"]]["Electricity"] = data[i]["Electricity"];
        db[data[i]["City"]]["Gas per Gallon"] = data[i]["Gas per Gallon"];
        db[data[i]["City"]]["2Bed Apartment Rent"] = data[i]["2Bed Apartment Rent"];
        db[data[i]["City"]]["Walking Score"] = data[i]["Walking Score"];
        db[data[i]["City"]]["Congestion"] = data[i]["Congestion"];
        db[data[i]["City"]]["Public Transportation Usage"] = data[i]["Public Transportation Usage"];

    }
    //console.log(db);

    var allCities = [];
    for (c in db) {
        allCities.push(c);
    }
    //selected cities

    //lists all attributes
    var allAttributes = [];
    for (p in db[allCities[0]]) {
        //if (allAttributes.length) {

        allAttributes.push(p);

        //}
    }

    //selected Attributes

    var normalizeDB = getNormalizedDB(db);
    //console.log(normalizeDB);
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
                for (var attribute1 in db[city]) {
                    //console.log("attribute", attribute);
                    maxList[attribute1] = db[city][attribute1];
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

    getNormalizedDB(db);

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
        //console.log(normalizeDB);
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
        //console.log(totalsDB);
        return totalsDB;
    }

    function getNames(cities, attributes) {
        //console.log(cities);
        //console.log(attributes);
        var names = [];
        for (var i = 0; i < cities.length; i++) {
            names.push(cities[i]);
        }
        names.push("");
        for (var i = 0; i < attributes.length; i++) {
            names.push(attributes[i]);
        }
        names.push("");
        return names;
    }

    function createMatrix(names, cities, attributes) {
        var matrix = [];
        for (var i = 0; i < names.length; i++) {
            //console.log("i is ", i);
            //console.log("i before city check is ", names[i]);
            matrix[i] = [];
            if (names[i] == "") {
                for (var j = 0; j < names.length; j++) {
                    matrix[i].push(0);
                }
            } else if ($.inArray(names[i], cities) > -1) {
                for (var j = 0; j < names.length; j++) {
                    //console.log("i after city check is ", names[i]);
                    //console.log($.inArray(names[i], cities));
                    if ($.inArray(names[j], attributes) > -1) {
                        //console.log("is is ", names[i], " j is ", names[j]);
                        matrix[i].push(normalizeDB[names[i]][names[j]]);
                    } else {
                        matrix[i].push(0);
                    }
                }
            } else {
                for (var k = 0; k < names.length; k++) {
                    if ($.inArray(names[k], cities) > -1) {
                        matrix[i].push(normalizeDB[names[k]][names[i]]);
                    } else {
                        matrix[i].push(0);
                    }
                }
            }
        }
        //console.log("this is the matrix", matrix);
        return matrix;
    }

    //function getColorRange(names){
    //
    //}
    function getTotalNumber(matrix) {
        var sum = 0;
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                sum += matrix[i][j];
            }
        }
        return (sum);
    }

    function insertEmptyStroke(names, matrix, emptyStroke) {
        var newM = matrix;
        console.log("matrix before", matrix)
        for (var i = 0; i < names.length; i++) {
            if (names[i] == "") {
                if (i != names.length - 1) {
                    newM[i][i] = emptyStroke;
                } else {
                    newM[i][names.length - 1] = emptyStroke;
                }
            }
        }
        console.log("new M", newM);
        return newM;
    }


    var Names = getNames(selectC, selectA);
    console.log("Names are", Names);
    var matrix = createMatrix(Names, allCities, allAttributes);
    console.log(getTotalNumber(matrix));
    //console.log(matrix);
    var respondents = Math.ceil(getTotalNumber(matrix)), //Total number of respondents (i.e. the number that makes up the total group)
        emptyPerc = .15, //What % of the circle should become empty
        emptyStroke = Math.ceil(respondents * emptyPerc);
    matrix = insertEmptyStroke(Names, matrix, emptyStroke);
    //console.log(matrix);

    //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
    //invisible chord center vertically
    var offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 2;

    //Custom sort function of the chords to keep them in the original order
    function customSort(a, b) {
        return 1;
    }

    //Custom sort function of the chords to keep them in the original order
    var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
        .padding(.02)
        .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
        .matrix(matrix);

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
        .endAngle(endAngle);

    var path = stretchedChord()
        .radius(innerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw outer Arcs ///////////////////////
    ////////////////////////////////////////////////////////////

    var g = wrapper.selectAll("g.group")
        .data(chord.groups)
        .enter().append("g")
        .attr("class", "group")
        .on("mouseover", fade(opacityLow))
        .on("mouseout", fade(opacityDefault));

    g.append("path")
        .style("stroke", function (d, i) {
            if ($.inArray(Names[i], selectA) > -1) {
                if (Names[i] == "Public Transportation Usage") {
                    return allColors[0]
                } else if (Names[i] == "Congestion") {
                    return allColors[1]
                } else if (Names[i] == "Walking Score") {
                    return allColors[2]
                } else if (Names[i] == "2Bed Apartment Rent") {
                    return allColors[3]
                } else if (Names[i] == "Gas per Gallon") {
                    return allColors[4]
                } else if (Names[i] == "Electricity") {
                    return allColors[5]
                } else if (Names[i] == "Grocery") {
                    return allColors[6]
                } else if (Names[i] == "Internet") {
                    return allColors[7]
                } else if (Names[i] == "Average Salary") {
                    return allColors[8]
                } else if (Names[i] == "Unemployment Rate") {
                    return allColors[9]
                } else if (Names[i] == "Music Venues per 100k ppl") {
                    return allColors[10]
                } else if (Names[i] == "Cheap Takeouts per 100k ppl") {
                    return allColors[11]
                } else if (Names[i] == "Laundromats per 100 ppl") {
                    return allColors[12]
                } else if (Names[i] == "Coffee shops per 100 ppl") {
                    return allColors[13]
                } else if (Names[i] == "Young and Single") {
                    return allColors[14]
                } else if (Names[i] == "Crime") {
                    return allColors[15]
                } else if (Names[i] == "Events") {
                    return allColors[16]
                }
            }else if($.inArray(Names[i], selectC)>-1){
                return "#B2DFDB";
            }else{
                return "none";
            }        })
        .style("fill", function (d, i) {
            console.log("this one is", Names[i]);
            console.log(Names[i]);
            if ($.inArray(Names[i], selectA) > -1) {
                if (Names[i] == "Public Transportation Usage") {
                    return allColors[0]
                } else if (Names[i] == "Congestion") {
                    return allColors[1]
                } else if (Names[i] == "Walking Score") {
                    return allColors[2]
                } else if (Names[i] == "2Bed Apartment Rent") {
                    return allColors[3]
                } else if (Names[i] == "Gas per Gallon") {
                    return allColors[4]
                } else if (Names[i] == "Electricity") {
                    return allColors[5]
                } else if (Names[i] == "Grocery") {
                    return allColors[6]
                } else if (Names[i] == "Internet") {
                    return allColors[7]
                } else if (Names[i] == "Average Salary") {
                    return allColors[8]
                } else if (Names[i] == "Unemployment Rate") {
                    return allColors[9]
                } else if (Names[i] == "Music Venues per 100k ppl") {
                    return allColors[10]
                } else if (Names[i] == "Cheap Takeouts per 100k ppl") {
                    return allColors[11]
                } else if (Names[i] == "Laundromats per 100 ppl") {
                    return allColors[12]
                } else if (Names[i] == "Coffee shops per 100 ppl") {
                    return allColors[13]
                } else if (Names[i] == "Young and Single") {
                    return allColors[14]
                } else if (Names[i] == "Crime") {
                    return allColors[15]
                } else if (Names[i] == "Events") {
                    return allColors[16]
                }
            }else if($.inArray(Names[i], selectC)>-1){
                return "#B2DFDB";
            }else{
                return "none";
            }
        })
        .style("pointer-events", function (d, i) {
            return (Names[i] === "" ? "none" : "auto");
        })
        .attr("d", arc)
        .attr("transform", function (d, i) { //Pull the two slices apart
            d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
            return "translate(" + d.pullOutSize + ',' + 0 + ")";
        });


    ////////////////////////////////////////////////////////////
    ////////////////////// Append Names ////////////////////////
    ////////////////////////////////////////////////////////////

    //The text also needs to be displaced in the horizontal directions
    //And also rotated with the offset in the clockwise direction
    g.append("text")
        .each(function (d) {
            d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
        })
        .attr("dy", ".35em")
        .attr("class", "titles")
        .attr("text-anchor", function (d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function (d, i) {
            var c = arc.centroid(d);
            return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")" + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + 20 + ",0)" + (d.angle > Math.PI ? "rotate(180)" : "")
        })
        .attr("color", function(d,i){
            console.log("colorcheck", Names[i]);
            if($.inArray(Names[i], selectC)>-1){
                return "#887390"
            }
        })
        .text(function (d, i) {
            return Names[i];
        })
        .attr("fill", function(d,i){
            console.log("colorcheck", Names[i]);
            if($.inArray(Names[i], selectC)>-1){
                return "#009688"
            }
        })
        .call(wrapChord, 100);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw inner chords /////////////////////
    ////////////////////////////////////////////////////////////

    console.log(chord.chords);
    var chords = wrapper.selectAll("path.chord")
        .data(chord.chords)
        .enter().append("path")
        .attr("class", "chord")
        .style("stroke", "none")
        .style("fill", function (d, i) {
            console.log("this one is", Names[i]);
            console.log(Names[d.target.index]);
            if (Names[d.target.index] == "Public Transportation Usage") {
                return allColors[0]
            } else if (Names[d.target.index] == "Congestion") {
                return allColors[1]
            } else if (Names[d.target.index] == "Walking Score") {
                return allColors[2]
            } else if (Names[d.target.index] == "2Bed Apartment Rent") {
                return allColors[3]
            } else if (Names[d.target.index] == "Gas per Gallon") {
                return allColors[4]
            } else if (Names[d.target.index] == "Electricity") {
                return allColors[5]
            } else if (Names[d.target.index] == "Grocery") {
                return allColors[6]
            } else if (Names[d.target.index] == "Internet") {
                return allColors[7]
            } else if (Names[d.target.index] == "Average Salary") {
                return allColors[8]
            } else if (Names[d.target.index] == "Unemployment Rate") {
                return allColors[9]
            } else if (Names[d.target.index] == "Music Venues per 100k ppl") {
                return allColors[10]
            } else if (Names[d.target.index] == "Cheap Takeouts per 100k ppl") {
                return allColors[11]
            } else if (Names[d.target.index] == "Laundromats per 100 ppl") {
                return allColors[12]
            } else if (Names[d.target.index] == "Coffee shops per 100 ppl") {
                return allColors[13]
            } else if (Names[d.target.index] == "Young and Single") {
                return allColors[14]
            } else if (Names[d.target.index] == "Crime") {
                return allColors[15]
            } else if (Names[d.target.index] == "Events") {
                return allColors[16]
            } else {
                return "none"
            }
        })
        .style("opacity", function (d) {
            return (Names[d.source.index] === "" ? 0 : opacityDefault);
        }) //Make the dummy strokes have a zero opacity (invisible)
        .style("pointer-events", function (d, i) {
            return (Names[d.source.index] === "" ? "none" : "auto");
        }) //Remove pointer events from dummy strokes
        .attr("d", path)
        .on("mouseover", fadeOnChord)
        .on("mouseout", fade(opacityDefault));

    ////////////////////////////////////////////////////////////
    ///////////////////////// Tooltip //////////////////////////
    ////////////////////////////////////////////////////////////
    //
    ////Arcs
    //    g.append("title")
    //        .text(function (d, i) {
    //            console.log("d is ", d)
    //            return Math.round(d.value) + " people in " + Names[i];
    //        });
    //
    ////Chords
    //    chords.append("title")
    //        .text(function (d) {
    //            return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join("");
    //        });

    ////////////////////////////////////////////////////////////
    ////////////////// Extra Functions /////////////////////////
    ////////////////////////////////////////////////////////////

    //Include the offset in de start and end angle to rotate the Chord diagram clockwise
    function startAngle(d) {
        return d.startAngle + offset;
    }

    function endAngle(d) {
        return d.endAngle + offset;
    }

    // Returns an event handler for fading a given chord group
    function fade(opacity) {
        return function (d, i) {
            wrapper.selectAll("path.chord")
                .filter(function (d) {
                    return d.source.index != i && d.target.index != i && Names[d.source.index] != "";
                })
                .transition()
                .style("opacity", opacity);
        };
    } //fade
    //console.log(normalizeDB);

    // Fade function when hovering over chord
    function fadeOnChord(d) {
        var chosen = d;
        wrapper.selectAll("path.chord")
            .transition()
            .style("opacity", function (d) {
                if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
                    return opacityDefault;
                } else {
                    return opacityLow;
                } //else
            });
    } //fadeOnChord

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrapChord(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = 0,
                x = 0,
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    } //wrapChord

    //---------------------------
    function render(selectC, selectA) {

        d3.selectAll(".chordWrapper > *").remove();

        //wrapper = svg.append("g").attr("class", "chordWrapper")
        //    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
        //
        //
        //outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 90);
        //    innerRadius = outerRadius * 0.95;
        //    pullOutSize = (mobileScreen ? 20 :.1);
        //    opacityDefault = 0.7; //default opacity of chords
        //    opacityLow = 0.02; //hover opacity of those chords not hovered over


        Names = getNames(selectC, selectA);
        console.log("Names are", Names);
        matrix = createMatrix(Names, allCities, allAttributes);
        getTotalNumber(matrix);
        //console.log(matrix);
        respondents = Math.ceil(getTotalNumber(matrix)); //Total number of respondents (i.e. the number that makes up the total group)
        emptyPerc = .3; //What % of the circle should become empty
        emptyStroke = Math.ceil(respondents * emptyPerc);
        matrix = insertEmptyStroke(Names, matrix, emptyStroke);
        //console.log(matrix);

        //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
        //invisible chord center vertically
        offset = (2 * Math.PI) * ((emptyStroke - .3) / (respondents + emptyStroke)) / 2;

        //Custom sort function of the chords to keep them in the original order
        chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
            .padding(.02)
            .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
            .matrix(matrix);

        arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
            .endAngle(endAngle);

        path = stretchedChord()
            .radius(innerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw outer Arcs ///////////////////////
        ////////////////////////////////////////////////////////////

        g = wrapper.selectAll("g.group")
            .data(chord.groups)
            .enter().append("g")
            .attr("class", "group")
            .on("mouseover", fade(opacityLow))
            .on("mouseout", fade(opacityDefault));

        g.append("path")
            .style("stroke", function (d, i) {
                if ($.inArray(Names[i], selectA) > -1) {
                    if (Names[i] == "Public Transportation Usage") {
                        return allColors[0]
                    } else if (Names[i] == "Congestion") {
                        return allColors[1]
                    } else if (Names[i] == "Walking Score") {
                        return allColors[2]
                    } else if (Names[i] == "2Bed Apartment Rent") {
                        return allColors[3]
                    } else if (Names[i] == "Gas per Gallon") {
                        return allColors[4]
                    } else if (Names[i] == "Electricity") {
                        return allColors[5]
                    } else if (Names[i] == "Grocery") {
                        return allColors[6]
                    } else if (Names[i] == "Internet") {
                        return allColors[7]
                    } else if (Names[i] == "Average Salary") {
                        return allColors[8]
                    } else if (Names[i] == "Unemployment Rate") {
                        return allColors[9]
                    } else if (Names[i] == "Music Venues per 100k ppl") {
                        return allColors[10]
                    } else if (Names[i] == "Cheap Takeouts per 100k ppl") {
                        return allColors[11]
                    } else if (Names[i] == "Laundromats per 100 ppl") {
                        return allColors[12]
                    } else if (Names[i] == "Coffee shops per 100 ppl") {
                        return allColors[13]
                    } else if (Names[i] == "Young and Single") {
                        return allColors[14]
                    } else if (Names[i] == "Crime") {
                        return allColors[15]
                    } else if (Names[i] == "Events") {
                        return allColors[16]
                    }
                }else if($.inArray(Names[i], selectC)>-1){
                    return "#B2DFDB";
                }else{
                    return "none";
                }        })
            .style("fill", function (d, i) {
                console.log("this one is", Names[i]);
                console.log(Names[i]);
                if ($.inArray(Names[i], selectA) > -1) {
                    if (Names[i] == "Public Transportation Usage") {
                        return allColors[0]
                    } else if (Names[i] == "Congestion") {
                        return allColors[1]
                    } else if (Names[i] == "Walking Score") {
                        return allColors[2]
                    } else if (Names[i] == "2Bed Apartment Rent") {
                        return allColors[3]
                    } else if (Names[i] == "Gas per Gallon") {
                        return allColors[4]
                    } else if (Names[i] == "Electricity") {
                        return allColors[5]
                    } else if (Names[i] == "Grocery") {
                        return allColors[6]
                    } else if (Names[i] == "Internet") {
                        return allColors[7]
                    } else if (Names[i] == "Average Salary") {
                        return allColors[8]
                    } else if (Names[i] == "Unemployment Rate") {
                        return allColors[9]
                    } else if (Names[i] == "Music Venues per 100k ppl") {
                        return allColors[10]
                    } else if (Names[i] == "Cheap Takeouts per 100k ppl") {
                        return allColors[11]
                    } else if (Names[i] == "Laundromats per 100 ppl") {
                        return allColors[12]
                    } else if (Names[i] == "Coffee shops per 100 ppl") {
                        return allColors[13]
                    } else if (Names[i] == "Young and Single") {
                        return allColors[14]
                    } else if (Names[i] == "Crime") {
                        return allColors[15]
                    } else if (Names[i] == "Events") {
                        return allColors[16]
                    }
                }else if($.inArray(Names[i], selectC)>-1){
                    return "#B2DFDB";
                }else{
                    return "none";
                }
            })
            .style("pointer-events", function (d, i) {
                return (Names[i] === "" ? "none" : "auto");
            })
            .attr("d", arc)
            .attr("transform", function (d, i) { //Pull the two slices apart
                d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
                return "translate(" + d.pullOutSize + ',' + 0 + ")";
            });


        ////////////////////////////////////////////////////////////
        ////////////////////// Append Names ////////////////////////
        ////////////////////////////////////////////////////////////

        //The text also needs to be displaced in the horizontal directions
        //And also rotated with the offset in the clockwise direction
        g.append("text")
            .each(function (d) {
                d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
            })
            .attr("dy", ".35em")
            .attr("class", "titles")
            .attr("text-anchor", function (d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .attr("transform", function (d, i) {
                var c = arc.centroid(d);
                return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")" + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + 20 + ",0)" + (d.angle > Math.PI ? "rotate(180)" : "")
            })
            .text(function (d, i) {
                return Names[i];
            })
            .attr("fill", function(d,i){
                console.log("colorcheck", Names[i]);
                if($.inArray(Names[i], selectC)>-1){
                    return "#009688"
                }
            })
            .call(wrapChord, 100);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw inner chords /////////////////////
        ////////////////////////////////////////////////////////////

        var chords = wrapper.selectAll("path.chord")
            .data(chord.chords)
            .enter().append("path")
            .attr("class", "chord")
            .style("stroke", "none")
            .style("fill", function (d, i) {
                console.log("this one is", Names[i]);
                console.log(Names[d.target.index]);
                if (Names[d.target.index] == "Public Transportation Usage") {
                    return allColors[0]
                } else if (Names[d.target.index] == "Congestion") {
                    return allColors[1]
                } else if (Names[d.target.index] == "Walking Score") {
                    return allColors[2]
                } else if (Names[d.target.index] == "2Bed Apartment Rent") {
                    return allColors[3]
                } else if (Names[d.target.index] == "Gas per Gallon") {
                    return allColors[4]
                } else if (Names[d.target.index] == "Electricity") {
                    return allColors[5]
                } else if (Names[d.target.index] == "Grocery") {
                    return allColors[6]
                } else if (Names[d.target.index] == "Internet") {
                    return allColors[7]
                } else if (Names[d.target.index] == "Average Salary") {
                    return allColors[8]
                } else if (Names[d.target.index] == "Unemployment Rate") {
                    return allColors[9]
                } else if (Names[d.target.index] == "Music Venues per 100k ppl") {
                    return allColors[10]
                } else if (Names[d.target.index] == "Cheap Takeouts per 100k ppl") {
                    return allColors[11]
                } else if (Names[d.target.index] == "Laundromats per 100 ppl") {
                    return allColors[12]
                } else if (Names[d.target.index] == "Coffee shops per 100 ppl") {
                    return allColors[13]
                } else if (Names[d.target.index] == "Young and Single") {
                    return allColors[14]
                } else if (Names[d.target.index] == "Crime") {
                    return allColors[15]
                } else if (Names[d.target.index] == "Events") {
                    return allColors[16]
                }else {
                    return "none"
                }
            })
            .style("opacity", function (d) {
                return (Names[d.source.index] === "" ? 0 : opacityDefault);
            }) //Make the dummy strokes have a zero opacity (invisible)
            .style("pointer-events", function (d, i) {
                return (Names[d.source.index] === "" ? "none" : "auto");
            }) //Remove pointer events from dummy strokes
            .attr("d", path)
            .on("mouseover", fadeOnChord)
            .on("mouseout", fade(opacityDefault));

        ////////////////////////////////////////////////////////////
        ///////////////////////// Tooltip //////////////////////////
        ////////////////////////////////////////////////////////////

        //Arcs
        g.append("title")
            .text(function (d, i) {
                console.log(d);
                return Math.round(d.value) + " people in " + Names[i];
            });

        //Chords
        chords.append("title")
            .text(function (d) {
                return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join("");
            });

        ////////////////////////////////////////////////////////////
        ////////////////// Extra Functions /////////////////////////
        ////////////////////////////////////////////////////////////

        //Include the offset in de start and end angle to rotate the Chord diagram clockwise
        function startAngle(d) {
            return d.startAngle + offset;
        }

        function endAngle(d) {
            return d.endAngle + offset;
        }

        // Returns an event handler for fading a given chord group
        function fade(opacity) {
            return function (d, i) {
                wrapper.selectAll("path.chord")
                    .filter(function (d) {
                        return d.source.index != i && d.target.index != i && Names[d.source.index] != "";
                    })
                    .transition()
                    .style("opacity", opacity);
            };
        } //fade
        //console.log(normalizeDB);

        // Fade function when hovering over chord
        function fadeOnChord(d) {
            var chosen = d;
            wrapper.selectAll("path.chord")
                .transition()
                .style("opacity", function (d) {
                    if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
                        return opacityDefault;
                    } else {
                        return opacityLow;
                    } //else
                });
        } //fadeOnChord

        //Taken from http://bl.ocks.org/mbostock/7555321
        //Wraps SVG text
        function wrapChord(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = 0,
                    x = 0,
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        } //wrapChord

        //goflag

    }

    $(".legend-labels").find("input").click(function () {
        console.log("value is ", $(this).val())
        if ($(this).is(':checked')) {
            //console.log("inArray val",$.inArray($(this).val(), selectA) < 0);
            if ($.inArray($(this).val(), selectA) < 0) {

                console.log("pushing");
                selectA.push($(this).val());

                console.log(flag);

                go(flag);
                render(selectC, selectA);
                //console.log(dotID);
                //redrawCircle(selectC, selectA)
            }

        } else {
            if (selectA.length > 3) {
                selectA.splice(selectA.indexOf($(this).val()), 1);
                //d3.selectAll("#chart> svg > *").remove();
                go(flag);

                render(selectC, selectA);


                //redrawCircle(selectC, selectA)
            } else {
                $(this).prop('checked', true);
            }
        }
        console.log(selectA);
    });

    //handles clicking on city list
    $("#city-list").find("input").click(function (event) {
        var dotID = $(this).attr('id').replace('cb', '');
        if ($(this).is(':checked')) {
            if (selectC.length < 9) {
                console.log("inArray val", $.inArray($(this).val(), selectC));
                if ($.inArray($(this).val(), selectC) < 0) {
                    console.log("pushing");
                    selectC.push($(this).val());
                    //d3.selectAll("#chart> svg > *").remove();
                    render(selectC, selectA);
                    go(flag);

                    //console.log(dotID);
                    //redrawCircle(selectC, selectA)
                }


            } else {
                alert("Adding too many cities will make comparing difficult! We suggest unselecting cities you have ruled out.");
                $(this).prop('checked', false);
                colorBlack(dotID);
            }
        } else {
            if (selectC.length > 3) {
                console.log("removing", $(this).val());
                //selectA.splice(selectA.indexOf($(this).val()), 1);
                selectC.splice(selectC.indexOf($(this).val()), 1);
                //d3.selectAll("#chart> svg > *").remove();
                colorBlack(dotID);
                render(selectC, selectA);
                go(flag);

            } else {
                $(this).prop('checked', true);
                colorRed(dotID);
            }
        }
        console.log(selectC)
    });

    //handles clicking on city map
    $(".city-dot").click(function () {
        var id = $(this).find("circle").attr('id');
        $("#cb" + id).click();
    });

    //render(selectC, selectA);
    //delay()

    ///////////////////////////////////////////
    $("#cbl1").click();
    $("#cbl2").click();
    $("#cbl3").click();

    $("#cb1").click();
    $("#cb2").click();
    $("#cb3").click();

});