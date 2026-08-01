import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Today } from './ui/Today';
import { Tree } from './ui/Tree';
import { Progress } from './ui/Progress';
import { Settings } from './ui/Settings';
import { Calibrate } from './ui/Calibrate';
import { load, save } from './storage';
import type { PlayerState } from './engine/types';

type Tab = 'today' | 'tree' | 'progress' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Bugün' },
  { id: 'tree', label: 'Ağaç' },
  { id: 'progress', label: 'İlerleme' },
  { id: 'settings', label: 'Ayarlar' },
];

function App() {
  const [state, setState] = useState<PlayerState>(() => load());
  const [tab, setTab] = useState<Tab>('today');

  // İlk açılış: boş bir kayıt dosyası oyun değil. Önce ölç. (D-053)
  if (!state.calibrated && state.logs.length === 0) {
    return (
      <Calibrate state={state} onDone={(s) => { save(s); setState(s); }} />
    );
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 62 }}>
      {tab === 'today' && <Today state={state} onState={setState} />}
      {tab === 'tree' && <Tree state={state} />}
      {tab === 'progress' && <Progress state={state} />}
      {tab === 'settings' && <Settings state={state} onState={setState} />}

      <nav style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, height: 56,
        display: 'flex', borderTop: '1px solid var(--line)',
        background: '#0b0d12ee', backdropFilter: 'blur(8px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: 'transparent', border: 'none',
            color: tab === t.id ? '#f5c542' : '#8b93a5',
            fontSize: 12.5, fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

// Çevrimdışı çalışma — parkta / salonda internet olmayabilir
//
// Yeni sürüm devralınca sayfa BİR KEZ yenilenir. Bu olmadan kullanıcı
// güncellemeyi ancak ikinci açılışta görürdü; v1'de hiç göremedi. (D-054)
if ('serviceWorker' in navigator) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL('sw.js', document.baseURI).href)
      .then((reg) => { reg.update().catch(() => {}); })
      .catch(() => { /* sessizce geç */ });
  });
}
