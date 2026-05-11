function initEarthAnimation() {
    const width = 600;
    const height = 600;
    const config = {
        speed: 0.005,
        verticalTilt: -10,
        horizontalTilt: 0
    };

    const svg = d3.select('#earth-animation')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoOrthographic()
        .scale(220)  // Adjust this value to make the earth smaller or larger
        .translate([width / 2, height / 2]);  // Center the projection
    const path = d3.geoPath().projection(projection);

    drawGlobe();
    enableRotation();

    function drawGlobe() {
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
            .then(data => {
                // Draw the ocean background
                svg.append("circle")
                    .attr("cx", width / 2)
                    .attr("cy", height / 2)
                    .attr("r", projection.scale())
                    .attr("class", "ocean")
                    .style("fill", "#e5e5e5");

                // Draw the land masses
                svg.selectAll(".segment")
                    .data(topojson.feature(data, data.objects.countries).features)
                    .enter().append("path")
                    .attr("class", "segment")
                    .attr("d", path)
                    .style("stroke", "#888")
                    .style("stroke-width", "1px")
                    .style("fill", "#fff")
                    .style("opacity", 1);  // Make land fully opaque
            });
    }

    function enableRotation() {
        let time = 0;
        d3.timer(function (elapsed) {
            projection.rotate([config.speed * elapsed - 160, config.verticalTilt, config.horizontalTilt]);
            svg.selectAll("path").attr("d", path);
            
            // Pulsating effect for the atmosphere
            time += 0.01;
            const scale = 1 + Math.sin(time) * 0.03;
            svg.select(".atmosphere")
                .attr("r", projection.scale() * 1.1 * scale);
        });
    }
}

document.addEventListener('DOMContentLoaded', initEarthAnimation);