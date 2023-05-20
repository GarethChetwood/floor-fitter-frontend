import forEach from "lodash/forEach";

const groupInfo = {
    // "groupname": [size, count]
    "A": ["30", 25],
    "B": ["40", 3],
    "C": ["45", 52],
    "D": ["49", 3],
    "E": ["55", 5],
    "FG": ["60", 29],
    "H": ["65", 7],
    "I": ["70", 3],
    "J": ["75", 42],
    "K": ["80", 4],
    "L": ["90", 16],
    "MN": ["120", 11]
};

class Floorboard {
    constructor(lengthGroup) {
        this.lengthGroup = lengthGroup;
        this.length = groupInfo[lengthGroup][0]
    }

    get length() {
        return this.length
    }
}

class FloorboardRow {
    constructor(length) {
        this.capacity = length;
        this.floorboards = [];
      }
    
    currentFill() {
        return this.floorboards.reduce((accum, floorboard) => accum + getFloorboardLength(floorboard["length_group"]), 0);
    }

    projectedFill(floorboard) {
        return currentFill() + getFloorboardLength(floorboard);
    }

    projectedFillProportion(floorboard) {
        return projectedFill(floorboard) / this.capacity;
    }
}

export const createFloorboards = () => {


    let floorBoards = [];

    forEach(groupInfo, ([length, count], lengthGroup) => {
        const arr = Array(count).fill(new Floorboard(lengthGroup));

        arr.forEach((floorBoard) => floorBoards.push(floorBoard));
    });

    console.log(floorBoards);
}

export const calculateRoomRows = (roomWidthStr, boardWidthStr) => {
    // @todo: also consider fireplace
    const roomWidth = parseInt(roomWidthStr, 10);
    const boardWidth = parseInt(boardWidthStr, 10);

    return roomWidth / boardWidth;
};



export const fitFloorboards = (floorboards, roomWidthStr, roomLengthStr, boardWidthStr) => {
    const numRows = calculateRows(roomWidthStr, boardWidthStr);

    const fullRows = Array(Math.floor(numRows)).fill(new FloorboardRow(parseFloat(roomLengthStr)));

    // const thinRowWidth = numRows - Math.floor(numRows);

    // @todo FIREPLACE!!!


    // Implement "best fit" algorithm
    const fittedFloor = bestFitFloor(floorboards, fullRows);
};

export const bestFitFloor = (floorboards, floorboardRows) => {
    
}