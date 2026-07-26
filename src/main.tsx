import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Today } from './ui/Today';
import { load } from './storage';
import type { PlayerState } from './engine/types';

function App() {
  const [state, setState] = useState<PlayerState>(() => load());
  return <Today state={state} onState={setState} />;
}

createRoot(document.getElementById('root')!).render(<App />);
