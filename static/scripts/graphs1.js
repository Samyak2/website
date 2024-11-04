import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Declare the chart dimensions and margins.
const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 40;

const interpolateNumbers = (start, end, n) =>
  Array.from({ length: n }, (_, i) => start + (i / (n - 1)) * (end - start));

const allValuesX = interpolateNumbers(-10, 10, 1000);

// Move these variables outside of any function so they can be accessed globally
let svg;

// Create a function to update the graph
function updateGraph(amplitude = 1, frequency = 1) {
  // Calculate new values with amplitude and frequency
  const sampledData = allValuesX.map((x) => ({
    index: x,
    value: amplitude * Math.sin(frequency * x * (Math.PI * 2)),
  }));

  // Update the existing line
  svg
    .select(".sampled-line")
    .transition()
    .duration(100)
    .attr("d", line(sampledData));
}

// Declare the x (horizontal position) scale.
const x = d3.scaleLinear([-10, 10], [marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear([-5.0, 5.0], [height - marginBottom, marginTop]);

// Declare the line generator.
const line = d3
  .line()
  .x((d) => x(d.index))
  .y((d) => y(d.value));

// Function to initialize the graph
function initializeGraph() {
  console.log("Initializing graph...");

  // Create the SVG container.
  svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; height: intrinsic; font-size: 1.2rem;",
    );

  // Add the x-axis without labels.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSize(6))
    .style("font-size", "1.2rem");

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1),
    )
    .style("font-size", "1.2rem");

  // Add the initial sampled line (only once)
  svg
    .append("path")
    .attr("class", "sampled-line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  // Initial graph update
  updateGraph(1, 1);

  console.log("Looking for container element...");
  const container = document.getElementById("graph-container");
  if (!container) {
    console.error("Container element not found!");
    return;
  }
  container.append(svg.node());

  console.log("Looking for slider elements...");
  const amplitudeSlider = document.getElementById("amplitude");
  const frequencySlider = document.getElementById("frequency");

  const amplitudeValue = document.getElementById("amplitudeValue");
  const frequencyValue = document.getElementById("frequencyValue");

  if (!amplitudeSlider || !frequencySlider) {
    console.error("Slider elements not found!");
    return;
  }

  // Add event listeners for all sliders
  amplitudeSlider.addEventListener("input", updateFromSliders);
  frequencySlider.addEventListener("input", updateFromSliders);

  function updateFromSliders() {
    const amplitude = parseFloat(amplitudeSlider.value);
    const frequency = parseFloat(frequencySlider.value);

    amplitudeValue.textContent = amplitude.toFixed(1);
    frequencyValue.textContent = frequency.toFixed(1);

    updateGraph(amplitude, frequency);
  }

  // Initial update
  updateFromSliders();

  console.log("Graph initialization complete.");
}

initializeGraph();
