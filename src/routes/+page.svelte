<script lang="ts">
	import sum from "lodash/sum";
	import values from "lodash/values";
	import FloorboardRow from '../components/FloorboardRow.svelte';
	import { FloorboardRow as FloorboardRowClass, createFloorboards, fitFloorboards, countConsecutives, moveConsec } from '../lib/index';
	import {
		roomWidthStr,
		roomLengthStr,
		boardWidthStr,
		WHOLE_ROOM_CENTER_OFFSET
	} from '../constants';

	let consecs = {};
	let floorboards = createFloorboards();
	let fittedFloor:FloorboardRowClass[] = [];

	$: { 
		consecs = countConsecutives(floorboards);
		fittedFloor = fitFloorboards(floorboards, roomWidthStr, roomLengthStr, boardWidthStr);
		console.log("Fitted floor updated!");
	}

	const moveConsecOnClick = () => {
		floorboards = moveConsec(floorboards);
		// fittedFloor = fitFloorboards(roomWidthStr);
		console.log("Floorboards is now: ", floorboards)
	};

	const boardWidthFloat = parseFloat(boardWidthStr);

	// console.log("FitFloor!", fittedFloor);
</script>

<div>
	<h1 class="text-3xl font-bold text-center">Floor fitter frontend</h1>
	<h2 class="text-2xl font-bold text-center">Consecutives:</h2>
	<h2 class="text-xl font-bold text-center">{JSON.stringify(consecs)}</h2>
	<h2 class="text-lg font-bold text-center">Total: {sum(values(consecs))}</h2>
	<button class="btn" on:click={moveConsecOnClick}>Move consec</button>
	<div>
		<div class="h-full flex justify-center scale-125 scale-x-150">
			<div class="m-auto relative scale-150">
				{#each fittedFloor as floorRow, i (JSON.stringify(fittedFloor[i]))}
					<FloorboardRow
						{boardWidthStr}
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
