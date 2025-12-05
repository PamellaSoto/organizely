import { HiOutlinePlus, HiOutlineRefresh, HiOutlineClock, HiOutlineFolderAdd, HiOutlineFolder } from "react-icons/hi";

const MenuActions = ({ createTaskMethod, clearPendingMethod, pomodoroMethod, onOpenArchive, backgroundColor }) => {
  return (
    <div className='flex justify-between py-2 sticky top-0' style={{ backgroundColor }}>
      <div className='flex gap-8'>
        <button className="menu-button" onClick={createTaskMethod}>
          <HiOutlinePlus size={18}/>
          Adicionar nova tarefa
        </button>
        <button className="menu-button" onClick={clearPendingMethod}>
          <HiOutlineRefresh size={18}/>
          Limpar tarefas pendentes
        </button>
      </div>
      <div className='flex gap-8'>
        <button className="menu-button" onClick={pomodoroMethod}>
          <HiOutlineClock size={18}/>
          Pomodoro Timer
        </button>
        <button className="menu-button">
          <HiOutlineFolderAdd size={18}/>
          Arquivar tarefas marcadas como feitas
        </button>
        <button className="menu-button" onClick={onOpenArchive}>
          <HiOutlineFolder size={18}/>
          Tarefas arquivadas (0)
        </button>
      </div>
    </div>
  )
}

export default MenuActions;