const canvas = document.getElementById("maze-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const generateEmptyMazeButton = document.getElementById("generate-empty-maze-button");
const generateMazeButton = document.getElementById("generate-maze-button");
const algorithmSelect = document.getElementById("algorithm");
const tickSpeedInput = document.getElementById("tick-speed");
const mazeSizeInput = document.getElementById("maze-size");
const selectedAlgorithmDisplay = document.getElementById("selected-algorithm");
const selectedMazeSizeDisplay = document.getElementById("selected-maze-size");
const currentTickSpeedDisplay = document.getElementById("current-tick-speed");

let rows = 20;
let cols = 20;
let cellSize = canvas.width / cols;
let maze = [];
let visited = [];
let parent = [];
let memos = [];

let canvasMouseIsDown = false;
let mazeDrawWallMode = false;
let pathFinding = false;
let pathFindStartTime = null;

let showCoordinateMode = false;
