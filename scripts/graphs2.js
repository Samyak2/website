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

const allValuesX = interpolateNumbers(0, 10, 1000);
const allValuesY = allValuesX.map((i) => Math.sin(i));
// const data = rawData.map((value, index) => {
//   return { index: index, value: value };
// });
const allData = allValuesX.map((x, i) => {
  return { index: x, value: allValuesY[i] };
});

// Move these variables outside of any function so they can be accessed globally
let lowSampleData;
let svg2;

function showPoints1() {
  const pointsContainer = document.getElementById("points1");
  pointsContainer.replaceChildren([]);

  lowSampleData.slice(0, 3).forEach((p, index) => {
    const span = document.createElement("span");
    span.classList.add("pointReprFirst");
    span.textContent =
      `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})` + (index === 2 ? "" : ",");
    pointsContainer.appendChild(span);
  });

  if (lowSampleData.length > 6) {
    const span = document.createElement("span");
    span.classList.add("pointReprFirst");
    span.textContent = `...${lowSampleData.length - 6} more points...`;
    pointsContainer.appendChild(span);
  }

  if (lowSampleData.length > 3) {
    lowSampleData.slice(lowSampleData.length - 3).forEach((p, index) => {
      const span = document.createElement("span");
      span.classList.add("pointReprLast");
      span.textContent =
        `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})` + (index === 2 ? "" : ",");
      pointsContainer.appendChild(span);
    });
  }
}

function showPoints2() {
  const pointsContainer = document.getElementById("points2");
  pointsContainer.replaceChildren([]);

  lowSampleData.slice(0, 3).forEach((p, index) => {
    const span = document.createElement("span");
    span.classList.add("pointReprFirst");
    span.textContent = `${p.y.toFixed(2)}` + (index === 2 ? "" : ",");
    pointsContainer.appendChild(span);
  });

  if (lowSampleData.length > 6) {
    const span = document.createElement("span");
    span.classList.add("pointReprFirst");
    span.textContent = `...${lowSampleData.length - 6} more points...`;
    pointsContainer.appendChild(span);
  }

  if (lowSampleData.length > 3) {
    lowSampleData.slice(lowSampleData.length - 3).forEach((p, index) => {
      const span = document.createElement("span");
      span.classList.add("pointReprLast");
      span.textContent =
        `${p.y.toFixed(2)}` + (index === 2 ? "" : ",");
      pointsContainer.appendChild(span);
    });
  }
}

// Create a function to update the graph
function updateGraph2(numPoints) {
  const lowSampleDataX = interpolateNumbers(0, 10, numPoints);
  const lowSampleDataY = lowSampleDataX.map((x) => Math.sin(x));
  lowSampleData = lowSampleDataX.map((x, i) => ({ x, y: lowSampleDataY[i] }));
  showPoints1();
  showPoints2();

  // Update the lowSampleLine
  const lowSampleLine = d3
    .line()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  // Update the path for lowSampleData
  svg2.select(".lowSamplePath").attr("d", lowSampleLine(lowSampleData));

  // Update scatter plot
  const circles = svg2.selectAll("circle").data(lowSampleData);

  circles
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("fill", "red")
    .merge(circles)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y));

  circles.exit().remove();
}

// Declare the x (horizontal position) scale.
const x = d3.scaleLinear(
  d3.extent(allData, (d) => d.index),
  [marginLeft, width - marginRight],
);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear([-1.0, 1.0], [height - marginBottom, marginTop]);

// Declare the line generator.
const line = d3
  .line()
  .x((d) => x(d.index))
  .y((d) => y(d.value));

// Function to initialize the graph
function initializeGraph2() {
  console.log("Initializing graph...");

  // Create the SVG container.
  svg2 = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; height: intrinsic; font-size: 1.2rem;",
    );

  // Add the x-axis without labels.
  svg2
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3.axisBottom(x).tickSize(6).tickFormat(""), // This removes the labels
    )
    .style("font-size", "1.2rem");

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg2
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
    // .call((g) =>
    //   g
    //     .append("text")
    //     .attr("x", -marginLeft)
    //     .attr("y", 10)
    //     .attr("fill", "currentColor")
    //     .attr("text-anchor", "start")
    //     .text("Value")
    //     .style("font-size", "14px")
    // )
    .style("font-size", "1.2rem");

  // Append a path for the original line.
  svg2
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line(allData));

  // Append a path for the lowSampleData line.
  svg2
    .append("path")
    .attr("class", "lowSamplePath")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 2);

  // Initial graph update
  updateGraph2(24);

  console.log("Looking for container element...");
  const container = document.getElementById("graph-container-2");
  if (!container) {
    console.error("Container element not found!");
    return;
  }
  container.append(svg2.node());

  console.log("Looking for slider elements...");
  const slider = document.getElementById("samplePoints");
  const samplePointsValue = document.getElementById("samplePointsValue");

  if (!slider || !samplePointsValue) {
    console.error("Slider elements not found!");
    return;
  }

  console.log("Adding event listener to slider...");
  slider.addEventListener("input", (event) => {
    const numPoints = parseInt(event.target.value);
    samplePointsValue.textContent = numPoints;
    updateGraph2(numPoints);
  });

  console.log("Graph initialization complete.");
}

initializeGraph2();
