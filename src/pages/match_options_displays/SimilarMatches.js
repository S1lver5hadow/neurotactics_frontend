import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import '../../App.css';
import { getCharacterImage, getItemImage, getRankImg, getRegion, ranksToColour } from '../../utils/helpers.js';
import { getSimilarMatches, getClusters, getPlotFromMatchid, getRank } from '../../api.js';
import matchStyles from '../styles/matchStyles.js';
import * as d3 from 'd3';  
import SimilarMatchCard  from '../../components/SimilarMatchCard.js';
import ClusterButtonBar from '../../components/ClusterButtonBar.js';


const RANK_COLORS = {
  'IRON': '#9AA4AF',       // Brighter metallic gray
  'BRONZE': '#CD7F32',     // More vibrant bronze
  'SILVER': '#C0C0C0',     // Brighter silver
  'GOLD': '#FFD700',       // More vibrant gold
  'PLATINUM': '#50E3C2',   // Brighter turquoise
  'EMERALD': '#50C878',    // Brighter emerald green
  'DIAMOND': '#B9F2FF',    // Brighter diamond blue
  'CHALLENGER': '#FFC857',  // Brighter golden yellow
  'CURRENT': 'black'        // New category for the current match
};

export default function SimilarMatchesPage() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  const posId = parseInt(searchParams.get('posId'));
  const navigate = useNavigate();
  const [similarMatches, setSimilarMatches] = useState({ matches: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [rank, setRank] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const svgRef = useRef(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const [visibleRanks, setVisibleRanks] = useState(
    Object.keys(RANK_COLORS).reduce((acc, rank) => ({ ...acc, [rank]: false }), {})
  );
  const [currentMatchPlot, setCurrentMatchPlot] = useState(null);
  const [selectedCentroidData, setSelectedCentroidData] = useState(null);
  const [showCentroidExplorer, setShowCentroidExplorer] = useState(true);
  const [showRankFilters, setShowRankFilters] = useState(true);
  const [showClustering, setShowClustering] = useState(false);


  useEffect(() => {
    async function fetchRank() {
      const rank = await getRank(matchId);
      setRank(ranksToColour[rank]);
    }
    fetchRank();
  }, [matchId]);

  // Updated useEffect to fetch both clusters and similar matches
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Fetch clusters and similar matches in parallel
        const [clustersResponse, matchesResponse, itemsResponse, currentMatchResponse] = await Promise.all([
          getClusters(),
          getSimilarMatches(matchId),
          fetch("/items/items.json")
        ]);

        if (!mounted) return;

        if (!itemsResponse.ok) {
          throw new Error("No item data");
        }
        const itemsJson = await itemsResponse.json();
        
        setPlotData(clustersResponse);
        setSimilarMatches(matchesResponse);
        setItems(itemsJson.data);
        setLoading(false);
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [matchId, posId, rank]);

  // Add scale factor constant at the start of useEffect
  const SCALE_FACTOR = 1;
  
  // Update the D3 useEffect to handle null plotData
  useEffect(() => {
    if (!svgRef.current || !plotData) return;
    
    // Log the state of the data we're working with
    
    const width = 800;
    const height = 600;
    const pointRadius = 5;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
      .style('border-radius', '10px')
      .style('box-shadow', '0 15px 25px rgba(0, 0, 0, 0.5)');

    svg.selectAll('*').remove();

    // Only include current match in extent calculation if it has valid coordinates
    const hasValidCurrentMatch = currentMatchPlot && 
                                currentMatchPlot.plot && 
                                typeof currentMatchPlot.plot.x === 'number' && 
                                typeof currentMatchPlot.plot.y === 'number' &&
                                !isNaN(currentMatchPlot.plot.x) && 
                                !isNaN(currentMatchPlot.plot.y);
    

    const xExtent = d3.extent([
      ...plotData.matches_data.map(d => d.plot.x),
      ...plotData.centroids.map(d => d.x),
      ...(hasValidCurrentMatch ? [currentMatchPlot.plot.x] : [])
    ]);
    const yExtent = d3.extent([
      ...plotData.matches_data.map(d => d.plot.y),
      ...plotData.centroids.map(d => d.y),
      ...(hasValidCurrentMatch ? [currentMatchPlot.plot.y] : [])
    ]);

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - 10, xExtent[1] + 10])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - 10, yExtent[1] + 10])
      .range([height - margin.bottom, margin.top]);

    // Create clip path to prevent points from rendering outside the plot area
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);

    // Create main group for zooming
    const g = svg.append('g')
      .attr("clip-path", "url(#clip)");

    // Add tooltip div
    const tooltip = d3.select(svgRef.current)
      .append('g')
      .attr('class', 'tooltip')
      .style('visibility', 'hidden');

    // Add background rectangle for tooltip
    tooltip.append('rect')
      .attr('fill', 'rgba(30, 30, 46, 0.95)')
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // Add text elements for rank and outcome
    tooltip.append('text')
      .attr('class', 'tooltip-rank')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em');

    tooltip.append('text')
      .attr('class', 'tooltip-outcome')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.4em');

    // Add text element for match ID in the tooltip
    tooltip.append('text')
      .attr('class', 'tooltip-match-id')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', '3.6em');

    // Function to update point positions
    const updatePoints = (transform) => {
      const xScaleZ = transform.rescaleX(xScale);
      const yScaleZ = transform.rescaleY(yScale);

      g.selectAll('.match-point')
        .attr('cx', d => xScaleZ(d.plot.x))
        .attr('cy', d => yScaleZ(d.plot.y))
        .attr('r', Math.max(pointRadius * SCALE_FACTOR * Math.sqrt(transform.k), 1))
        .attr('stroke-width', Math.max(2 * SCALE_FACTOR * Math.sqrt(transform.k), 1));

      g.selectAll('.centroid')
        .attr('cx', d => xScaleZ(d.plot.x))
        .attr('cy', d => yScaleZ(d.plot.y))
        .attr('r', Math.max((pointRadius * 2) * SCALE_FACTOR * Math.sqrt(transform.k), 1))
        .attr('stroke-width', Math.max(2 * SCALE_FACTOR * Math.sqrt(transform.k), 1));

      // Only update current match point if it exists
      if (hasValidCurrentMatch) {
        g.selectAll('.current-point')
          .attr('cx', d => xScaleZ(12 + ((d.plot.x + 2.5) * 10)))
          .attr('cy', d => yScaleZ(-3 + ((d.plot.y - 12.45) * 10)))
          .attr('r', Math.max(pointRadius * 1.5 * SCALE_FACTOR * Math.sqrt(transform.k), 1))
          .attr('stroke-width', Math.max(2 * SCALE_FACTOR * Math.sqrt(transform.k), 1))
          .style('opacity', visibleRanks['CURRENT'] ? 1 : 0);
      }
    };

    // Draw matches with updated tooltip interactions
    g.selectAll('.match-point')
      .data(plotData.matches_data.filter(d => visibleRanks[d.rank]))
      .join('circle')
      .attr('class', 'match-point')
      .attr('cx', d => xScale(d.plot.x))
      .attr('cy', d => yScale(d.plot.y))
      .attr('r', pointRadius)
      .attr('fill', d => RANK_COLORS[d.rank])
      .attr('stroke', d => d.did_win ? 'green' : 'red')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        const point = d3.select(event.currentTarget);
        const cx = parseFloat(point.attr('cx'));
        const cy = parseFloat(point.attr('cy'));

        // Update tooltip text
        tooltip.select('.tooltip-rank')
          .text(`Rank: ${d.rank}`);
        tooltip.select('.tooltip-outcome')
          .text(d.did_win ? 'Victory' : 'Defeat');
        tooltip.select('.tooltip-match-id')
          .text(`Match ID: ${d.match_id}`);

        // Get text bounds to size background rectangle
        const rankTextBounds = tooltip.select('.tooltip-rank').node().getBBox();
        const outcomeTextBounds = tooltip.select('.tooltip-outcome').node().getBBox();
        const matchIdTextBounds = tooltip.select('.tooltip-match-id').node().getBBox();
        const boxWidth = Math.max(rankTextBounds.width, outcomeTextBounds.width, matchIdTextBounds.width) + 20;
        const boxHeight = 70; // Adjusted height to accommodate match ID

        // Update background rectangle size and position
        tooltip.select('rect')
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('x', -boxWidth / 2)
          .attr('y', 0);

        // Position tooltip below point
        tooltip
          .attr('transform', `translate(${cx}, ${cy + pointRadius + 5})`)
          .style('visibility', 'visible');

        // Update highlight to maintain thinner stroke
        point.attr('r', pointRadius * 1.5)
          .attr('stroke-width', 2);
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');
        
        // Reset point size and maintain thinner stroke
        d3.select(event.currentTarget)
          .attr('r', pointRadius)
          .attr('stroke-width', 1);
      })
      .on('click', (event, d) => {
        navigate(`/game?matchId=${d.match_id}`);  // Navigate to match detail view
      });

    // Draw centroids
    g.selectAll('.centroid')
      .data(plotData.centroids)
      .join('circle')
      .attr('class', 'centroid')
      .attr('cx', d => xScale(d.plot.x))
      .attr('cy', d => yScale(d.plot.y))
      .attr('r', pointRadius * 2)
      .attr('fill', '#666666')
      .attr('cursor', 'pointer')
      .attr('stroke-width', 2);

    // Draw current match point with proper data binding
    // Draw current match point ONLY if it has valid coordinates
    if (hasValidCurrentMatch && visibleRanks['CURRENT']) {
      
      g.selectAll('.current-point')
        .data([currentMatchPlot])
        .join('circle')
        .attr('class', 'current-point')
        .attr('cx', d => xScale(d.plot.x))
        .attr('cy', d => yScale(d.plot.y))
        .attr('r', pointRadius * 1.5)
        .attr('fill', 'black')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 1)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('r', pointRadius * 2)
            .attr('stroke-width', 3);
          
          // Add tooltip for current match
          tooltip.select('.tooltip-rank')
            .text(`Current Match`);
          tooltip.select('.tooltip-match-id')
            .text(`Match ID: ${d.match_id}`);
          
          const point = d3.select(this);
          const cx = parseFloat(point.attr('cx'));
          const cy = parseFloat(point.attr('cy'));
          
          // Position tooltip
          tooltip
            .attr('transform', `translate(${cx}, ${cy + pointRadius + 5})`)
            .style('visibility', 'visible');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('r', pointRadius * 1.5)
            .attr('stroke-width', 2);
          tooltip.style('visibility', 'hidden');
        })
        .on('click', (event, d) => {
          navigate(`/game?matchId=${d.match_id}`);
        });
    }

    // Define zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        updatePoints(event.transform);
      });

    // Store zoom behavior and scales on the SVG element for reuse
    svg.node().__zoom__ = zoom;
    svg.node().__scales__ = { xScale, yScale };

    // Add zoom behavior to SVG
    svg.call(zoom);

    // Function to calculate transform that fits all points
    const calculateFitTransform = (width, height, margin, xExtent, yExtent, currentTransform) => {
      
      // Add padding to the extents
      const padding = 50;
      const dx = (xExtent[1] - xExtent[0]) + padding * 2;
      const dy = (yExtent[1] - yExtent[0]) + padding * 2;
      const x = (xExtent[0] + xExtent[1]) / 2;
      const y = (yExtent[0] + yExtent[1]) / 2;

      // Available space accounting for margins
      const availableWidth = width - margin.left - margin.right;
      const availableHeight = height - margin.top - margin.bottom;
      
      // Calculate scale to fit all points
      const scale = Math.min(
        availableWidth / dx,
        availableHeight / dy
      ) * 0.5;
      
      // Calculate the movement needed relative to current position
      const currentX = currentTransform ? currentTransform.x : 0;
      const currentY = currentTransform ? currentTransform.y : 0;
      
      const translate = [
        width/2 - scale * x,
        height/2 - scale * y
      ];
      
      return { scale, translate };
    };

    // Store the calculation function and constants for reuse
    svg.node().__fitTransform = calculateFitTransform;
    svg.node().__dimensions = { width, height, margin };

    // Initial transform
    handleRecenter();

    // Add click handler for centroids
    g.selectAll('.centroid').on('click', (event, d) => {
      setSelectedCentroidData(d);

      const scale = 4;
      const x = xScale(d.plot.x);
      const y = yScale(d.plot.y);
      
      svg.transition()
        .duration(750)
        .call(zoom.transform, 
          d3.zoomIdentity
            .translate(width/2 - scale * x, height/2 - scale * y)
            .scale(scale)
        );
    });

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      tooltip.remove();
    };
  }, [plotData, visibleRanks, currentMatchPlot]);

  const handleRecenter = () => {
    if (!svgRef.current || !plotData) return;
    const svg = d3.select(svgRef.current);
    const zoom = svg.node().__zoom__;

    const width = 800;
    const height = 10000;
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };

    // Calculate the extents without similar match points
    const xExtent = d3.extent([
      ...plotData.matches_data.filter(d => visibleRanks[d.rank]).map(d => d.plot.x),
      ...plotData.centroids.map(d => d.plot.x),
      ...(currentMatchPlot && visibleRanks['CURRENT'] ? [currentMatchPlot.plot.x] : [])
    ]);
    
    const yExtent = d3.extent([
      ...plotData.matches_data.filter(d => visibleRanks[d.rank]).map(d => d.plot.y),
      ...plotData.centroids.map(d => d.plot.y),
      ...(currentMatchPlot && visibleRanks['CURRENT'] ? [currentMatchPlot.plot.y] : [])
    ]);

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - 50, xExtent[1] + 50])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - 50, yExtent[1] + 50])
      .range([height - margin.bottom, margin.top]);

    // Calculate the center of the extents
    const xCenter = (xExtent[0] + xExtent[1]) / 2;
    const yCenter = (yExtent[0] + yExtent[1]) / 2;

    // Calculate the scale and translation
    const scale = 1;  // Adjust this scale factor as needed
    const x = xScale(xCenter);
    const y = yScale(yCenter);

    // Apply the transform to recenter
    svg.transition()
      .duration(750)
      .call(zoom.transform, 
        d3.zoomIdentity
          .translate(width / 2 - scale * x, height / 2 - scale * y)
          .scale(scale)
      );

    // Hide the centroid data overlay
    setSelectedCentroidData(null);
  };


  const renderMatch = (match, index) => {
    const player = match.scoreboard[posId]

    if (match.rank === "UNRANKED") {
      match.rank = rank
    }

    return (
      <SimilarMatchCard 
      key={index} 
      match={match} 
      items={items} 
      player={player}
      />
    );
  };

  // Update the RankFilters component to fit in the new layout
  const RankFilters = () => {
    const allSelected = Object.values(visibleRanks).every(Boolean);
    
    const toggleAllRanks = () => {
      const newState = !allSelected;
      setVisibleRanks(Object.keys(RANK_COLORS).reduce((acc, rank) => ({ ...acc, [rank]: newState }), {}));
    };

    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333',
        maxHeight: '600px',
        overflowY: 'auto',
        width: '200px',
        marginLeft: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ color: 'white', margin: 0 }}>Rank Filters</h3>
          <button 
            onClick={() => setShowRankFilters(!showRankFilters)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            cursor: 'pointer',
            opacity: allSelected ? 1 : 0.7,
            padding: '8px',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}
          onClick={toggleAllRanks}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
        >
          <div style={{
            width: '18px',
            height: '18px',
            backgroundColor: allSelected ? '#28a745' : '#dc3545',
            marginRight: '10px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }} />
          <span style={{ color: 'white', fontWeight: 'bold' }}>{allSelected ? 'Deselect All' : 'Select All'}</span>
        </div>
        {Object.entries(RANK_COLORS).map(([rank, color]) => (
          <div 
            key={rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              cursor: 'pointer',
              opacity: visibleRanks[rank] ? 1 : 0.7,
              padding: '6px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            onClick={() => setVisibleRanks(prev => ({
              ...prev,
              [rank]: !prev[rank]
            }))}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: color,
              marginRight: '10px',
              borderRadius: '4px',
              border: '1px solid #444'
            }} />
            <span style={{ color: 'white' }}>{rank}</span>
          </div>
        ))}
      </div>
    );
  };

  // Add detailed logging for the current match plot data
  useEffect(() => {
    async function fetchCurrentMatchPlot() {
      try {
        
        // Fetch the plot for the current match
        const currentPlotResponse = await getPlotFromMatchid(matchId);
      
        
        if (currentPlotResponse) {
          // Format the data and set it
          currentPlotResponse.match_id = matchId;
          setCurrentMatchPlot(currentPlotResponse);
        } else {
          console.error("Failed to get current match plot data");
        }
      } catch (err) {
        console.error("Error in fetchCurrentMatchPlot:", err);
      }
    }

    fetchCurrentMatchPlot();
  }, [matchId]);

  // Function to render the bar chart
  const renderBarChart = (data) => {
    // Clear existing chart
    d3.select("#bar-chart").selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Win/Loss Distribution by Rank");

    const ranks = Object.keys(data.info);
    const x = d3.scaleBand()
      .domain(ranks)
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(ranks, rank => data.info[rank].wins + data.info[rank].losses)])
      .nice()
      .range([height, 0]);

    // Add background grid
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat("")
      )
      .style("stroke", "rgba(255,255,255,0.1)")
      .style("stroke-dasharray", "3,3");

    // Add bars
    svg.append("g")
      .selectAll("g")
      .data(ranks)
      .enter().append("g")
      .attr("transform", d => `translate(${x(d)},0)`)
      .selectAll("rect")
      .data(rank => [
        { type: "wins", value: data.info[rank].wins },
        { type: "losses", value: data.info[rank].losses }
      ])
      .enter().append("rect")
      .attr("x", (d, i) => i * (x.bandwidth() / 2))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth() / 2)
      .attr("height", d => height - y(d.value))
      .attr("fill", d => d.type === "wins" ? "#28a745" : "#dc3545")
      .attr("rx", 3)
      .attr("ry", 3)
      .style("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("opacity", 1)
          .attr("stroke", "white")
          .attr("stroke-width", 1);
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("opacity", 0.8)
          .attr("stroke", "none");
      });

    // Add x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("color", "white")
      .selectAll("text")
      .style("text-anchor", "middle");

    // Add y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .style("color", "white");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .text("Number of Matches");

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 100}, ${height + 35})`);

    // Win legend
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#28a745")
      .attr("rx", 2)
      .attr("ry", 2);

    legend.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Wins");

    // Loss legend
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#dc3545")
      .attr("x", 60)
      .attr("rx", 2)
      .attr("ry", 2);

    legend.append("text")
      .attr("x", 80)
      .attr("y", 12)
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Losses");
  };

  useEffect(() => {
    if (selectedCentroidData) {
      renderBarChart(selectedCentroidData);
    }
  }, [selectedCentroidData]);

  // Function to handle centroid selection from the explorer panel
  const handleCentroidSelect = (centroid) => {
    setSelectedCentroidData(centroid);
    
    // Center the view on the selected centroid
    if (svgRef.current && centroid) {
      const svg = d3.select(svgRef.current);
      const zoom = svg.node().__zoom__;
      
      if (!zoom) return;
      
      const width = 800;
      const height = 600;
      const scale = 4;
      
      // Get the scales from the SVG node
      const xScale = svg.node().__scales__?.xScale;
      const yScale = svg.node().__scales__?.yScale;
      
      if (!xScale || !yScale) return;
      
      const x = xScale(centroid.plot.x);
      const y = yScale(centroid.plot.y);
      
      svg.transition()
        .duration(750)
        .call(zoom.transform, 
          d3.zoomIdentity
            .translate(width/2 - scale * x, height/2 - scale * y)
            .scale(scale)
        );
    }
  };

  // Centroid Explorer Component
  const CentroidExplorer = () => {
    if (!plotData || !plotData.centroids) return null;
    
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333',
        maxHeight: '600px',
        overflowY: 'auto',
        width: '250px',
        marginRight: '20px',
        scrollbarWidth: 'none', // Hide scrollbar in Firefox
        msOverflowStyle: 'none' // Hide scrollbar in IE/Edge
      }}>
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ color: 'white', margin: 0 }}>Centroid Explorer</h3>
          <button 
            onClick={() => setShowCentroidExplorer(!showCentroidExplorer)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            {showCentroidExplorer ? '×' : '☰'}
          </button>
        </div>
        
        <div>
          {plotData.centroids.map((centroid, index) => (
            <div 
              key={index}
              onClick={() => handleCentroidSelect(centroid)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '10px',
                backgroundColor: selectedCentroidData === centroid ? 'rgba(255, 103, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                border: selectedCentroidData === centroid ? '1px solid #ff6700' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedCentroidData !== centroid) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCentroidData !== centroid) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#666666',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}></div>
                <span style={{ color: 'white', fontWeight: 'bold' }}>Centroid {index + 1}</span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                {Object.keys(centroid.info).map(rank => (
                  <div 
                    key={rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: RANK_COLORS[rank] || '#fff',
                      borderRadius: '50%',
                      marginRight: '5px'
                    }}></div>
                    <span style={{ color: 'white' }}>{rank}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
                {Object.entries(centroid.info).reduce((total, [rank, data]) => 
                  total + data.wins + data.losses, 0)} matches
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Mini Bar Chart Component for the Explorer
  const MiniBarChart = ({ data }) => {
    useEffect(() => {
      if (!data) return;
      
      // Render mini bar chart logic here
      const renderMiniBarChart = () => {
        // Implementation similar to renderBarChart but simplified
        // for the smaller space in the explorer
      };
      
      renderMiniBarChart();
    }, [data]);
    
    return <div id={`mini-chart-${data.id}`} style={{ height: '80px', width: '100%' }}></div>;
  };

  // Add a back button to return to recent matches
  const handleBackClick = () => {
    navigate('/recent-matches');
  };

  const hasVisibleRanks = Object.values(visibleRanks).some(Boolean);

  return (
    <div 
    style={{
      backgroundImage: 'url("/matches_list_display.jpg")',
      backgroundSize: '100% 100%', // Forces the image to fit the entire screen
      backgroundPosition: 'top left', // Adjust as needed
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Keeps background static
      minHeight: '100vh',
      minWidth: '100vw',
      overflowX: 'hidden', // Prevents horizontal scrolling
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
    }}>


    <button 
      onClick={handleBackClick}
      style={{
        position: 'absolute',
        top: '6vh',
        right: '1.8vw',
        background: 'none', // No background
        border: 'none', // No border
        color: 'grey', // Softer red, adjust as needed
        fontSize: 'clamp(1rem, 1.3vw, 1.8rem)', // Slightly larger text
        fontWeight: 'bold', // Make it stand out
        cursor: 'pointer', // Show pointer on hover
        transition: 'color 0.3s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.color = '#e60000'; // Darker red on hover
        e.target.style.transform = 'scale(1.05)'; // Slight pop effect
      }}
      onMouseLeave={(e) => {
        e.target.style.color = 'grey'; // Revert color
        e.target.style.transform = 'scale(1)'; // Revert size
      }}
    >
      Back
    </button>


    <div className="overall" style={{
      minHeight: '65vh',
      maxHeight: '80vh',
      width: '85%', // Reduce a bit to prevent overflow
      overflowY: 'auto',
      marginTop: '-3vh',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '3%', // Shift everything to the right
    }}>

    <div 
      style={{
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',  // Align everything to the left
        width: '100%', 
      }}
    >


    <div style={{
      textAlign: 'left',
      padding: '20px 15px',
      fontSize: '50px',
      fontWeight: 'bold',
      color: 'white'
    }}>
      <span style={{ color: '#ffffff' }}>Similar</span> <span style={{ color: '#ff6700' }}>Matches</span>
      <p style={{ fontSize: '25px', fontWeight: 'normal', color: '#aaaaaa' }}>
        Analyze Matches Which Play Like You
      </p>
    </div>

    <ClusterButtonBar 
    showClustering={showClustering} 
    onClick={() => setShowClustering(!showClustering)} 
    />
  <div style={{ marginBottom: '20px' }} />

    </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
        {showClustering ? (
          <div>
          <div style={{ 
            marginBottom: '20px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            justifyContent: 'center'
          }}>
            <button 
              onClick={handleRecenter}
              disabled={!plotData || !plotData.matches_data || plotData.matches_data.length === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6700',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(255, 103, 0, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 10px 20px rgba(255, 103, 0, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 5px 15px rgba(255, 103, 0, 0.4)';
              }}
            >
              Recenter View
            </button>
            


          </div>

          <div style={{ 
            display: 'flex', 
            position: 'relative',
            justifyContent: 'center'
    
          }}>
            {showCentroidExplorer && <CentroidExplorer />}
            
            <div style={{ position: 'relative', flex: 1 }}>
              <svg 
                ref={svgRef} 
                data-testid="plot-svg"
                width="1000" 
                height="700" 
                style={{ 
                  backgroundColor: '#1a1a1a', 
                  marginBottom: '20px',
                  border: '1px solid #333',
                  width: '60%',
                  height: '600px'
                }}
              ></svg>
            </div>
            
            {showRankFilters && <RankFilters />}
          </div>

          {selectedCentroidData && (
            <div id="bar-chart-container" style={{
              position: 'absolute',
              left: showCentroidExplorer ? '9000px' : '20px',
              bottom: '20px',
              backgroundColor: '#1a1a1a', // Match card background
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 15px 25px rgba(0, 0, 0, 0.5)',
              border: '1px solid #333',
              maxWidth: '450px',
              transition: 'left 0.3s ease'
            }}>
              <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px', textAlign: 'center' }}>Centroid Data</h3>
              <svg id="bar-chart"></svg>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button 
                  onClick={() => setSelectedCentroidData(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#444'}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          </div>
        ):(
          <div>
          {similarMatches.matches.map(renderMatch)}
          </div>
        )}
        </>
      )}
    </div>
</div>
  );
}

