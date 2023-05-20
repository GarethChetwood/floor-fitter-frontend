<script>
  import Floorboard from "../components/floorboard.svelte";
  import { createFloorboards } from "../lib/index";

  const floorboards = createFloorboards();

  const floorboardSize = {
    width: `${12.5 * 2}`,
    length: `${20 * 3}`
  };
</script>

<h1 class="text-3xl font-bold text-center">
  Floor fitter frontend
</h1>
<div class="h-full flex justify-center">
  <div class="m-auto">
    <Floorboard boardWidth={floorboardSize.width} boardLength={floorboardSize.length} position={{ x: "5", y: "10" }} />
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
