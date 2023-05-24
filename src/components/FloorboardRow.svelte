<script lang="js">
	import noop from 'lodash/noop';
	import Floorboard from './Floorboard.svelte';
	import { WHOLE_ROOM_CENTER_OFFSET } from '../constants';

	/**
	 * @type {string}
	 */
	export let boardWidthStr;
	/**
	 * @type {string}
	 */
	export let rowLength;

	/**
	 * @type {object}
	 */
	export let position;
	export let floorRowIndex;
	export let floorboards;
	export let isOverCapacity;
	export let hasConsecs;
	export let matchesAdjacent;
	export let matchingBoards;
	export let markSwapRow;
	export let isMarkedForSwap;

	const boardWidthPixels = `${boardWidthStr}px`;
	const rowLengthPixels = `${rowLength}px`;
	const floorboardsWithPositions = floorboards.reduce(
		(priorFloorboards, currentFloorboard) => [
			...priorFloorboards,
			{
				offset: priorFloorboards.reduce(
					(allLengths, floorboard) => allLengths + floorboard.length,
					0
				),
				length: currentFloorboard.length,
				lengthGroup: currentFloorboard.lengthGroup
			}
		],
		[]
	);
	const positionXPixels = `${position.x}px`;
	const positionYPixels = `${position.y}px`;
</script>

<div
	class={`border border-gray-500 ${isMarkedForSwap && 'grayscale'} absolute`}
	style:width={boardWidthPixels}
	style:height={rowLengthPixels}
	style:left={positionXPixels}
	style:top={positionYPixels}
>
	<div
		class="m-auto text-xs text-white relative text-center"
		style:transform="translate(0, -15px)"
		on:click={markSwapRow}
		on:keydown={noop}
	>
		{floorRowIndex}
	</div>
	{#if hasConsecs}
		<div
			class="m-auto text-xs text-white absolute text-center"
			style:transform="translate(0, -38px)"
		>
			⚠
		</div>
	{/if}
	{#if matchesAdjacent}
		<div
			class="m-auto text-xs text-white absolute text-center"
			style:transform="translate(0, -48px)"
		>
			🤼
		</div>
	{/if}

	{#each floorboardsWithPositions as floorboard, i}
		<Floorboard
			boardWidth={boardWidthStr}
			boardLength={floorboard.length}
			position={{
				x: positionXPixels,
				y: position.y + floorboard.offset + WHOLE_ROOM_CENTER_OFFSET.y
			}}
			isMatchingAdjacent={matchingBoards.includes(i)}
			isOverhang={i === floorboardsWithPositions.length - 1 && isOverCapacity}
			boardGroup={floorboard.lengthGroup}
		/>
	{/each}
</div>
