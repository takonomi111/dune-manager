<script>
  import { createEventDispatcher } from 'svelte';
  export let tileId;
  export let pins = [];
  const dispatch = createEventDispatcher();

  function addPin(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    dispatch('addPin', { tileId, x, y });
  }

  function deletePin(id) {
    dispatch('deletePin', id);
  }

  function editPin(pin) {
    dispatch('editPin', pin);
  }
</script>

<div class="tile" role="button" tabindex="0" on:click={addPin}>
  <div class="tile-label">{tileId}</div>

  {#each pins.filter(p => p.tile_id === tileId) as pin (pin.id)}
    <div
      class="pin"
      style="top: {pin.y}px; left: {pin.x}px; background-color: {pin.color};"
      title={pin.memo}
      on:click|stopPropagation={() => editPin(pin)}
      on:contextmenu|preventDefault|stopPropagation={() => deletePin(pin.id)}
    ></div>
  {/each}
</div>

<style>
  .tile {
    position: relative;
    width: 150px;
    height: 150px;
    background: white;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 12px;
    color: #999;
  }

  .tile-label {
    position: absolute;
    top: 4px;
    left: 4px;
  }

  .pin {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #000;
  }
</style>
