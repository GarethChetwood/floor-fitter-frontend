<script>
	let browseInput;
	let data;
	let files;

	export let setFileData;

	$: {
		if (files && files[0]) {
			let binfile = files[0];
			let reader = new FileReader();
			reader.onload = function (evt) {
				console.log('File chosen! Decoding...');
				data = new Uint8Array(evt.target.result);
				data = new TextDecoder().decode(data);
				setFileData(data);
				data = null;
				files = null;
			};
			reader.readAsArrayBuffer(binfile);
		}
	}
</script>

<main>
	<input bind:this={browseInput} type="file" id="fileinput" class="hidden" bind:files />
	<button class="btn" on:click={() => browseInput.click()}>Load</button>
</main>
