import React from 'react'
import ReactDOM from 'react-dom/client'
import { AdminModal } from './App.jsx'
import { content, LANG_KEY } from './content.js'
import './index.css'

const lang = (() => {
  try { return localStorage.getItem(LANG_KEY) || 'tr' } catch { return 'tr' }
})()
const t = content[lang] || content.tr

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="adminpage">
      <AdminModal t={t.admin} ui={t.ui} orderT={t.order} onClose={() => { window.location.href = '/' }} />
    </div>
  </React.StrictMode>,
)
