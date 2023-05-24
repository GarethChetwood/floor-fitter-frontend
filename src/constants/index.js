import keys from 'lodash/keys';

const roomWidthRaw = 322.5;
const roomLengthRaw = 499.0;

const expansionGap = 1;
const chimneyExpansion = 0;

export const roomWidthStr = `${roomWidthRaw - 2 * expansionGap}`;
export const roomLengthStr = `${roomLengthRaw - 2 * expansionGap}`;
export const boardWidthStr = '12.2';

export const OVERFILL_TOLERANCE = 235;

export const CHIMNEY_BREAST = {
	width: 46,
	length: 141 + chimneyExpansion * 2,
	offset: 123
};

export const WHOLE_ROOM_CENTER_OFFSET = {
	x: parseInt(roomWidthStr) / 2,
	y: -parseInt(roomLengthStr) / 8
};

export const groupInfo = {
	// "groupname": [size, count]
	A: ['30', 25],
	B: ['40', 3],
	C: ['45', 58],
	D: ['49', 3],
	E: ['55', 6],
	FG: ['60', 29],
	H: ['65', 7],
	I: ['70', 3],
	J: ['75', 42],
	K: ['80', 4],
	L: ['90', 16],
	MN: ['120', 11]
};

export const sortedGroups = keys(groupInfo).sort();

export const boardColors = [
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	// 'green',
	'emerald',
	'teal',
	// 'cyan',
	'sky',
	// 'blue',
	'indigo',
	'violet',
	// 'purple',
	'fuchsia',
	'pink',
	'rose'
];
