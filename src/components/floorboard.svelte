<script lang="js">
	import sample from 'lodash/sample';
	import { sortedGroups, boardColors } from '../constants';

	/**
	 * @type {string}
	 */
	export let boardWidth;
	/**
	 * @type {string}
	 */
	export let boardLength;

	/**
	 * @type {object}
	 */
	export let position;

	/**
	 * @type {string}
	 */
	export let boardGroup;

	const boardWidthPixels = `${boardWidth}px`;
	const boardLengthPixels = `${boardLength}px`;
	const positionXPixels = `${position.x}px`;
	const positionYPixels = `${position.y}px`;

	const colorIndex = sortedGroups.indexOf(boardGroup);
	const boardColor = boardColors[colorIndex];
	const fromClass = `from-${boardColor}-800`;
	const toClass = `to-${boardColor}-500`;

	const finalClass = `border border-stone-700 hover:border-0 ring-blue-500 hover:ring-2 hover:z-10 hover:scale-125 bg-gradient-to-tr ${fromClass} ${toClass} absolute`;

	// console.log('gradient', finalClass);
</script>

<div
	class={finalClass}
	style:width={boardWidthPixels}
	style:height={boardLengthPixels}
	style:top={positionYPixels}
>
	<div class="h-full flex">
		<div class="m-auto text-xs text-white">
			{boardGroup}
		</div>
	</div>
</div>

<style>
</style>
