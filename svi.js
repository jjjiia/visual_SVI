
var map;
var toggleList = "high"
var order = "descending"
var pub = {
    all:null,
    min:999,
    max:0,    //
    startState:"NY",
    stateAllocations:null,
    currentState:"NY"
}
var minMaxDictionary = {}
var measures = ["EPL_POV","EPL_PCI","EPL_UNEMP","EPL_NOHSDP","EPL_AGE17","EPL_AGE65","EPL_DISABL","EPL_SNGPNT", "EPL_LIMENG","EPL_MINRTY","EPL_CROWD","EPL_GROUPQ","EPL_MOBILE", "EPL_MUNIT","EPL_NOVEH"]
pub["activeThemes"]=measures

var groups = {
    THEME1:["EPL_POV","EPL_PCI","EPL_UNEMP","EPL_NOHSDP"],
    THEME2:["EPL_AGE17","EPL_AGE65","EPL_DISABL","EPL_SNGPNT"],
    THEME3:["EPL_LIMENG","EPL_MINRTY"],
    THEME4:["EPL_GROUPQ","EPL_NOVEH","EPL_CROWD","EPL_MUNIT","EPL_MOBILE"]
}
var measureGroups = ["SPL_THEME1","SPL_THEME2","SPL_THEME3","SPL_THEME4"]

var toggleDictionary = {}
var tally = 0
//each theme's display name
var themeGroupDisplayText = {
    THEME1:"Socioeconomic Status",
    THEME2:"Household Composition & Disability",
    THEME3:"Minority Status & Language",
    THEME4:"Housing Type & Transportation"
}
var themeDisplayText = {
    "EPL_POV":"% of population<span class=\"highlight\"> below poverty</span>",
    "EPL_PCI":"$<span class=\"highlight\"> Per capita income</span>",
    "EPL_UNEMP":"% of population<span class=\"highlight\"> unemployed</span>",
    "EPL_NOHSDP":"% of population<span class=\"highlight\"> with no high school diploma</span>",

    "EPL_AGE17":"% of population<span class=\"highlight\"> under 18</span>",
    "EPL_AGE65":"% of population<span class=\"highlight\">  over 64</span>",
    "EPL_DISABL":"% of population<span class=\"highlight\">  with a disability</span>",
    "EPL_SNGPNT":"% of<span class=\"highlight\"> single parent households</span>",


    "EPL_LIMENG":"% of population who speak <span class=\"highlight\">limited english</span>",
    "EPL_MINRTY":"% of population who are<span class=\"highlight\"> minorities</span>",

    "EPL_CROWD":"% of households with <span class=\"highlight\">more people than rooms</span>",
    "EPL_GROUPQ":"% of population in <span class=\"highlight\">group quarters</span>",
    "EPL_MOBILE":"% of housing are <span class=\"highlight\">mobile homes</span>",
    "EPL_MUNIT":"% of housing in <span class=\"highlight\">structures with 10+ units</span>",
    "EPL_NOVEH":"% of households with <span class=\"highlight\">no vehicle available</span>"

}
var themeDisplayTextShort = {
    "EPL_POV":"below poverty",
    "EPL_PCI":"Per capita income",
    "EPL_UNEMP":"unemployment",
    "EPL_NOHSDP":"no high school diploma",

    "EPL_AGE17":"under 18",
    "EPL_AGE65":"over 64",
    "EPL_DISABL":"disability",
    "EPL_SNGPNT":"single parent households",


    "EPL_LIMENG":"limited english",
    "EPL_MINRTY":"minorities",

    "EPL_CROWD":"more people than rooms",
    "EPL_GROUPQ":"group quarters",
    "EPL_MOBILE":"mobile homes",
    "EPL_MUNIT":"structures with 10+ units",
    "EPL_NOVEH":"no vehicle available"

}
var measuresLabels = {
  TOTPOP:"Total Persons",
  HH:"Households",
  HU:"Housing Units",
AGE17:"under 18",
AGE65:"over 64",
DISABL:"with a disability",
LIMENG:"who speak limited English",
CROWD:"with more people than rooms",
GROUPQ:"in group quarters",
MINRTY:"who are Minorities",
MOBILE:"that are Mobile homes",
MUNIT:"in structures with 10+ units",
NOHSDP:"with no high school diploma",
NOVEH:"with no vehicle available",
PCI:"Per capita income",
POV:"below poverty",
SNGPNT:"have a single parent w/children under 18",
UNEMP:"unemployed"
}


var themeDisplayTextFull = {
    "EPL_POV":"Persons below poverty",
    "EPL_PCI":"Per capita income",
    "EPL_UNEMP":"Civilian (age 16+) unemployed",
    "EPL_NOHSDP":"Persons with no high school diploma (age25+)",

    "EPL_AGE17":"Persons aged 17 and younger",
    "EPL_AGE65":"Persons aged 65 and older",
    "EPL_DISABL":"Civilian noninstitutionalized population with a disability",
    "EPL_SNGPNT":"Single parent households with children under 18",


    "EPL_LIMENG":"of persons (age 5+) who speak English \"less than well\"",
    "EPL_MINRTY":"minority (all persons except white, non - Hispanic)",

    "EPL_CROWD":"households with more people than rooms",
    "EPL_GROUPQ":"Persons in group quarters",
    "EPL_MOBILE":"mobile homes",
    "EPL_MUNIT":"housing in structures with 10 or more units",
    "EPL_NOVEH":"households with no vehicle available"

}

//colors for the lefthand checklist
var themeColors = {
    THEME1:"#aaaaaa",
    THEME2:"#3d85a4",
    THEME3:"#4bacdd",
    THEME4:"#658994"
}

var colors = ["green","red"]

var width = 250;
var data = [
	{"color":colors[0],"value":0},
//	{"color":colors[0],"value":width/5},
//	{"color":colors[1],"value":width/2},
//	{"color":colors[2],"value":width/5*4},
	{"color":colors[1],"value":width}
];
var extent = d3.extent(data, d => d.value);
var padding = 5;
var innerWidth = width - (padding * 2);
var barHeight = 10;
var height = 40;

//this is the color scale for list on the right, it should match the map
var colorScale = d3.scaleLinear()
    .range(["green","red"])
    .domain([0,measures.length])

var svg = d3.select("#key")
.append("svg").attr("width", width).attr("height", height)//.attr("id", "footerKey");
var g = svg.append("g");
svg.append("text")
	.text("High Vulnerability")
	.attr("x",250)
	.attr("y",25)
	.attr("text-anchor","end")
	.style("font-size","10px")
	.style("fill",colors[1])
	.style("font-weight","bold")
	.style("letter-spacing","1px")
svg.append("text")
	.text("Low Vulnerability")
	.attr("x",0).attr("y",25)
	.style("font-size","10px")
	.style("fill",colors[0])
	.style("font-weight","bold")
	.style("letter-spacing","1px")

var defs = svg.append("defs");
var linearGradient = defs.append("linearGradient").attr("id", "Gradient");
linearGradient.selectAll("stop")
    .data(data)
    .enter().append("stop")
    .attr("offset", d => ((d.value - extent[0]) / (extent[1] - extent[0]) * 100) + "%")
    .attr("stop-color", d => d.color);

g.append("rect")
    .attr("width", 250)
    .attr("height", barHeight)
    .style("fill", "url(#Gradient)");


//END SECTION 1 ////////////////////////////////////////////////////////


//SECTION 2
//2 datasets/loading
// var counties = d3.json("NYCensusTract.geojson")
 var counties = d3.json("nyc.geojson")
var svi = d3.csv("SVINewYork2018_CensusTract.csv")
var neighborhoods = d3.csv("neighborhoodNames.csv")


Promise.all([counties,neighborhoods])
.then(function(data){
    ready(data[0],data[1])
})
//END SECTION 2 ////////////////////////////////////////////////////////


function getDifference(data){
	console.log(data)
	var diffDict = []
	var totalKey = "SPL_THEMES"
	for(var i in data){
		var total1 = data[i]["properties"][totalKey]
		var gid1 = data[i]["properties"]["FIPS"]
		for(var j in data){
			var total2 = data[j]["properties"][totalKey]
			var gid2 = data[j]["properties"]["FIPS"]
			
			if(gid2!=gid1 && total2!=-999 && total1!=-999){
				var differenceId = gid1+"_"+gid2
				var difference = Math.abs(parseFloat(total1)-parseFloat(total2))
				var sumOfDifferences = 0
				var differenceCount = 0
				for(var m in measures){
					var key = measures[m]
					var m1 = parseFloat(data[i]["properties"][key])
					var m2 = parseFloat(data[j]["properties"][key])
					if(m1>0 && m2>0){
						var d = Math.abs(m1-m2)
						sumOfDifferences+=d
						differenceCount +=1
					}					
				}
				var averageDifference =sumOfDifferences/differenceCount
				var difDif =Math.abs(averageDifference-difference)
				
				diffDict.push({id1:gid1, id2:gid2, difference:difference, sumOf:sumOfDifferences, avgOf:averageDifference,difDif:difDif})
			}
		}
	}
	//console.log(diffDict)
	return diffDict
}
function themeVsTotal(data,theme){
	var jointIds=[]
	//console.log(data)
	var diffDict = []
	var totalKey = "SPL_THEMES"
	for(var i in data){
		var total1 = data[i]["properties"][totalKey]
		var gid1 = data[i]["properties"]["FIPS"]
		for(var j in data){
			var total2 = data[j]["properties"][totalKey]
			var gid2 = data[j]["properties"]["FIPS"]
			
			if(gid2!=gid1 && total2!=-999 && total1!=-999){
				var differenceId = gid1+"_"+gid2
				var difference = Math.abs(parseFloat(total1)-parseFloat(total2))
				var m1 = parseFloat(data[i]["properties"][theme])
				var m2 = parseFloat(data[j]["properties"][theme])
				var themeDifference = Math.abs(m1-m2)
				if(themeDifference==0&& m1!=0){
					if(gid1<gid2){
						var jointId = gid1+"_"+gid2
					}else{
						var jointId = gid2+"_"+gid1
					}
					if(jointIds.indexOf(jointId)==-1){
						jointIds.push(jointId)
						diffDict.push({jointId:jointId,id1:gid1, id2:gid2, difference:difference, themeDifference:themeDifference})
					}
				}
			}
		}
	}
	//console.log(diffDict)
	return diffDict
}
function drawDifPlot(data,theme){
	//console.log(data)
	var w = 400
	var h = 400
	var p = 20
	
	var svg = d3.select("body").append("svg").attr("width",w).attr("height",h)
	
	var aScale = d3.scaleLinear().domain([0,1]).range([0,w-p])
	var dScale = d3.scaleLinear().domain([0,12]).range([h-p,0])
	
	svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx",function(d){
		return aScale(d.themeDifference)+p
	})
	.attr("cy",function(d){
		return dScale(d.difference)
	})
	.attr("r",1)
	
	
	var xAxis = d3.axisBottom(aScale);
	svg.append("g")
	            .attr("transform", "translate("+p+","+(h-p)+")")
	            .call(xAxis)
	
	svg.append("text").text("difference").attr("")
	
	var yAxis = d3.axisLeft(dScale);
		svg.append("g")
		            .attr("transform", "translate("+p+",0)")
		            .call(yAxis)
	
}

function canvasTest(data){
	var w = 400
	var h = 400
	var p = 20
    var canvas = d3.select("canvas")
      .node();

    var context = canvas.getContext('2d');
	var xScale = d3.scaleLinear().domain([0,1]).range([p,w-p])
	var yScale = d3.scaleLinear().domain([0,12]).range([h-p,p])

    


   // data = d3.range(6000).map(function(){return Math.random()*500});
    context.moveTo(0,0);
	data.forEach(function(d,i) {
		//context.fillStyle = 'steelblue';
		context.beginPath();
		context.arc(xScale(d.themeDifference),yScale(d.difference), 1, 0, 2*Math.PI);
		context.fill();
	});
	//context.stroke();
	
}
function formatTractText(data){
	//console.log(formattedNeighborhood[data["FIPS"]])
	var tract = data["LOCATION"].split(",")[0]
	var neighborhood = formattedNeighborhood[data["FIPS"]]
	var county = data["LOCATION"].split(",")[1]
	var displayText = "<strong>"+tract+"<br>"+neighborhood+"<br>"+county+"<br>"+"Total Population:</strong> "+data["E_TOTPOP"]+"<br>"
	// for(var m in measures){
// 		var measureDisplay = themeDisplayTextShort[measures[m]]
// 		var estimateMeasure = "E_"+ measures[m].split("_")[1]
// 		var percentMeasure ="EP_"+ measures[m].split("_")[1]
// 		// console.log(percentMeasure)
// 		// console.log(data[percentMeasure])
// 		displayText+=measureDisplay+": "+data[estimateMeasure]+" | "+data[percentMeasure]+" | "+data[measures[m]]+"<br>"
// 	}
	return displayText
}
function loadPairs(id1,id2,data,theme){
	var row = d3.select("#pairs")
	.append("div")
	.attr("class","row")
	row.append("div")
	
	.attr("class","title")
	.html(function(){
		if(theme.split("_")[1]=="PCI"){
			return "same "+themeDisplayText[theme]+"<br>$"+data[id2]["properties"]["EP_"+theme.split("_")[1]]+"<br>"
		}else{
			return "same "+themeDisplayText[theme]+"<br>"+data[id2]["properties"]["EP_"+theme.split("_")[1]]+"%<br>"
		}
		
		
		
	})
	.style("text-align","left")
	//row.append("div").attr("class","title").html("same "+themeDisplayText[theme]+" "+data[id2]["properties"][theme]+"<br>")
	//console.log(data[id1]["properties"][theme],data[id2]["properties"][theme])
	
	// console.log(data[id1]["properties"])
	var id1Text = formatTractText(data[id1].properties)
	var id2Text = formatTractText(data[id2].properties)
	
	var div1 = row.append("div").attr("class","pair")
	
	
	
	div1.append("img")
	.attr("src","https://jjjiia.github.io/svi/tracts/"+id1+".png")
	.attr("class","tract")
	
	div1.append("div").html(id1Text)//+" SVI: "+data[id1]["properties"]["SPL_THEMES"])
	
	var chartDiv =  row.append("div").attr("id","id_"+id1+"_"+id2).attr("class","chart pair")
	chart(id1,id2,data,theme)
	
	var div2 = row.append("div").attr("class","pair")
	
	div2.append("img")
	.attr("src","https://jjjiia.github.io/svi/tracts/"+id2+".png")
	.attr("class","tract")
	
	div2.append("div").html(id2Text)//+" SVI: "+data[id2]["properties"]["SPL_THEMES"])
	
}

function chart(id1,id2,data,theme){
	var w = 300
	var h = 500
	var p = 8
	var xScale = d3.scaleLinear().domain([0,1]).range([0,w/2-p*4])
	var pciXScale = d3.scaleLinear().domain([0,200000]).range([0,w/2-p*4])
	
	var c1Scale = d3.scaleLinear().domain([0,1]).range(["green","red"])
	var c2Scale = d3.scaleLinear().domain([0,2000000]).range(["red","blue"])

	var data1 = data[id1].properties
	var data2 = data[id2].properties
	// d3.select("#id_"+id1+"_"+id2).append("div")
	// .attr("class","title").html("same "+themeDisplayText[theme]+"<br>"+data[id2]["properties"]["EP_"+theme.split("_")[1]]+"<br>")
	// .style("text-align","center")
	
	var svg = d3.select("#id_"+id1+"_"+id2).append("svg").attr("width",w).attr("height",h)
	
	var chart = svg.append("g")
	chart.attr("transform","translate(0,20)")
	
	chart.selectAll(".gid1")
	.data(measures)
	.enter()
	.append("rect")
	.attr("class","gid1")
	.attr("x",function(d,i){
		if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return w/2-pciXScale(data1[percentKey])
		}
		return w/2-xScale(data1[d])-1
	})
	.attr("y",function(d,i){return i*p*4+p})
	.attr("width",function(d){
		if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return pciXScale(data1[percentKey])
		}
		return xScale(data1[d])
	})
	.attr("height",p*1.5)
	.attr("fill",function(d){
		// if(d==theme){
// 			return "black"
// 		}
		return c1Scale(data1[d])
		return c1Scale(Math.abs(data1[d]-data2[d]))
	})
	
	
	chart.selectAll(".gid2")
	.data(measures)
	.enter()
	.append("rect")
	.attr("class","gid2")
	.attr("x",w/2+1)
	.attr("y",function(d,i){
		return i*p*4+p
	})
	.attr("width",function(d){
		if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return pciXScale(data2[percentKey])
		}
		return xScale(data2[d])
	})
	.attr("height",p*1.5)
	.attr("fill",function(d){
		// if(d==theme){
	// 		return "black"
	// 	}
		return c1Scale(data2[d])
	})
	
	chart.selectAll(".gid1Text")
	.data(measures)
	.enter()
	.append("text")
	.attr("class","gid1Text")
	.attr("y",function(d,i){return i*p*4+p*2+3})
	.attr("x",function(d){
		if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return w/2-pciXScale(data1[percentKey])-2
		}
		return w/2-xScale(data1[d])-2
	})
	.text(function(d){
		var percentKey ="EP_"+ d.split("_")[1]
		if(d.split("_")[1]=="PCI"){
			return "$"+data1[percentKey]
		}
		return data1[percentKey]+"%"
	})
	.style("font-size","11px")
	.attr("text-anchor","end")
	.attr("fill",function(d){
		// if(d==theme){
// 			return "black"
// 		}else
			if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return c2Scale(data1[d])
		}
		return c1Scale(data1[d])
		//return c1Scale(Math.abs(data1[d]-data2[d]))
	})
	
	
	chart.selectAll(".gid2Text")
	.data(measures)
	.enter()
	.append("text")
	.attr("class","gid2Text")
	.attr("y",function(d,i){return i*p*4+p*2+3})
	.attr("x",function(d){
		if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return w/2+pciXScale(data2[percentKey])+2
		}
		return w/2+xScale(data2[d])+2
	})
	.text(function(d){
		var percentKey ="EP_"+ d.split("_")[1]
		if(d.split("_")[1]=="PCI"){
			return "$"+data2[percentKey]
		}
		return data2[percentKey]+"%"
	})
	.style("font-size","11px")
	//.style("text-anchor","end")
	.attr("fill",function(d){
		// if(d==theme){
	// 		return "black"
	// 	}else
			if(d.split("_")[1]=="PCI"){
			var percentKey ="EP_"+ d.split("_")[1]
			return c2Scale(data2[d])
		}
		return c1Scale(data2[d])
		return c1Scale(Math.abs(data1[d]-data2[d]))
	})
	
	
	
	chart.selectAll(".cat")
	.data(measures)
	.enter()
	.append("text")
	.attr("class","cat")
	.attr("x",w/2+1)
	.attr("y",function(d,i){
		return i*p*4+p-3
	})
	.text(function(d){
		return themeDisplayTextFull[d]
	})
	.style("text-anchor","middle")
	.style("font-size","11px")
	.style("fill","#aaa")
	
}

function neighborhoodDictionary(data){
	var dict = {}
	for(var i in data){
		var key = data[i]["GEOID"]
		var value = data[i]["Neighborhoods_Code"]
		dict[key]=value
	}
	return dict
}

var formattedNeighborhood
function ready(counties,neighborhoods){
	formattedNeighborhood = neighborhoodDictionary(neighborhoods)
	console.log(formattedNeighborhood )
//var measures = ["EPL_POV","EPL_PCI","EPL_UNEMP","EPL_NOHSDP","EPL_AGE17","EPL_AGE65","EPL_DISABL","EPL_SNGPNT", "EPL_LIMENG","EPL_MINRTY","EPL_CROWD","EPL_GROUPQ","EPL_MOBILE", "EPL_MUNIT","EPL_NOVEH"]

	//canvasTest(counties)
	var keyArray = Array(5) 
	var keySvg = d3.select("#key").append("svg").attr("width",100).attr("height",50)
	var keyScale = d3.scaleLinear().domain([0,10]).range(["green","red"])
	
	// keySvg.selectAll(".key")
// 	.data(keyArray)
// 	.enter()
// 	.append("rect")
// 	.attr("width",10)
// 	.attr("height",10)
// 	.attr("x",function(d,i){return i*10})
// 	.attr("y",10)
// 	.attr("fill",function(d,i){
// 		return keyScale(i)
// 	})
	//var diffData = getDifference(counties.features)
	//var measures = ["EPL_POV","EPL_PCI","EPL_UNEMP","EPL_NOHSDP","EPL_AGE17","EPL_AGE65","EPL_DISABL","EPL_SNGPNT", "EPL_LIMENG","EPL_MINRTY","EPL_CROWD","EPL_GROUPQ","EPL_MOBILE", "EPL_MUNIT","EPL_NOVEH"]

	var theme = "EPL_LIMENG"
	var diffData = themeVsTotal(counties.features, theme)
	var lowIndividual = diffData.sort(function(a,b){
		return b.difference-a.difference
	})
	//canvasTest(lowIndividual)
	
	var fipsDict = turnToDictFIPS(counties.features)
	for(var i in lowIndividual.slice(0,10)){
		var id1 = lowIndividual[i].id1
		var id2 = lowIndividual[i].id2
		loadPairs(id1,id2,fipsDict,theme)
	}
	return
	
	var lowIndividual = diffData.sort(function(a,b){
		return a.themeDifference-b.themeDifference
	})
	drawDifPlot(lowIndividual.slice(0,1000),theme)
	
   	 var highTotal = diffData.sort(function(a,b){
   	 	return b.difference-a.difference
   	 })
	drawDifPlot(highTotal.slice(0,1000),theme)
	 
	 	//
	//  	 var lowBoth = diffData.sort(function(a,b){
	//  	 	return (a.avgOf+a.difference)-(b.avgOf+b.difference)
	//  	 })
	//
	// drawDifPlot(lowBoth.slice(0,1000))
	//
	//  var highBoth = diffData.sort(function(a,b){
	//  	 	return (b.avgOf+a.difference)-(a.avgOf+b.difference)
	//  	 })
	// drawDifPlot(highBoth.slice(0,1000))
	 
}
function radar(data){
	
	var w = 20
	var h = 20
	var margin = {top: 2, right: 2, bottom: 2, left: 2}
	
	var colorScale = d3.scaleLinear().domain([0,15]).range(["#00A9CE","#FB7139"])
	for(var i in highs){
		charts
		.append("div").attr("id","_"+highs[i].county)
		.style("display","inline-block")
		var data = []
		for(var c in measures){
			var cat = measures[c]
			var value = highs[i].data[cat]
			data.push({axis:cat,value:value})
		}
		var color = colorScale(highs[i].tally)
		//console.log(data)
		
		var radarChartOptions = {
				  w: w,
				  h: h,
				  margin: margin,
				  maxValue: 1,
				  levels: 0,
				  roundStrokes: false,
				color: [color]
				};
				
			RadarChart("#_"+highs[i].county, [data], radarChartOptions);
}
}


function turnToDictFIPS(data){
    var fipsDict = {}
    for(var i in data){
		// console.log(data[i])
		var county = data[i].properties.COUNTY
        var fips = data[i].properties["FIPS"]
        fipsDict[fips]=data[i]

    }
    return fipsDict
}


