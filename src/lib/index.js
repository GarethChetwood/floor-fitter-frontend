// @ts-nocheck 
import forEach from "lodash/forEach";
import find from "lodash/find";
import shuffle from "lodash/shuffle";

import { array_move } from "./lib";

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

export class FloorboardRow {
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

    get currentFillproportion() {
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
    let floorboards = [];

    forEach(groupInfo, ([length, count], lengthGroup) => {
        const arr = Array(count).fill(new Floorboard(lengthGroup));

        arr.forEach((floorBoard) => floorboards.push(floorBoard));
    });

    floorboards = shuffle(floorboards);

    return floorboards;
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

export const bestFitFloor = (floorboards, floorboardRows, tolerance = 0.05) => {
    let floorboardStock = [...floorboards];
    let fittedRows = [...floorboardRows];

    // floorboardStock = orderBy(floorboardStock, (floorboard) => parseInt(floorboard.length, 10), "desc");
    // floorboardStock = shuffle(floorboardStock);

    while (floorboardStock.length > 0) {
        const floorboard = floorboardStock[0];
        const foundFloorboardRow = find(fittedRows, (fittedRow) => findBestFitForRow(fittedRow, floorboard, floorboardStock, tolerance));

        if (foundFloorboardRow) {
            foundFloorboardRow.addFloorboard(floorboardStock.shift());
        } else {
            console.error("Could not find a row with enough room for floorboard", floorboard, `[floorboards: ${floorboardStock.length}, rows: ${fittedRows.length}`);
            throw Error("Quitting...");
        }
    }

    return fittedRows;
}

const findBestFitForRow = (floorboardRow, currentFloorboard, remainingFloorboards, tolerance) => {
    const isProjectionWithinTolerance = floorboardRow.projectedFillProportion(currentFloorboard) < (1.0 + tolerance);
    const rowIsNotFull = floorboardRow.currentFillproportion < 1.0;

    if (isProjectionWithinTolerance && rowIsNotFull) {
        // See if any other floorboard would fit better
        const currentProjectedFill = floorboardRow.projectedFill(currentFloorboard);

        // But only if this one brings us to over capacity
        if (currentProjectedFill > floorboardRow.capacity) {
            // Look for another floorboard that might fit better
            const potentialBetterFit = find(remainingFloorboards, (potentialFloorboard) => { 
                const potentialProjected = floorboardRow.projectedFill(potentialFloorboard); 
                return potentialProjected > floorboardRow.capacity && potentialProjected < currentProjectedFill
            });
            if (potentialBetterFit) {
                return false;
            }
        }
        return true;
    }

    return false;
}

export const countConsecutives = (floorboards) => {
    let prev = "";
    const consecs = {}

    floorboards.forEach((fb) => {
        const lg = fb.lengthGroup;
        if (lg === prev) {
            consecs[lg] = (consecs[lg] || 0) + 1
        }
        prev = lg;
    })

    return consecs;
}

export const moveConsec = (floorboards) => {
    let consecIndex;
    let prevGroup;

    // Find consec index
    floorboards.some((fb, i) => {
        if (fb.lengthGroup === prevGroup) {
            consecIndex = i;
            return true
        } else {
            prevGroup = fb.lengthGroup;
        }
    });

    prevGroup = undefined;
    let newIndex;

    // Find new location
    floorboards.some((fb, i) => {
        if(fb.lengthGroup !== prevGroup) {
            const lg = fb.lengthGroup;
            const nextGroup = floorboards[i + 1]?.lengthGroup;
            if( nextGroup !== lg && prevGroup !== lg) {
                newIndex = i;
                return true;
            } else {
                prevGroup = fb.lengthGroup;
            }
        }
    });

    return array_move(floorboards,consecIndex, newIndex);
};
