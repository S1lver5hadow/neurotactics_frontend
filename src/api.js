const API_BASE_URL = "https://neurotactics-5eda2c68e178.herokuapp.com/api";
//const API_BASE_URL = "http://localhost:8000/api";

export async function fetchExample() {
    const response = await fetch(`${API_BASE_URL}/example`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
    }
    return response.json();
}

export async function getMatch(matchId) {
    const response = await fetch(`${API_BASE_URL}/lol/getMatch/${matchId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
    }
    return response.json();
}

export async function getKeyEvents(matchId, team_id) {
    const response = await fetch(`${API_BASE_URL}/lol/getKeyEventData/${matchId}/${team_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
    }
    return response.json();
}

export async function getRank(matchId) {
    const response = await fetch(`${API_BASE_URL}/lol/getGameRank/${matchId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
    }
    return response.json().rank;
}

// Updated getSimilarMatches function
export async function getSimilarMatches(match_id) {
    const response = await fetch(`${API_BASE_URL}/lol/getSimilarMatches/${match_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch similar matches from the API");
    }
    return response.json();
}

export async function getClusters() {
    const response = await fetch(`${API_BASE_URL}/lol/getClusters`);
    if (!response.ok) {
        throw new Error("Failed to fetch clusters from the API");
    }
    return response.json();
}

export async function getPlotFromMatchid(matchId) {
    const response = await fetch(`${API_BASE_URL}/lol/getPlotFromMatchid/${matchId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch clusters from the API");
    }
    return response.json();
}

// Updated getRecentMatches function with correct endpoint name
export async function getRecentMatches(username, tag, region, count = 5) {
    const response = await fetch(`${API_BASE_URL}/lol/getMostRecentMatches/${region}/${username}/${tag}?count=${count}`);
    if (!response.ok) {
        throw new Error("Failed to fetch recent matches from the API");
    }
    return response.json();
}

export async function getAvgStats() {
    const response = await fetch(`${API_BASE_URL}/lol/stats`);
    if (!response.ok) {
        throw new Error("Failed to fetch average stats from the API");
    }
    return response.json();
}
