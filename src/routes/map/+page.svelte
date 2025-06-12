<script>
  import '../../style.css';
  import MapTile from './MapTile.svelte';
  import { supabase } from '$lib/supabase';

  const rows = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let pins = [];

  // 初期読み込み
  supabase.from('pins').select('*').then(({ data }) => {
    pins = data;
  });

  async function handleAddPin({ tileId, x, y }) {
    const memo = prompt('メモを入力してください:');
    const color = prompt('ピンの色 (例: red, green, blue, #ffcc00):', 'deepskyblue');
    if (memo !== null) {
      const { data, error } = await supabase
        .from('pins')
        .insert({ tile_id: tileId, x, y, memo, color })
        .select();
      if (!error) pins = [...pins, ...data];
    }
  }

  async function handleDeletePin(id) {
    if (confirm('このピンを削除しますか？')) {
      await supabase.from('pins').delete().eq('id', id);
      pins = pins.filter(p => p.id !== id);
    }
  }

  async function handleEditPin(pin) {
    const newMemo = prompt('メモを変更してください:', pin.memo);
    if (newMemo !== null) {
      const { data, error } = await supabase
        .from('pins')
        .update({ memo: newMemo })
        .eq('id', pin.id)
        .select();
      if (!error) {
        pins = pins.map(p => p.id === pin.id ? { ...p, memo: newMemo } : p);
      }
    }
  }
</script>

<h2>🐾 DDマップ</h2>

<div class="dd-map">
  {#each rows as row}
    <div class="dd-row">
      {#each cols as col}
        <MapTile
          tileId={`${row}${col}`}
          {pins}
          on:addPin={handleAddPin}
          on:deletePin={e => handleDeletePin(e.detail)}
          on:editPin={e => handleEditPin(e.detail)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .dd-map {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .dd-row {
    display: flex;
    gap: 2px;
  }
</style>
