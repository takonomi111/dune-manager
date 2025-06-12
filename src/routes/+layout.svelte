<script>
  import '../style.css'; // パスは必要に応じて変更
</script>

<svelte:head>
  <title>DUNE Manager</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="flex min-h-screen bg-gray-900 text-white">
  <!-- サイドバー -->
  <nav class="w-48 bg-gray-800 p-4 space-y-4">
    <a href="/" class="block px-2 py-1 rounded hover:bg-gray-700">📦 素材管理</a>
    <a href="/map" class="block px-2 py-1 rounded hover:bg-gray-700">🗺 DDマップ</a>
  </nav>

  <!-- メイン画面 -->
  <main class="flex-1 p-6 bg-gray-900">
    <slot />
  </main>
</div>
