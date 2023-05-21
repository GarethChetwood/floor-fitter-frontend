<script lang="js">
	import sample from 'lodash/sample';
	import flatten from 'lodash/flatten';

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

	const fromClass = `from-${sample(['amber-950', 'yellow-950', 'orange-950'])}`;
	const toClass = `to-${sample(['amber-700', 'yellow-700', 'orange-700'])}`;

	const finalClass = `border border-stone-700 hover:border-0 ring-blue-500 hover:ring-2 hover:z-10 hover:scale-125 bg-gradient-to-tr ${fromClass} ${toClass} absolute`;
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
