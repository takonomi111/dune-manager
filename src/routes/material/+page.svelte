<script>
  import '../../style.css';
</script>

<div class="container">
  <!-- 左：フォーム -->
  <div class="form-section">
    <h1>📦 素材管理</h1>
    <div class="summary-box">
      <strong>📊 進行状況サマリー</strong><br />
      必要合計: 0 / 所持合計: 0<br />
      進捗率: 0%
    </div>

    <input type="text" placeholder="素材名" />
    <input type="text" placeholder="カテゴリ (例: PvP装備)" />
    <input type="number" placeholder="必要数" />
    <input type="number" placeholder="所持数" />
    <input type="date" />
    <textarea placeholder="メモを入力"></textarea>
    <select>
      <option>優先度（高・中・低）</option>
    </select>
    <button>登録</button>
  </div>

  <!-- 右：素材表示 -->
  <div class="material-section">
    <input type="text" placeholder="検索" />
    <select>
      <option>全カテゴリ</option>
    </select>
    <select>
      <option>並び順：名前順</option>
      <option>追加順</option>
      <option>締切順</option>
      <option>優先度順</option>
    </select>

    <div class="material-card">
      <h3>アルミ (PvP装備)</h3>
      <p>150 / 300</p>
      <p>〆切: 2025-06-12</p>
      <p>優先度: 高</p>
      <p>メモ: 拠点防衛用</p>
    </div>
  </div>
</div>
