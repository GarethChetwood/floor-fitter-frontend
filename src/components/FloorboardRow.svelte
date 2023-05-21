<script lang="js">
    import Floorboard from "./Floorboard.svelte";
    import sample from "lodash/sample";
    import flatten from "lodash/flatten";
    import { WHOLE_ROOM_CENTER_OFFSET } from "../constants";

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

    export let floorboards;

    const boardWidthPixels = `${boardWidthStr}px`;
    const rowLengthPixels = `${rowLength}px`;
    const floorboardsWithPositions = floorboards.reduce(
        (priorFloorboards, currentFloorboard) => [...priorFloorboards, {
            offset: priorFloorboards.reduce((allLengths, floorboard) => allLengths + floorboard.length, 0),
            length: currentFloorboard.length,
            lengthGroup: currentFloorboard.lengthGroup
        }], []);
        const positionXPixels = `${position.x}px`;
        const positionYPixels = `${position.y}px`;

        // console.log(floorboardsWithPositions);

</script>

<div class="border border-gray-500 absolute" style:width={boardWidthPixels} style:height={rowLengthPixels} style:left={positionXPixels} style:top={positionYPixels}>
    {#each floorboardsWithPositions as floorboard}
        <Floorboard boardWidth={boardWidthStr} boardLength={floorboard.length} position={{ x: positionXPixels, y: position.y + floorboard.offset + WHOLE_ROOM_CENTER_OFFSET.y }} boardGroup={floorboard.lengthGroup} />
    {/each}
</div>
