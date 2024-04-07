document.addEventListener('DOMContentLoaded', function() {

    let data;
    let selectedAlgorithm = 'ETP_SRI_LinearFitting'
    let selectedSNR = '10'
    let selectedType = 'D_fitted'
    // Add event listener to algorithm select
    const algorithmSelect = document.getElementById('algorithm-select');
    algorithmSelect.addEventListener('change', function(event) {
        selectedAlgorithm = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType)
    });

    // Add event listener to SNR select
    const snrSelect = document.getElementById('snr-select');
    snrSelect.addEventListener('change', function(event) {
        selectedSNR = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType)
    });

    // Add event listener to type select
    const typeSelect = document.getElementById('type-select');
    typeSelect.addEventListener('change', function(event) {
        selectedType = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType)
    });

    Papa.parse('test_output.csv', {
        download: true,
        header: true,
        complete: results => {
            data= results
            drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType)
            
        }
    })
});

function drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType) {
    let jsonData = data.data.filter(obj => obj.Algorithm === selectedAlgorithm)
    console.log(jsonData)
    const type = {
        "D_fitted": "Diffusion",
        "Dp_fitted": "Perfusion",
        "f_fitted": "Perfusion Fraction"
    }
    let plots = []
    const regions = new Set(jsonData.map(obj => obj.Region));
    const uniqueRegionsArray = Array.from(regions);
    console.log(uniqueRegionsArray)
    uniqueRegionsArray.map((region) => {
        const D_fittedValues = jsonData
            .filter(obj => obj.Region === region)
            .filter(obj => obj.SNR === selectedSNR)
            .map(obj => obj[selectedType]);
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
        title: `${type[selectedType]} Box Plots for ${selectedAlgorithm} algorithm with ${selectedSNR} SNR`
    };

    Plotly.newPlot('myDiv', plots, layout);
}
