// @ts-nocheck
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import shuffle from 'lodash/shuffle';
import min from 'lodash/min';
import map from 'lodash/map';
import sum from 'lodash/sum';
import values from 'lodash/values';
import round from 'lodash/round';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

import { saveAs } from 'file-saver';

import { array_move } from './lib';
import { groupInfo, CHIMNEY_BREAST, OVERFILL_TOLERANCE } from '../constants';

class Floorboard {
	constructor(lengthGroup, offset = 0) {
		this._lengthGroup = lengthGroup;
		this._length = parseInt(groupInfo[lengthGroup][0], 10);
		this._offset = offset;
	}

	get length() {
		return this._length;
	}

	get lengthGroup() {
		return this._lengthGroup;
	}

	get offset() {
		return this._offset;
	}

	set offset(val) {
		this._offset = val;
	}
}

export class FloorboardRow {
	constructor(length, index, floorboards = []) {
		this._capacity = length;
		this._floorboards = floorboards;
		this._index = index;
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

	get index() {
		return this._index;
	}

	get floorboards() {
		return this._floorboards;
	}

	set floorboards(val) {
		this._floorboards = val;
	}

	set index(val) {
		this._index = val;
	}

	projectedFill(floorboard) {
		return this.currentFill + floorboard.length;
	}

	projectedFillProportion(floorboard) {
		return this.projectedFill(floorboard) / this._capacity;
	}

	addFloorboard(floorboard) {
		this.floorboards.push(new Floorboard(floorboard.lengthGroup, this.currentFill));
	}

	get consecutives() {
		return countConsecutives(this.floorboards);
	}

	// matchesRow(siblingRow) {
	// 	const siblingBoards = siblingRow?.floorboards || [];
	// 	return isEmpty(siblingBoards)
	// 		? false
	// 		: this.floorboards.some((boardFromThis) =>
	// 			siblingBoards.some(
	// 				(siblingBoard) =>
	// 				(boardFromThis.lengthGroup === siblingBoard.lengthGroup &&
	// 					boardFromThis.offset === siblingBoard.offset)
	// 			)
	// 		);
	// }

	// matchesSiblings(prev, next) {
	// 	console.log('Checking if', this, 'matches', prev, 'or', next);
	// 	const [matchesPrev, matchesNext] = [prev, next].map(this.matchesRow.bind(this));
	// 	if (matchesPrev || matchesNext) console.log(this._index, 'Matches!', matchesPrev, matchesNext);

	// 	return matchesPrev || matchesNext;
	// }

	matchesSiblings(allRows) {
		return this.matchingBoards(allRows).length > 0;
	}

	static hasBoard(boards, specimen) {
		const match = boards.some(
			(board) => board.lengthGroup === specimen.lengthGroup && board.offset === specimen.offset
		);
		// if (match) console.log("Found a match!", specimen, find(boards, (board) => board.lengthGroup === specimen.lengthGroup && board.offset === specimen.offset));
		return match;
	}

	matchingBoards(allRows) {
		const [prevBoards, nextBoards] = [this._index - 1, this._index + 1].map(
			(i) => allRows[i]?.floorboards || []
		);
		const matchedIndices = map(this.floorboards, (thisBoard, i) =>
			FloorboardRow.hasBoard(prevBoards, thisBoard) || FloorboardRow.hasBoard(nextBoards, thisBoard)
				? i
				: false
		);

		const finalMatches = filter(matchedIndices, (val) => val !== false);
		// if (finalMatches.length > 0) console.log("Matching boards for ", this._index, this._floorboards, "and", prevBoards, nextBoards, "are ", finalMatches);

		return finalMatches;
	}
}

export const createFloorboards = () => {
	let floorboards = [];

	forEach(groupInfo, ([length, count], lengthGroup) => {
		const arr = Array(count).fill(new Floorboard(lengthGroup));

		arr.forEach((floorBoard) => floorboards.push(floorBoard));
	});

	return floorboards;
};

export const shuffleFloorboards = (floorboards, overfillTolerance) => {
	let shuffledBoards = shuffle(floorboards);

	// Move around consecutive boards of the same type
	while (totalConsecutives(shuffledBoards) > 0) {
		shuffledBoards = moveConsec(shuffledBoards);
	}

	return shuffledBoards;
};

export const calculateRoomRows = (roomWidthStr, boardWidthStr) => {
	// @todo: also consider fireplace
	const roomWidth = parseFloat(roomWidthStr, 10);
	const boardWidth = parseFloat(boardWidthStr, 10);

	return roomWidth / boardWidth;
};

export const fitFloorboards = (
	floorboards,
	roomWidthStr,
	roomLengthStr,
	boardWidthStr,
	overfillTolerance,
	initialCount
) => {
	const numRows = calculateRoomRows(roomWidthStr, boardWidthStr);

	const chimneyRows = CHIMNEY_BREAST.width / parseFloat(boardWidthStr, 10);

	const fullRows = Array(Math.floor(numRows - chimneyRows))
		.fill(0)
		.map((_, i) => new FloorboardRow(parseFloat(roomLengthStr), i));

	const roomLengthFloat = parseFloat(roomLengthStr);
	const partialRows = [
		CHIMNEY_BREAST.offset,
		roomLengthFloat - CHIMNEY_BREAST.offset - CHIMNEY_BREAST.length
	];
	const allPartialRows = [...partialRows, ...partialRows].sort().reverse();

	const allRows = [
		...fullRows,
		...allPartialRows.map((rowLength, i) => new FloorboardRow(rowLength, i + fullRows.length))
	];

	// const thinRowWidth = numRows - Math.floor(numRows);

	// @todo FIREPLACE!!!

	// Implement "best fit" algorithm
	const fittedFloor = bestFitFloor(floorboards, allRows);

	const nonConsecFloor = moveFittedConsecs(fittedFloor);

	const overfill = round(sum(calculateOverfill(nonConsecFloor)));
	console.log('Fitted! overfill: ', overfill);

	if (overfill > overfillTolerance && initialCount > 0) {
		return fitFloorboards(
			shuffleFloorboards(floorboards),
			roomWidthStr,
			roomLengthStr,
			boardWidthStr,
			overfillTolerance,
			initialCount
		);
	}

	return nonConsecFloor;
};

export const calculateOverfill = (fittedFloor) => {
	return fittedFloor
		.filter((row) => row.currentFill > row.capacity)
		.map((row) => round(row.currentFill - row.capacity, 2));
};

const moveFittedConsecs = (fittedFloor) => {
	let nonConsecFloor = fittedFloor;

	nonConsecFloor.forEach((floorRow, i) => {
		let boards = floorRow.floorboards;

		// Move around consecutive boards of the same type
		while (totalConsecutives(boards) > 0) {
			let newBoards = moveConsec(boards);

			if (isEqual(boards, newBoards)) {
				break;
			}
			boards = newboards;
		}

		nonConsecFloor[i].floorboards = boards;
	});

	return nonConsecFloor;
};

export const bestFitFloor = (floorboards, floorboardRows, tolerance = 0.05) => {
	let floorboardStock = [...floorboards];
	let fittedRows = [...floorboardRows];
	let excessFloorboards = [];

	// floorboardStock = orderBy(floorboardStock, (floorboard) => parseInt(floorboard.length, 10), "desc");
	// floorboardStock = shuffle(floorboardStock);

	while (floorboardStock.length > 0) {
		const floorboard = floorboardStock[0];
		const foundFloorboardRowIndex = findIndex(fittedRows, (fittedRow) =>
			findBestFitForRow(fittedRow, floorboard, floorboardStock, tolerance)
		);
		const foundFloorboardRow = fittedRows[foundFloorboardRowIndex];

		if (foundFloorboardRow) {
			foundFloorboardRow.addFloorboard(floorboardStock.shift(), foundFloorboardRowIndex);
		} else {
			// console.error(
			// 	'Could not find a row with enough room for floorboard',
			// 	floorboard,
			// 	`[floorboards: ${floorboardStock.length}, rows: ${fittedRows.length}`
			// );
			excessFloorboards.push(floorboardStock.shift());
			// throw Error('Quitting...');
		}
	}

	return fittedRows;
};

const findBestFitForRow = (floorboardRow, currentFloorboard, remainingFloorboards, tolerance) => {
	let currentTolerance = tolerance;

	// if projection falls short and there is another board that will fit, ignore tolerance
	const smallestRemainingBoardLength =
		min(map(remainingFloorboards, 'length')) || currentFloorboard.length;
	const projectionFallsShort =
		floorboardRow.capacity - floorboardRow.projectedFill(currentFloorboard) <
		smallestRemainingBoardLength;

	// if (projectionFallsShort) {
	// 	return false;
	// }

	const isProjectionWithinTolerance =
		floorboardRow.projectedFillProportion(currentFloorboard) < 1.0 + currentTolerance;
	const rowIsNotFull = floorboardRow.currentFillproportion < 1.0;

	if (rowIsNotFull) {
		if (isProjectionWithinTolerance && rowIsNotFull) {
			// See if any other floorboard would fit better
			const currentProjectedFill = floorboardRow.projectedFill(currentFloorboard);

			// But only if this one brings us to over capacity
			if (currentProjectedFill > floorboardRow.capacity) {
				// Look for another floorboard that might fit better
				const potentialBetterFit = find(remainingFloorboards, (potentialFloorboard) => {
					const potentialProjected = floorboardRow.projectedFill(potentialFloorboard);
					return (
						potentialProjected > floorboardRow.capacity && potentialProjected < currentProjectedFill
					);
				});
				if (potentialBetterFit) {
					return false;
				}
			}
			return true;
		}

		// If not in tolerance but there are no more boards that will fit, use this one
		if (!isProjectionWithinTolerance) {
			if (smallestRemainingBoardLength >= currentFloorboard.length) {
				return true;
			}
		}
	}

	return false;
};

export const countConsecutives = (floorboards) => {
	let prev = '';
	const consecs = {};

	floorboards.forEach((fb) => {
		const lg = fb.lengthGroup;
		if (lg === prev) {
			consecs[lg] = (consecs[lg] || 0) + 1;
		}
		prev = lg;
	});

	return consecs;
};

const totalConsecutives = (floorboards) => {
	return sum(values(countConsecutives(floorboards)));
};

export const moveConsec = (floorboards) => {
	let consecIndex;
	let consecGroup;
	let prevGroup;

	// Find consec index
	floorboards.some((fb, i) => {
		if (fb.lengthGroup === prevGroup) {
			consecIndex = i;
			consecGroup = fb.lengthGroup;
			return true;
		} else {
			prevGroup = fb.lengthGroup;
		}
	});

	prevGroup = undefined;
	let newIndex;

	// Find new location
	floorboards.some((fb, i) => {
		if (fb.lengthGroup !== prevGroup) {
			const lg = fb.lengthGroup;
			const nextGroup = floorboards[i + 1]?.lengthGroup;

			if (![nextGroup, prevGroup, consecGroup].includes(lg) && nextGroup != prevGroup) {
				newIndex = i;
				return true;
			} else {
				prevGroup = fb.lengthGroup;
			}
		}
	});

	return array_move(floorboards, consecIndex, newIndex);
};

export const saveFloorboardsUrl = (fittedFloor) => {
	const saveableFloor = fittedFloor.map((floorRow) => {
		const rawObjBoards = floorRow.floorboards.map((board) => ({
			lengthGroup: board.lengthGroup,
			offset: board.offset
		}));

		return { floorboards: rawObjBoards, index: floorRow.index, length: floorRow.capacity };
	});

	const fileName = prompt('Enter file name');

	return saveAs(new Blob([JSON.stringify(saveableFloor)]), fileName || 'floorboards.json');
};

export const parseToFittedFloor = (jsonStr) => {
	const parsedData = JSON.parse(jsonStr);

	const newData = parsedData.map(
		({ length, index, floorboards }) =>
			new FloorboardRow(
				length,
				index,
				floorboards.map(({ lengthGroup, offset }) => new Floorboard(lengthGroup, offset))
			)
	);
	console.log('New data !', newData);

	return newData;
};
