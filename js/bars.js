console.log(d3.select("#chart").style("width"));
console.log($("#chart").css("width"));
var flag = 1;
var margin2 = {left: 50, top: 10, right: 50, bottom: 10},
    width = 650,
    height = 100 - margin2.top - margin2.bottom;
console.log(document.body.clientWidth);
var diff = [];
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width * 2 / 3], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#FFA8A8", "#FFC8E3", "#F0CBFE ", "#CAFFD8", "#8FFEDD", "#C9DECB ", "#EDEF85", "#A5FFA8", "#FFF06A", "#FFCFA4", "#DDCEFF", "#B8E2EF", "#CEDEF4 ", "#BBEBFF", "#DFDFDF ", "#B3B5C1", "#C0C4B9"]);

var xAxis = d3.svg.axis()
    /*.scale(x)*/
    .orient("bottom").tickSize(3, 0);

var yAxis = d3.svg.axis()
    /*.scale(y)*/
    .orient("left")
    .tickFormat(d3.format(".2s")).tickSize(3, 0);


var highlight = [];

//var svg = d3.select("body").append("svg")
//    .attr("width", width + margin2.left + margin2.right)
//    .attr("height", height + margin2.top + margin2.bottom)
//    .append("g")
//    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var svg = d3.select("#barchart").append("svg")
    .attr("width", width+380 + margin2.left + margin2.right)
    .attr("height", height+105 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

SortHelper = {
    BubbleSort: function (array) {
        length = array.length;
        for (i = 0; i <= length - 2; i++) {
            for (j = length - 1; j >= 1; j--) {　　　　　　　　 //对两个元素进行交换

                if (array[j] > array[j - 1]) {
                    temp = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                }
            }
        }
    }
}
d3.select("#sort").on("click", sortBars);
d3.select("#reset233").on("click", reset233);
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        var cityorder = [];
        for (m = 0; m < 35; m++) {
            cityorder[m] = realdata[m]["City"];
        }
        var index = cityorder.indexOf(d.citycode);
        console.log(d.citycode + realdata[index][d.name]);
        return "<strong>" + d.citycode + ",  " + d.name + ":</strong> <span style='color:red'>" + realdata[index][d.name] + "</span>";
    })
svg.call(tip);
var globalInput = [];
var realdata = [];

function reset233() {
    console.log("123");

    svg.selectAll("*").remove();
    /*  d3.csv("data.csv", function(error, data) { */
    d3.json("../js/data_n.json", function (error, data) {
        if (error) throw error;
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "City";
        }));

        data.forEach(function (d) {
            var y0 = 0;
            //console.log("y12345 " + d.City);

            d.ages = color.domain().map(function (name) {
                var fl = 0;
                for (var sa = 0; sa < selectA.length; sa++) {
                    if (name == selectA[sa]) fl = 1;
                }
                if (fl == 1) {
                    //console.log("y123 " + name);
                    return {
                        citycode: d.City,
                        name: name,
                        y0: y0,
                        y1: y0 += +d[name]
                    };
                } else return {
                    name: name,
                    y0: y0,
                    y1: y0
                }
            });
            //console.log("y1234 " + d.ages.length);
            d.total = d.ages[d.ages.length - 1].y1;
        });

        x.domain(data.map(function (d) {
            return d.City;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);

        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d, i) {
                globalInput[i] = d;
                console.log(globalInput);
                return "translate(" + x(d.City) + ",0)";
            }).on('click', difference);
        /*ggggggggggggggggggggggggggg*/
        state.selectAll("rect")
            .data(function (d) {
                return d.ages;
                console.log()
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            }).attr('stroke', 'red').attr('stroke-width', 0).on('mouseover', function (d) {
                tip.show(d);
                d3.select(this).attr('stroke-width', 1);
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                d3.select(this).attr('stroke-width', 0);
            });
        state.append("text")
            .attr("y", -5).attr("transform", "rotate(90)")
            .attr("x", height/7 - 35)
            .attr("dy", ".35em")
            .style("text-anchor", "start").style("fill",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "#009688";}})
            .style("font-size",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "13.5";}})
            .text(function (d) {
                return d.City;
            });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        /*        legend.append("rect")
         .attr("x", width - 18)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", color);

         legend.append("text")
         .attr("x", width - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .text(function(d) {
         return d;
         });*/

    });
}

function difference2(data) {
    console.log(data);
    var dif = 0;
    var opacity = [];
    var flag;
    var keys = d3.map(data).keys();
    for (var m = 0; m < 35; m++) {
        for (var i = 1; i < keys.length - 2; i++) {
            var key = keys[i];
            console.log("name"+ key);
            console.log("select value "+data[key]);
            console.log("city "+globalInput[m]);
            console.log("city value "+globalInput[m][key]);
            dif = dif + (data[key] - globalInput[m][key]) * (data[key] - globalInput[m][key]);
            console.log("dif" + dif);
        }
        console.log("diffff" + dif);
        d3.selectAll("rect").style("opacity", dif);
        opacity[m] = Math.sqrt(dif);
        dif = 0;
    }
    console.log(opacity);
    var omax = 0;
    for (i = 0; i < opacity.length; i++) {
        if (omax < opacity[i]) omax = opacity[i];
    }
    console.log(omax);


    svg.selectAll("*").remove();
    /*          d3.csv("data.csv", function(error, data) { */
    d3.json("../js/data_n.json", function (error, data) {
        if (error) throw error;
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "City";
        }));
        var maxtotal = 0;
        data.forEach(function (d) {
            var y0 = 0;
            d.ages = color.domain().map(function (name) {
                var fl = 0;
                for (var sa = 0; sa < selectA.length; sa++) {
                    if (name == selectA[sa]) fl = 1;
                }
                if (fl == 1) {
                    console.log("y123 " + name);
                    return {
                        citycode: d.City,
                        name: name,
                        y0: y0,
                        y1: y0 += +d[name]
                    };
                } else return {
                    name: name,
                    y0: y0,
                    y1: y0
                }
            });
            console.log("y1234 " + d.ages.length);
            d.total = d.ages[d.ages.length - 1].y1;
            if (maxtotal < d.total) maxtotal = d.total;

            console.log("y12345 " + d.total);

        });

        data.sort(function (a, b) {
            return a.total - b.total;
        });

        x.domain(data.map(function (d) {
            return d.City;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);
        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g").style("opacity", function (d, i) {
                console.log("opacity" + opacity[i]);
                if (opacity[i] == 0) {
                    flag = 1;
                } else {
                    flag = 0;
                }
                console.log("flag" + flag);
                return (1 - (opacity[i]) / omax);
            })
            .attr("transform", function (d, i) {
                var xv = x.rangeBand() * i + (width - 400 - x.rangeBand() * 35) * d.total / maxtotal;
                console.log(xv);
                console.log(d.total);
                console.log(x(d.City) + " " + d.total + " " + d.City + " " + d.ages[1].y0);
                globalInput[i] = d;
                console.log(globalInput);


                return "translate(" + xv + ",0)";
            }).on('click', difference2);

        state.selectAll("rect")
            .data(function (d) {
                console.log(d.ages);
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            }).attr('stroke', 'red').attr('stroke-width', 0).on('mouseover', function (d) {
                tip.show(d);
                d3.select(this).attr('stroke-width', 1);
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                d3.select(this).attr('stroke-width', 0);
            });
        state.append("text")
            .attr("y", -5).attr("transform", "rotate(90)")
            .attr("x", height/7 - 35)
            .attr("dy", ".35em")
            .style("text-anchor", "start").style("fill",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "#009688";}})
            .text(function (d) {
                return d.City;
            }).attr("fill", function (d, i) {
                console.log("flag1" + opacity[i]);
                if (opacity[i] == 0) return "red";
            }).attr("font-size", function (d, i) {
                console.log("flag1" + opacity[i]);

                if (opacity[i] == 0) return "14";
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "13.5";}
            });


        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

    });
}


function difference(data) {
    console.log(data);
    var dif = 0;
    var opacity = [];
    var flag;
    var keys = d3.map(data).keys();
    for (var m = 0; m < 35; m++) {
        for (var i = 1; i < keys.length - 2; i++) {
            var key = keys[i];
            console.log(key);
            console.log(data[key]);
            console.log(globalInput[m]);
            dif = dif + (data[key] - globalInput[m][key]) * (data[key] - globalInput[m][key]);
            console.log("dif" + dif);

        }
        console.log("diffff" + dif);
        d3.selectAll("rect").style("opacity", dif);
        opacity[m] = Math.sqrt(dif);
        dif = 0;
    }
    console.log(opacity);
    var omax = 0;
    for (i = 0; i < opacity.length; i++) {
        if (omax < opacity[i]) omax = opacity[i];
    }
    console.log(omax);

    svg.selectAll("*").remove();

    /* d3.csv("data.csv", function(error, data) { */
    d3.json("../js/data_n.json", function (error, data) {
        if (error) throw error;
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "City";
        }));

        data.forEach(function (d) {
            var y0 = 0;
            d.ages = color.domain().map(function (name) {
                var fl = 0;
                for (var sa = 0; sa < selectA.length; sa++) {
                    if (name == selectA[sa]) fl = 1;
                }
                if (fl == 1) {
                    console.log("y123 " + name);
                    return {
                        citycode: d.City,

                        name: name,
                        y0: y0,
                        y1: y0 += +d[name]
                    };
                } else return {
                    name: name,
                    y0: y0,
                    y1: y0
                }
            });
            console.log("y1234 " + d.ages.length);
            d.total = d.ages[d.ages.length - 1].y1;
        });

        x.domain(data.map(function (d) {
            return d.City;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);
        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .style("opacity", function (d, i) {
                console.log("opacity" + opacity[i]);
                if (opacity[i] == 0) {
                    flag = 1;
                } else {
                    flag = 0;
                }
                console.log("flag" + flag);
                return (1 - (opacity[i]) / omax);
            })
            .attr("transform", function (d, i) {
                globalInput[i] = d;
                console.log(globalInput);
                return "translate(" + x(d.City) + ",0)";
            }).on('click', difference);
        /*ggggggggggggggggggggggggggg*/

        state.selectAll("rect")
            .data(function (d) {
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            }).attr('stroke', 'red').attr('stroke-width', 0).on('mouseover', function (d) {
                tip.show(d);
                d3.select(this).attr('stroke-width', 1);
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                d3.select(this).attr('stroke-width', 0);
            });
        state.append("text")
            .attr("y", -5).attr("transform", "rotate(90)")
            .attr("x", height/7 - 35)
            .attr("dy", ".35em").style("fill",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "#009688";}})
            .style("text-anchor", "start")
            .text(function (d) {
                return d.City;
            }).attr("fill", function (d, i) {
                console.log("flag1" + opacity[i]);
                if (opacity[i] == 0) return "red";
            }).attr("font-size", function (d, i) {
                console.log("flag1" + opacity[i]);

                if (opacity[i] == 0) return "14";
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "13.5";}
            });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

    });
}


var sortBars = function () {
    svg.selectAll("*").remove();
    /* d3.csv("data.csv", function(error, data) { */
    d3.json("../js/data_n.json", function (error, data) {
        if (error) throw error;
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "City";
        }));

        var maxtotal = 0;
        data.forEach(function (d) {
            var y0 = 0;
            d.ages = color.domain().map(function (name) {
                var fl = 0;
                for (var sa = 0; sa < selectA.length; sa++) {
                    if (name == selectA[sa]) fl = 1;
                }
                if (fl == 1) {
                    console.log("y123 " + name);
                    return {
                        citycode: d.City,

                        name: name,
                        y0: y0,
                        y1: y0 += +d[name]
                    };
                } else return {
                    name: name,
                    y0: y0,
                    y1: y0
                }
            });
            console.log("y1234 " + d.ages.length);
            d.total = d.ages[d.ages.length - 1].y1;
            if (maxtotal < d.total) maxtotal = d.total;

            console.log("y12345 " + d.ages[d.ages.length - 1].name + d.total);

        });

        data.sort(function (a, b) {
            return a.total - b.total;
        });

        x.domain(data.map(function (d) {
            return d.City;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);
        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d, i) {
                var xv = x.rangeBand() * i + (width - 400 - x.rangeBand() * 35) * d.total / maxtotal;
                console.log(maxtotal);
                console.log(d.total);
                console.log(x(d.City) + " " + d.total + " " + d.City + " " + d.ages[1].y0);


                return "translate(" + xv + ",0)";
            }).on('click', difference2);

        state.selectAll("rect")
            .data(function (d) {
                console.log(d.ages);
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            }).attr('stroke', 'red').attr('stroke-width', 0).on('mouseover', function (d) {
                tip.show(d);
                d3.select(this).attr('stroke-width', 1);
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                d3.select(this).attr('stroke-width', 0);
            });
        state.append("text")
            .attr("y", -5).attr("transform", "rotate(90)")
            .attr("x", height/7 - 35)
            .attr("dy", ".35em")
            .style("text-anchor", "start").style("fill",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "#009688";}})
            .text(function (d) {
                return d.City;
            }).style("font-size",function(d){
                for (i=0;i<selectC.length;i++)
                {if (selectC[i]==d.City)
                    return "13.5";}});


        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        /*   svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

         svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(90)")
         .attr("y", -15)
         .attr("x", 30)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Population");*/

    });
}

function setflagsort()
{        flag=1;
  reset233();
        document.getElementById("reset").style.backgroundColor = '#666666';
        document.getElementById("sort").style.backgroundColor = '#aaaaaa';
}

function setflagreset()
{        flag=2;
  console.log("2");
        flag=1;
        sortBars();
        document.getElementById("sort").style.backgroundColor = '#666666';
        document.getElementById("reset").style.backgroundColor = '#aaaaaa';
}

function go(flagc) {
    if (flagc == 1) {
                console.log("12");
        flag=1;
        reset233();
        document.getElementById("reset").style.backgroundColor = '#666666';
        document.getElementById("sort").style.backgroundColor = '#aaaaaa';
    } else {
                        console.log("2");
        flag=2;
        sortBars();
        document.getElementById("sort").style.backgroundColor = '#666666';
        document.getElementById("reset").style.backgroundColor = '#aaaaaa';
    }
}
d3.json("../js/data.json", function (error, data) {
    if (error) throw error;
    realdata = data;
});
go(flag);

/*barchart(1);*/