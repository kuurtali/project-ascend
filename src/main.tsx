import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Today } from './ui/Today';
import { Tree } from './ui/Tree';
import { load } from './storage';
import type { PlayerState } from './engine/types';

type Tab = 'today' | 'tree';

function App() {
  const [state, setState] = useState<PlayerState>(() => load());
  const [tab, setTab] = useState<Tab>('today');

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 64 }}>
      {tab === 'today'
        ? <Today state={state} onState={setState} />
        : <Tree state={state} />}

      <nav style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, height: 58,
        display: 'flex', borderTop: '1px solid var(--line)',
        background: '#0b0d12ee', backdropFilter: 'blur(8px)',
      }}>
        {(['today', 'tree'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: 'transparent', border: 'none',
            color: tab === t ? '#f5c542' : '#8b93a5',
            fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer',
          }}>
            {t === 'today' ? 'Bugün' : 'Ağaç'}
          </button>
        ))}
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
