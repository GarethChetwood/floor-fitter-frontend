<script lang="ts">
	import sum from 'lodash/sum';
	import values from 'lodash/values';
	import round from 'lodash/round';
	import filter from 'lodash/filter';
	import FloorboardRow from '../components/FloorboardRow.svelte';
	import {
		FloorboardRow as FloorboardRowClass,
		createFloorboards,
		fitFloorboards,
		countConsecutives,
		moveConsec
	} from '../lib/index';
	import {
		roomWidthStr,
		roomLengthStr,
		boardWidthStr,
		WHOLE_ROOM_CENTER_OFFSET
	} from '../constants';

	let consecs = {};
	let floorboards = createFloorboards();
	let fittedFloor: FloorboardRowClass[] = [];

	$: {
		consecs = countConsecutives(floorboards);
		fittedFloor = fitFloorboards(floorboards, roomWidthStr, roomLengthStr, boardWidthStr);
	}

	const moveConsecOnClick = () => {
		floorboards = moveConsec(floorboards);
	};

	let rowMatchingSiblings = [];
	$: rowMatchingSiblings = fittedFloor.map((floorRow, i) => {
		const match = floorRow.matchesSiblings(fittedFloor[i - 1], fittedFloor[i + 1]) ? i : false;
		if (match) console.log(i, 'matches a sibling!');
		return match;
	});

	let overfill = [];
	$: overfill = fittedFloor
		.filter((row) => row.currentFill > row.capacity)
		.map((row) => round(row.currentFill - row.capacity, 2));

	const boardWidthFloat = parseFloat(boardWidthStr);
</script>

<div>
	<h1 class="text-3xl font-bold text-center">Floor fitter frontend</h1>
	<!-- <h2 class="text-2xl font-bold text-center">Consecutives:</h2> -->
	<!-- <h2 class="text-xl font-bold text-center">{JSON.stringify(consecs)}</h2> -->
	<h2 class="text-lg font-bold text-center">Total consecutives: {sum(values(consecs))}</h2>
	<div class="flex justify-center">
		<button class="btn" on:click={moveConsecOnClick}>Move consec</button>
	</div>
	<h2 class="text-xl font-bold text-center">
		{JSON.stringify(overfill)}
	</h2>
	<h2 class="text-lg font-bold text-center">
		Total overfill: {sum(overfill)}cm
	</h2>
	<!-- <h2 class="text-xl font-bold text-center">
		Matches: {JSON.stringify(rowMatchingSiblings)}
	</h2>
	<h2 class="text-lg font-bold text-center">
		Total matching rows: {filter(rowMatchingSiblings).length}
	</h2> -->
	<div>
		<div class="h-full flex justify-center scale-125 scale-x-150">
			<div class="m-auto relative scale-150">
				{#each fittedFloor as floorRow, i (JSON.stringify(fittedFloor[i]))}
					<FloorboardRow
						{boardWidthStr}
						floorRowIndex={i}
						position={{
							x: boardWidthFloat * i - WHOLE_ROOM_CENTER_OFFSET.x,
							y: -WHOLE_ROOM_CENTER_OFFSET.y
						}}
						rowLength={floorRow.capacity}
						floorboards={floorRow.floorboards}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
		height: 100%;
	}
	:global(body) {
		height: 100%;
	}
</style>
