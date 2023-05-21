// @ts-nocheck 
import forEach from "lodash/forEach";
import find from "lodash/find";
import orderBy from "lodash/orderBy";
import shuffle from "lodash/shuffle";

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
        this._lengthGroup = lengthGroup;
        this._length = parseInt(groupInfo[lengthGroup][0], 10);
    }

    get length() {
        return this._length
    }
    
    get lengthGroup() {
        return this._lengthGroup;
    }
}

class FloorboardRow {
    constructor(length) {
        this._capacity = length;
        this.floorboards = [];
      }
    
    get capacity() {
        return this._capacity;
    }

    get currentFill() {
        return this.floorboards.reduce((accum, floorboard) => accum + floorboard.length, 0);
    }

    currentFillproportion() {
        return this.currentFill / this._capacity;
    }

    projectedFill(floorboard) {
        return this.currentFill + floorboard.length;
    }

    projectedFillProportion(floorboard) {
        return this.projectedFill(floorboard) / this._capacity;
    }

    addFloorboard(floorboard) {
        this.floorboards.push(floorboard)
    } 
}

export const createFloorboards = () => {
    let floorBoards = [];

    forEach(groupInfo, ([length, count], lengthGroup) => {
        const arr = Array(count).fill(new Floorboard(lengthGroup));

        arr.forEach((floorBoard) => floorBoards.push(floorBoard));
    });

    return floorBoards;
}

export const calculateRoomRows = (roomWidthStr, boardWidthStr) => {
    // @todo: also consider fireplace
    const roomWidth = parseFloat(roomWidthStr, 10);
    const boardWidth = parseFloat(boardWidthStr, 10);

    return roomWidth / boardWidth;
};



export const fitFloorboards = (floorboards, roomWidthStr, roomLengthStr, boardWidthStr) => {
    const numRows = calculateRoomRows(roomWidthStr, boardWidthStr);

    const fullRows = Array(Math.floor(numRows)).fill(0).map(() => new FloorboardRow(parseFloat(roomLengthStr)));

    // const thinRowWidth = numRows - Math.floor(numRows);

    // @todo FIREPLACE!!!


    // Implement "best fit" algorithm
    const fittedFloor = bestFitFloor(floorboards, fullRows);

    return fittedFloor;
};

export const bestFitFloor = (floorboards, floorboardRows, tolerance = 0.075) => {
    let floorboardStock = [...floorboards];
    let fittedRows = [...floorboardRows];

    floorboardStock = orderBy(floorboardStock, (floorboard) => parseInt(floorboard.length, 10), "desc");
    floorboardStock = shuffle(floorboardStock);

    while (floorboardStock.length > 0) {
        const floorboard = floorboardStock[0];
        const foundFloorboardRow = find(fittedRows, (fittedRow) => fittedRow.projectedFillProportion(floorboard) < (1.0 + tolerance));

        if(foundFloorboardRow) {
            foundFloorboardRow.addFloorboard(floorboardStock.shift());
        } else {
            console.error("Could not find a row with enough room for floorboard", floorboard, `[floorboards: ${floorboardStock.length}, rows: ${fittedRows.length}`);
            throw Error("Quitting...");
        }
    }

    return fittedRows;
}