import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TaskGrid from './components/TaskGrid'

import { HiOutlineDotsVertical } from "react-icons/hi";
import { HiOutlineQuestionMarkCircle, HiOutlineCog } from "react-icons/hi";
import { HiOutlinePlus, HiOutlineRefresh, HiOutlineClock, HiOutlineFolderAdd, HiOutlineFolder } from "react-icons/hi";
import LogoDesktop from '/desktop_logo.png';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex flex-col min-h-screen bg-gray-200 px-3 pt-3 pb-10 gap-4">      
      {/* Header Mobile */}
      <header className='flex items-center justify-between mb-4 md:hidden'>
        <img src={LogoDesktop} alt="Organizely - organize sua semana, simplifique sua vida." />
        <HiOutlineDotsVertical size={24}/>
      </header>
      
      {/* Header Desktop */}
      <header className='hidden items-center justify-between mb-4 md:flex'>
        <img src={LogoDesktop} alt="Organizely - organize sua semana, simplifique sua vida." />
        <div className='flex flex-col gap-3 items-end'>
          <p className='text-sm'>Feito com 💜 por <a className='hover:underline' href="https://github.com/PamellaSoto" target='_blank'>Pamella Soto</a></p>
          <div className='flex gap-8'>
            <button className="menu-button">
              <HiOutlineQuestionMarkCircle size={24}/> Ajuda
            </button>
            <button className="menu-button">
              <HiOutlineCog size={24}/> Configurações
            </button>
          </div>
        </div>
        
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">  
        {/* Actions menu bar */}
        <div className='flex justify-between mb-4'>
          <div className='flex gap-8'>
            <button className="menu-button">
              <HiOutlinePlus size={20}/>
              Adicionar nova tarefa</button>
            <button className="menu-button">
              <HiOutlineRefresh size={20}/>
              Limpar tarefas pendentes
            </button>
          </div>
          <div className='flex gap-8'>
            <button className="menu-button">
              <HiOutlineClock size={20}/>
              Pomodoro Timer
            </button>
            <button className="menu-button">
              <HiOutlineFolderAdd size={20}/>
              Arquivar tarefas marcadas como feitas
            </button>
            <button className="menu-button">
              <HiOutlineFolder size={20}/>
              Tarefas arquivadas (0)
            </button>
          </div>
        </div>
        {/* Tasks Layout */}
        <TaskGrid></TaskGrid>
      </main>
    </div>
  </StrictMode>,
)
