<script lang="ts">
  import { onMount } from 'svelte';

  let name = "";
  let category = "";
  let owned = 0;
  let required = 0;
  let deadline = "";
  let search = "";
  let selectedCategory = "";
  let sortKey = "name";

  type Material = {
    name: string;
    category: string;
    owned: number;
    required: number;
    deadline?: string;
    editing?: boolean;
  };

  let materials: Material[] = [];

  onMount(() => {
    const saved = localStorage.getItem("materials");
    if (saved) {
      materials = JSON.parse(saved);
    }
  });

  function saveToLocal() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("materials", JSON.stringify(materials));
    }
  }

  function addMaterial() {
    if (name.trim() && category.trim()) {
      materials = [
        ...materials,
        { name, category, owned: owned || 0, required: required || 0, deadline },
      ];
      name = "";
      category = "";
      owned = 0;
      required = 0;
      deadline = "";
      saveToLocal();
    }
  }

  function deleteMaterial(index: number) {
    materials = materials.filter((_, i) => i !== index);
    saveToLocal();
  }

  function editMaterial(index: number) {
    materials[index].editing = true;
  }

  function saveEdit(index: number) {
    materials[index].editing = false;
    saveToLocal();
  }

  function getStatusColor(material: Material) {
    return material.owned >= material.required
      ? "bg-green-100"
      : "bg-red-100";
  }

  function daysLeft(dateStr: string) {
    const today = new Date();
    const deadline = new Date(dateStr);
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  $: filteredMaterials = materials.filter((m) => {
    const matchesCategory = !selectedCategory || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  $: sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "category") return a.category.localeCompare(b.category);
    if (sortKey === "lack") return (b.required - b.owned) - (a.required - a.owned);
    return 0;
  });

  $: categories = [...new Set(materials.map((m) => m.category))];
  $: totalRequired = materials.reduce((sum, m) => sum + m.required, 0);
  $: totalOwned = materials.reduce((sum, m) => sum + m.owned, 0);
  $: progressRate = totalRequired > 0 ? Math.floor((totalOwned / totalRequired) * 100) : 0;
</script>

<main class="p-8 max-w-3xl mx-auto space-y-6">
  <h1 class="text-2xl font-bold">📦 素材管理</h1>

  <!-- 進行状況サマリー -->
  <div class="bg-gray-100 p-4 rounded">
    <h2 class="font-bold mb-2">📊 進行状況サマリー</h2>
    <p>必要合計: {totalRequired} / 所持合計: {totalOwned}</p>
    <p>進捗率: {progressRate}%</p>
  </div>

  <!-- 素材登録フォーム -->
  <div class="space-y-2">
    <input bind:value={name} placeholder="素材名" class="w-full border p-2 rounded" />
    <input bind:value={category} placeholder="カテゴリ（例：PvP装備）" class="w-full border p-2 rounded" />
    <div class="flex space-x-2">
      <input type="number" bind:value={owned} placeholder="所持数" class="flex-1 border p-2 rounded" />
      <input type="number" bind:value={required} placeholder="必要数" class="flex-1 border p-2 rounded" />
    </div>
    <input type="date" bind:value={deadline} class="w-full border p-2 rounded" />
    <button on:click={addMaterial} class="w-full bg-blue-600 text-white px-4 py-2 rounded">登録</button>
  </div>

  <!-- 絞り込み＆並び替え -->
  <div class="flex flex-wrap items-center gap-4">
    <select bind:value={selectedCategory} class="border p-2 rounded">
      <option value="">全カテゴリ</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>

    <input type="text" bind:value={search} placeholder="検索" class="flex-1 border p-2 rounded" />

    <select bind:value={sortKey} class="border p-2 rounded">
      <option value="name">名前順</option>
      <option value="category">カテゴリ順</option>
      <option value="lack">不足数が多い順</option>
    </select>
  </div>

  <!-- 素材リスト -->
  <ul class="space-y-2">
    {#each sortedMaterials as material, index}
      <li class={`border p-3 rounded ${getStatusColor(material)}`}>
        {#if material.editing}
          <div class="space-y-1">
            <input bind:value={material.name} class="border p-1 rounded w-full" />
            <input bind:value={material.category} class="border p-1 rounded w-full" />
            <div class="flex space-x-2">
              <input type="number" bind:value={material.owned} class="w-20 border p-1 rounded" />
              <input type="number" bind:value={material.required} class="w-20 border p-1 rounded" />
            </div>
            <input type="date" bind:value={material.deadline} class="border p-1 rounded w-full" />
            <button on:click={() => saveEdit(index)} class="text-green-600">保存</button>
          </div>
        {:else}
          <div class="flex justify-between items-center">
            <div>
              <strong>{material.name}</strong> [{material.category}]<br />
              {material.owned} / {material.required}
              {#if material.deadline}
                <div class="text-xs text-gray-600">〆切: {material.deadline}（あと {daysLeft(material.deadline)} 日）</div>
              {/if}
            </div>
            <div class="flex flex-col space-y-1 text-right">
              <button on:click={() => editMaterial(index)} class="text-blue-500 hover:underline">編集</button>
              <button on:click={() => deleteMaterial(index)} class="text-red-500 hover:underline">削除</button>
            </div>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</main>
