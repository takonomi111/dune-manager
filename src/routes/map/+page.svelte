<script>
  import '../../style.css';
  import MapTile from './MapTile.svelte';
  import { supabase } from '$lib/supabase';

  const rows = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let pins = [];

  // 初回読み込み
  supabase.from('pins').select('*').then(({ data, error }) => {
    if (!error) pins = data;
    else console.error(error);
  });

  // ピン追加
 async function handleAddPin({ tileId, x, y }) {
  const memo = prompt('メモを入力してください:');
  const color = prompt('ピンの色を選んでください:', 'deepskyblue');

  if (memo && color) {
   const { data, error } = await supabase
  .from('pins')
  .insert([
    {
      tile_id: tileId,
      x: parseInt(x),
      y: parseInt(y),
      memo,
      color
    }
  ])
  .select();

    if (error) {
      console.error('Insert Error:', error);
    } else {
      pins = [...pins, ...data];
    }
  }
}

  // ピン削除
  async function handleDeletePin(id) {
    if (confirm('このピンを削除しますか？')) {
      const { error } = await supabase.from('pins').delete().eq('id', id);
      if (!error) {
        pins = pins.filter(p => p.id !== id);
      } else {
        console.error(error);
      }
    }
  }

  // ピン編集
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
      } else {
        console.error(error);
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
