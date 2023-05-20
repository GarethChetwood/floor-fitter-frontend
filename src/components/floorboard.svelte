<script lang="js">
    import sample from "lodash/sample";
    import flatten from "lodash/flatten";

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

    const boardWidthPixels = `${boardWidth}px`;
    const boardLengthPixels = `${boardLength}px`;
    const positionXPixels = `${position.x}px`;
    const positionYPixels = `${position.y}px`;
    // const positionPixels = `translate(${position.x}px, ${position.y}px)`;

    const fromClass = `from-${sample(["amber-950", "yellow-950", "orange-950"])}`;
    const toClass = `to-${sample(["amber-700", "yellow-700", "orange-700"])}`;
    
</script>

<div class={`border border-gray-500 hover:border-indigo-500 hover:scale-125 bg-gradient-to-tr ${fromClass} ${toClass}`} style:width={boardWidthPixels} style:height={boardLengthPixels} style:left={positionXPixels} style:top={positionYPixels} />

<style>
</style>