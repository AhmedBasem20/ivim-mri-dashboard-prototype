document.addEventListener('DOMContentLoaded', function() {

    // Fetch the JSON data using the fetch API
    fetch('ETP_SRI_LinearFitting.json')
        .then(response => response.json())
        .then(jsonData => {
            let plots = []
            const regions = new Set(jsonData.map(obj => obj.Region));
            const uniqueRegionsArray = Array.from(regions);
            console.log(uniqueRegionsArray)
            uniqueRegionsArray.map((region) => {
                const D_fittedValues = jsonData
                    .filter(obj => obj.Region === region)
                    .map(obj => obj.D_fitted);
                    var plot = {
                        y: D_fittedValues,
                        type: 'box',
                        name: region,
                        marker: {
                            outliercolor: 'white)',
                            
                        },
                        boxpoints: 'Outliers'
                    };
                plots.push(plot);

            })

            var layout = {
                title: 'Deffusion Box Plots'
            };

            Plotly.newPlot('myDiv', plots, layout);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
