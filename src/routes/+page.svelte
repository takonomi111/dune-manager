<script>
  import '../style.css';

  let materials = [];
  let name = '';
  let category = '';
  let required = 0;
  let owned = 0;
  let deadline = '';
  let memo = '';
  let priority = '中';

  let filter = '';
  let sortKey = '名前順';
  let editingIndex = -1;

  function register() {
    const item = {
      name,
      category,
      required: Number(required),
      owned: Number(owned),
      deadline,
      memo,
      priority,
      createdAt: new Date().toISOString()
    };

    if (editingIndex >= 0) {
      materials[editingIndex] = item;
      editingIndex = -1;
    } else {
      materials.push(item);
    }

    name = category = memo = '';
    required = owned = 0;
    deadline = '';
    priority = '中';
  }

  function edit(index) {
    const m = materials[index];
    name = m.name;
    category = m.category;
    required = m.required;
    owned = m.owned;
    deadline = m.deadline;
    memo = m.memo;
    priority = m.priority;
    editingIndex = index;
  }

  function remove(index) {
    materials.splice(index, 1);
  }

  $: filtered = materials.filter(m => m.name.includes(filter) || m.category.includes(filter));
  $: sorted = [...filtered].sort((a, b) => {
    if (sortKey === '名前順') return a.name.localeCompare(b.name);
    if (sortKey === '締切順') return new Date(a.deadline) - new Date(b.deadline);
    if (sortKey === '追加順') return new Date(a.createdAt) - new Date(b.createdAt);
  });

  $: totalRequired = materials.reduce((sum, m) => sum + m.required, 0);
  $: totalOwned = materials.reduce((sum, m) => sum + m.owned, 0);
  $: progress = totalRequired > 0 ? Math.floor((totalOwned / totalRequired) * 100) : 0;
</script>

<div class="container">
  <div class="form-section">
    <h1>📦 素材管理</h1>
    <div class="summary-box">
      <strong>📊 進行状況サマリー</strong><br />
      必要合計: {totalRequired} / 所持合計: {totalOwned}<br />
      進捗率: {progress}%
    </div>

    <input type="text" bind:value={name} placeholder="素材名" />
    <input type="text" bind:value={category} placeholder="カテゴリ (例: PvP装備)" />
    <input type="number" bind:value={required} placeholder="必要数" />
    <input type="number" bind:value={owned} placeholder="所持数" />
    <input type="date" bind:value={deadline} />
    <textarea bind:value={memo} placeholder="メモを入力"></textarea>
    <select bind:value={priority}>
      <option>高</option>
      <option>中</option>
      <option>低</option>
    </select>
    <button on:click={register}>{editingIndex >= 0 ? '更新' : '登録'}</button>
  </div>

  <div class="material-section">
    <input type="text" bind:value={filter} placeholder="検索" />
    <select>
      <option>全カテゴリ</option>
    </select>
    <select bind:value={sortKey}>
      <option>名前順</option>
      <option>締切順</option>
      <option>追加順</option>
    </select>

    {#each sorted as m, i}
      <div class="material-card">
        <h3>{m.name} ({m.category})</h3>
        <p>{m.owned} / {m.required}</p>
        <p>〆切: {m.deadline}</p>
        <p>優先度: {m.priority}</p>
        <p>メモ: {m.memo}</p>
        <div class="action-buttons">
          <button on:click={() => edit(i)}>編集</button>
          <button on:click={() => remove(i)}>削除</button>
        </div>
      </div>
    {/each}
  </div>
</div>
