import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TaskGrid from './components/TaskGrid'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex flex-col min-h-screen bg-gray-100 p-2 gap-4">
      <header>
        <h1>Organize.ly</h1>
      </header>
      <main className="flex-1 overflow-hidden">  
        <TaskGrid></TaskGrid>
      </main>
    </div>
  </StrictMode>,
)
