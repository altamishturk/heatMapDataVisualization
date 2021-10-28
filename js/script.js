const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';


const width = 1300;
const height = 540;
const padding = 100;
let data = undefined;
let values = undefined;
let xAxisScale = undefined;
let yAxisScale = undefined;
let minYear = undefined;
let maxYear = undefined;


const svg = d3.select('#canvas')


const generateCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
    svg.style('background-color', 'aliceblue')
}

const generateScales = () => {

    minYear = d3.min(values, d => d.year);
    maxYear = d3.max(values, d => d.year);

    xAxisScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, width - padding])


    yAxisScale = d3.scaleTime()
        .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
        .range([padding, height - padding])
}


const genarateAxis = () => {
    const xAxis = d3.axisBottom(xAxisScale)
        .tickFormat(d3.format('d'))

    const yAxis = d3.axisLeft(yAxisScale)
        .tickFormat(d3.timeFormat('%B'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')
}


const generateRect = () => {
    const tooltip = d3.select("body")
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')


    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', d => {
            if (d.variance <= -1) {
                return 'SteelBlue'
            }
            else if (d.variance <= 0) {
                return 'LightSteelBlue'
            }
            else if (d.variance <= 1) {
                return 'Orange'
            }
            else {
                return 'Crimson'
            }
        })
        .attr('data-month', d => d.month - 1)
        .attr('data-year', d => d.year)
        .attr('data-temp', d => d.variance)
        .attr('height', (height - (padding * 2)) / 12)
        .attr('y', d => yAxisScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
        .attr('width', (width - (padding * 2)) / (maxYear - minYear))
        .attr('x', d => xAxisScale(d.year))
        .on('mouseover', d => {
            tooltip.style('visibility', 'visible')
            tooltip.attr('data-year', d.target.__data__.year)

            const date = new Date(d.target.__data__.year, d.target.__data__.month)

            document.querySelector('#tooltip').innerHTML =
                `<h3 id='tip-date'>${d3.timeFormat('%Y - %B')(date)}</h3>
                <div class='temp'>${data.baseTemperature + d.target.__data__.variance} C</div>
                <div class='temp'>${d.target.__data__.variance} C</div>
                `;
            tooltip.style('top', `${d.y}px`)
            tooltip.style('left', `${d.x}px`)
        })
        .on('mouseleave', d => {
            tooltip.style('visibility', 'hidden')
        })

}


// fetching data 
fetch(url)
    .then(res => res.json())
    .then(res => {
        data = res;
        values = data.monthlyVariance
        console.log(values)

        generateCanvas();
        generateScales();
        genarateAxis();
        generateRect();
    })