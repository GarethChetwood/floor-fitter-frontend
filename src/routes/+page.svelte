<script>
	import FloorboardRow from '../components/FloorboardRow.svelte';
	import { createFloorboards, fitFloorboards } from '../lib/index';
	import {
		roomWidthStr,
		roomLengthStr,
		boardWidthStr,
		WHOLE_ROOM_CENTER_OFFSET
	} from '../constants';

	const floorboards = createFloorboards();

	const boardWidthFloat = parseFloat(boardWidthStr);

	const fittedFloor = fitFloorboards(floorboards, roomWidthStr, roomLengthStr, boardWidthStr);

	// console.log("FitFloor!", fittedFloor);
</script>

<h1 class="text-3xl font-bold text-center">Floor fitter frontend</h1>
<div class="h-full flex justify-center scale-125 scale-x-150">
	<div class="m-auto relative scale-150">
		{#each fittedFloor as floorRow, i}
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

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
		height: 100%;
	}
	:global(body) {
		height: 100%;
	}
</style>
