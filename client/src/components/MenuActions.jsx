import { HiOutlinePlus, HiOutlineRefresh, HiOutlineClock, HiOutlineFolderAdd, HiOutlineFolder } from "react-icons/hi";

const MenuActions = ({createTaskMethod, clearPendingMethod, pomodoroMethod}) => {
  return (
    <div className='flex justify-between mb-4'>
      <div className='flex gap-8'>
        <button className="menu-button" onClick={createTaskMethod}>
          <HiOutlinePlus size={20}/>
          Adicionar nova tarefa</button>
        <button className="menu-button" onClick={clearPendingMethod}>
          <HiOutlineRefresh size={20}/>
          Limpar tarefas pendentes
        </button>
      </div>
      <div className='flex gap-8'>
        <button className="menu-button" onClick={pomodoroMethod}>
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
  )
}

export default MenuActions;