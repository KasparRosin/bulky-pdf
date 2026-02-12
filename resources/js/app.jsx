import './bootstrap';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const rootEl = document.getElementById('app');
const userId = parseInt(rootEl.dataset.userId);

createRoot(rootEl).render(<App userId={userId} />);
