document.addEventListener('DOMContentLoaded', function() {
    let data;
    let selectedAlgorithm = 'ETP_SRI_LinearFitting';
    let selectedSNR = '10';
    let selectedType = 'D_fitted';
    let selectedRange = 2;
    let selectedRegion = 'Liver';
    let selectedSNRRegion = '10';
    let selectedTypeRegion = 'D_fitted';
    let selectedRangeRegion = 2;
    // Add event listener to algorithm select
    const algorithmSelect = document.getElementById('algorithm-select');
    algorithmSelect.addEventListener('change', function(event) {
        selectedAlgorithm = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listener to SNR select
    const snrSelect = document.getElementById('snr-select');
    snrSelect.addEventListener('change', function(event) {
        selectedSNR = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });



    // Add event listener to type select
    const typeSelect = document.getElementById('type-select');
    typeSelect.addEventListener('change', function(event) {
        selectedType = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listener to range select
    const rangeSelect = document.getElementById('range-select');
    rangeSelect.addEventListener('change', function(event) {
        selectedRange = event.target.value;
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listener to region select
    const regionSelect = document.getElementById('region-select');
    regionSelect.addEventListener('change', function(event) {
        selectedRegion = event.target.value;
        drawRegionBoxPlot(data, selectedRegion, selectedSNR, selectedType, selectedRange);
    });
        // Add event listener to SNR select
        const snrRegionSelect = document.getElementById('snr-region-select');
        snrRegionSelect.addEventListener('change', function(event) {
            selectedSNRRegion = event.target.value;
            drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
        });
    
        // Add event listener to type select
        const typeRegionSelect = document.getElementById('type-region-select');
        typeRegionSelect.addEventListener('change', function(event) {
            selectedTypeRegion = event.target.value;
            drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
        });
    
        // Add event listener to range select
        const rangeRegionSelect = document.getElementById('range-region-select');
        rangeRegionSelect.addEventListener('change', function(event) {
            selectedRangeRegion = event.target.value;
            drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
        });

    Papa.parse('test_output.csv', {
        download: true,
        header: true,
        complete: results => {
            data = results;
            //populateRegions(data);
            drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
            drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);

        }
    });

    function populateRegions(data) {
        const regions = new Set(data.data.map(obj => obj.Region));
        const regionSelect = document.getElementById('region-select');
        regions.forEach(region => {
            let option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }

    function drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange) {
        let jsonData = data.data.filter(obj => obj.Algorithm === selectedAlgorithm);
        const type = {
            "D_fitted": "Diffusion",
            "Dp_fitted": "Perfusion",
            "f_fitted": "Perfusion Fraction"
        };
        let plots = [];
        const regions = new Set(jsonData.map(obj => obj.Region));
        const uniqueRegionsArray = Array.from(regions);
        uniqueRegionsArray.forEach(region => {
            const D_fittedValues = jsonData
                .filter(obj => obj.Region === region)
                .filter(obj => obj.SNR === selectedSNR)
                .filter(obj => Math.abs(obj[selectedType]) < (Math.abs(obj[selectedType.slice(0, -7)]) * selectedRange))
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
            const originalType = jsonData
                .filter(obj => obj.Region === region)
                .filter(obj => obj.SNR === selectedSNR)
                .map(obj => obj[selectedType.slice(0, -7)]);
            var constantPoint = {
                x: [region],
                y: originalType,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: 'black',
                    size: 10
                },
                showlegend: false
            };
            plots.push(constantPoint);
        });

        var layout = {
            title: `${type[selectedType]} Box Plots for ${selectedAlgorithm} algorithm with ${selectedSNR} SNR`
        };

        Plotly.newPlot('myDiv', plots, layout);
    }

    function drawRegionBoxPlot(data, selectedRegion, selectedSNR, selectedType, selectedRange) {
        let jsonData = data.data.filter(obj => obj.Region === selectedRegion);
        const type = {
            "D_fitted": "Diffusion",
            "Dp_fitted": "Perfusion",
            "f_fitted": "Perfusion Fraction"
        };
        let plots = [];
        const algorithms = new Set(jsonData.map(obj => obj.Algorithm));
        const uniqueAlgorithmsArray = Array.from(algorithms);
        uniqueAlgorithmsArray.forEach(algorithm => {
            const D_fittedValues = jsonData
                .filter(obj => obj.Algorithm === algorithm)
                .filter(obj => obj.SNR === selectedSNR)
                .filter(obj => Math.abs(obj[selectedType]) < (Math.abs(obj[selectedType.slice(0, -7)]) * selectedRange))
                .map(obj => obj[selectedType]);
            var plot = {
                y: D_fittedValues,
                type: 'box',
                name: algorithm,
                marker: {
                    outliercolor: 'white)',
                },
                boxpoints: 'Outliers'
            };
            plots.push(plot);
            const originalType = jsonData
                .filter(obj => obj.Algorithm === algorithm)
                .filter(obj => obj.SNR === selectedSNR)
                .map(obj => obj[selectedType.slice(0, -7)]);
            var constantPoint = {
                x: [algorithm],
                y: originalType,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: 'black',
                    size: 10
                },
                showlegend: false
            };
            plots.push(constantPoint);
        });

        var layout = {
            title: `${type[selectedType]} Box Plots for ${selectedRegion} region with ${selectedSNR} SNR`
        };

        Plotly.newPlot('regionDiv', plots, layout);
    }
});
