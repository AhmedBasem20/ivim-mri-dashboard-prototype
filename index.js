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

    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.getElementsByTagName('main')[0];
    function showLoading() {
        mainContent.classList.add('hidden');
        loadingOverlay.classList.remove('hidden');
    }

    function hideLoading() {
        loadingOverlay.classList.add('hidden');
        mainContent.classList.remove('hidden')
    }

    // Add event listener to algorithm select
    const algorithmSelect = document.getElementById('algorithm-select');
    algorithmSelect.addEventListener('change', function(event) {
        selectedAlgorithm = event.target.value;
        updateRange('2')
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listener to SNR select
    const snrSelect = document.getElementById('snr-select');
    snrSelect.addEventListener('change', function(event) {
        selectedSNR = event.target.value;
        updateRange('2')
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listener to type select
    const typeSelect = document.getElementById('type-select');
    typeSelect.addEventListener('change', function(event) {
        selectedType = event.target.value;
        updateRange('2')
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    });

    // Add event listeners to range slider and buttons
    const rangeSlider = document.getElementById('range-slider');
    const rangeValue = document.getElementById('range-value');
    const decrementRange = document.getElementById('decrement-range');
    const incrementRange = document.getElementById('increment-range');
    function updateRange(value) {
        selectedRange = value;
        rangeValue.textContent = value;
        rangeSlider.value = value
        drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
    }

    rangeSlider.addEventListener('input', function(event) {
        updateRange(event.target.value);
    });

    decrementRange.addEventListener('click', function() {
        let newValue = parseInt(rangeSlider.value) - 2;
        if (newValue >= 2) {
            rangeSlider.value = newValue;
            updateRange(newValue);
        }
    });

    incrementRange.addEventListener('click', function() {
        let newValue = parseInt(rangeSlider.value) + 2;
        if (newValue <= rangeSlider.max) {
            rangeSlider.value = newValue;
            updateRange(newValue);
        }
    });

    // Add event listener to region select
    const regionSelect = document.getElementById('region-select');
    regionSelect.addEventListener('change', function(event) {
        selectedRegion = event.target.value;
        updateRangeRegion('2')
        drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
    });

    // Add event listener to SNR select
    const snrRegionSelect = document.getElementById('snr-region-select');
    snrRegionSelect.addEventListener('change', function(event) {
        selectedSNRRegion = event.target.value;
        updateRangeRegion('2')
        drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
    });

    // Add event listener to type select
    const typeRegionSelect = document.getElementById('type-region-select');
    typeRegionSelect.addEventListener('change', function(event) {
        selectedTypeRegion = event.target.value;
        updateRangeRegion('2')
        drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
    });

    // Add event listeners to range region slider and buttons
    const rangeSliderRegion = document.getElementById('range-slider-region');
    const rangeValueRegion = document.getElementById('range-value-region');
    const decrementRangeRegion = document.getElementById('decrement-range-region');
    const incrementRangeRegion = document.getElementById('increment-range-region');

    function updateRangeRegion(value) {
        selectedRangeRegion = value;
        rangeValueRegion.textContent = value;
        rangeSliderRegion.value = value
        drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);
    }

    rangeSliderRegion.addEventListener('input', function(event) {
        updateRangeRegion(event.target.value);
    });

    decrementRangeRegion.addEventListener('click', function() {
        let newValue = parseInt(rangeSliderRegion.value) - 2;
        if (newValue >= 2) {
            rangeSliderRegion.value = newValue;
            updateRangeRegion(newValue);
        }
    });

    incrementRangeRegion.addEventListener('click', function() {
        let newValue = parseInt(rangeSliderRegion.value) + 2;
        if (newValue <= rangeSliderRegion.max) {
            rangeSliderRegion.value = newValue;
            updateRangeRegion(newValue);
        }
    });

    showLoading();

    Papa.parse('test_output.csv', {
        download: true,
        header: true,
        complete: results => {
            data = results;
            hideLoading();
            populateOptions(data);
            drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange);
            drawRegionBoxPlot(data, selectedRegion, selectedSNRRegion, selectedTypeRegion, selectedRangeRegion);

        }
    });

    function populateOptions(data) {

        //-----Algorithms options------
        const AlgorithmsSet = new Set(data.data.map(obj => obj.Algorithm));
        const algorithms = Array.from(AlgorithmsSet);
        const algorithmSelect = document.getElementById('algorithm-select');
        algorithms.forEach(algorithm => {
            let option = document.createElement('option');
            option.value = algorithm;
            option.textContent = algorithm;
            algorithmSelect.appendChild(option);
        });

        //-----Regions options------
        const regionsSet = new Set(data.data.map(obj => obj.Region));
        const regions = Array.from(regionsSet);
        const regionSelect = document.getElementById('region-select');
        regions.forEach(region => {
            let option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });

        //-----SNR options for algorithms and regions------
        const snrSet = new Set(data.data.map(obj => obj.SNR));
        const snr = Array.from(snrSet);
        console.log(snr)
        const snrSelect = document.getElementById('snr-select');
        const snrRegionSelect = document.getElementById('snr-region-select');
        snr.forEach(snrValue => {
            let option = document.createElement('option');
            option.value = snrValue;
            option.textContent = snrValue;
            snrSelect.appendChild(option);
        });
        snr.forEach(snrValue => {
            let option = document.createElement('option');
            option.value = snrValue;
            option.textContent = snrValue;
            snrRegionSelect.appendChild(option);
        });

    }

    function drawBoxPlot(data, selectedAlgorithm, selectedSNR, selectedType, selectedRange) {
        let jsonData = data.data.filter(obj => obj.Algorithm === selectedAlgorithm);
        const type = {
            "D_fitted": "Diffusion",
            "Dp_fitted": "Perfusion",
            "f_fitted": "Perfusion Fraction"
        };

        const allD_fittedValues = jsonData
            .filter(obj => obj.SNR === selectedSNR)
            .map(obj => obj[selectedType]);

        const maxValue = Math.max(...allD_fittedValues.map(Math.abs));
        const groundTruthList = jsonData
            .filter(obj => obj.SNR === selectedSNR)
            .map(obj => obj[selectedType.slice(0, -7)]);
        let estimatedRange = Math.abs(maxValue) / Math.min(...groundTruthList)
        rangeSlider.max = Math.round(estimatedRange / 2) * 2        
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
                type: 'violin',
                name: region,
                marker: {
                    outliercolor: 'white',
                },
                boxpoints: 'Outliers'
            };
            plots.push(plot);
            const groundTruth = jsonData
                .filter(obj => obj.Region === region)
                .filter(obj => obj.SNR === selectedSNR)
                .map(obj => obj[selectedType.slice(0, -7)]);
            var constantPoint = {
                x: [region],
                y: groundTruth,
                type: 'scatter',
                name: region + ' ground truth',
                mode: 'markers',
                marker: {
                    color: 'black',
                    size: 10
                },
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

        const allD_fittedValues = jsonData
            .filter(obj => obj.SNR === selectedSNR)
            .map(obj => obj[selectedType]);

        const maxValue = Math.max(...allD_fittedValues.map(Math.abs));
        const groundTruthList = jsonData
            .filter(obj => obj.SNR === selectedSNR)
            .map(obj => obj[selectedType.slice(0, -7)]);
        let estimatedRange = Math.abs(maxValue) / Math.min(...groundTruthList)
        rangeSliderRegion.max = Math.round(estimatedRange / 2) * 2        

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
                type: 'violin',
                name: algorithm,
                marker: {
                    outliercolor: 'white)',
                },
                boxpoints: 'Outliers'
            };
            plots.push(plot);
            const groundTruth = jsonData
                .filter(obj => obj.Algorithm === algorithm)
                .filter(obj => obj.SNR === selectedSNR)
                .map(obj => obj[selectedType.slice(0, -7)]);
            var constantPoint = {
                x: [algorithm],
                y: groundTruth,
                type: 'scatter',
                name: algorithm + ' ground truth',
                mode: 'markers',
                marker: {
                    color: 'black',
                    size: 10
                },
            };
            plots.push(constantPoint);
        });

        var layout = {
            title: `${type[selectedType]} Box Plots for ${selectedRegion} region with ${selectedSNR} SNR`
        };

        Plotly.newPlot('regionDiv', plots, layout);
    }
});
