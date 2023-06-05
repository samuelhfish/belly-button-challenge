// Get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
function init() {

d3.json(url).then(function(data) {
  console.log(data);
    let dropdownMenu = d3.select("#selDataset");
    
    let names = data.names; 

    names.forEach((name) => {
        dropdownMenu.append("option")
        .text(name)
        .property("value", name);
    })

    sample940 = names[0];

    console.log(sample940);
    
    buildChart(sample940);
    buildMetadata(sample940);
    buildBubbles(sample940);
    buildGauge(sample940);
});
}

init()

function buildChart(sample) {
    
    d3.json(url).then(function(data) {
        
        console.log(data);
        let sampleInfo = data.samples;
        
        console.log(sampleInfo);
        
        subjectinfo = sampleInfo.filter(function(result) {
            return result.id == sample
        });
        
        console.log(subjectinfo)
        
        subjectData = subjectinfo[0];
        console.log(data)


        let otu_ids = subjectData.otu_ids;
        let otu_labels = subjectData.otu_labels;
        let sample_values = subjectData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);


        let trace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Bacteria",
            type: "bar",
            orientation: "h"
        };

        // Data array
        // `data` has already been defined, so we must choose a new name here:
        let traceData = [trace];

        // Apply a title to the layout
        let layout = {
            title: "Top 10 Bacteria OTUs Present",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };
        Plotly.newPlot("bar", traceData, layout);
    });   
}

function buildMetadata(sample) {
    
    d3.json(url).then(function(data) {
        
        console.log(data);
        let metadata = data.metadata;
        
        console.log(metadata);
        
        let info = metadata.filter(function(result) {
            return result.id == sample
        });
        
        console.log(info)
        
        subjectMetadata = info[0];
        
        console.log(subjectMetadata)

        d3.select("#sample-metadata").html("");

        Object.entries(subjectMetadata).forEach(([key,value]) => {

            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}

function buildGauge(sample) {
    
    d3.json(url).then(function(data) {
        
        console.log(data);

        let  sampleInfo = data.metadata;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        let washFreq = valueData.wfreq

        let gaugeData = [
            {
            domain: { x: [0, 1], y: [0, 1]},
            value: washFreq,
            title: { text: "Washes Per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10], tickwidth: 1, tickcolor: "darkblue"},
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 2], color: "rgb(166,206,227)" },
                  { range: [2, 4], color: "rgb(31,120,180)" },
                  { range: [4, 6], color: "rgb(178,223,138)" },
                  { range: [6, 8], color: "rgb(51,160,44" },
                  { range: [8, 10], color: "rgb(251,154,153)" },
                ]
            }
            }
        ];

        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

        Plotly.newPlot("gauge", gaugeData, layout)
    });
};

function buildBubbles(sample) {
    d3.json(url).then(function(data) {
        
        console.log(data);
        let  sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        let tracebubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "YlGnBu"
            }
        };

        let traceData = [tracebubble]

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", traceData, layout)
    });
};


function optionChanged(subject) {

   console.log(subject);
   
   buildChart(subject);
   buildMetadata(subject);
   buildBubbles(subject);
   buildGauge(subject);

};

init();
