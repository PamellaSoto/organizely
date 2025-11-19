import LogoDesktop from '/desktop_logo.png';
import LogoMobile from '/mobile_logo.png';

import { HiOutlineDotsVertical, HiOutlineQuestionMarkCircle, HiOutlineCog } from "react-icons/hi";

const Header = () => {
  return (
    <header className='flex flex-row items-center justify-between mb-4'>
      <a href="https://github.com/PamellaSoto/organizely" target='_blank'>
        <img className='hidden md:block' src={LogoDesktop} alt="Organizely - organize sua semana, simplifique sua vida." />
        <img className='md:hidden' src={LogoMobile} alt="Organizely - organize sua semana, simplifique sua vida." />
      </a>
      <div className='md:hidden'>
        <button>
          <HiOutlineDotsVertical size={30}/> 
        </button>
      </div>
      <div className='hidden md:flex flex-col gap-3 items-end'>
        <p className='text-sm'>Feito com 💜 por <a className='hover:underline' href="https://github.com/PamellaSoto" target='_blank'>Pamella Soto</a></p>
        <div className='flex gap-8'>
          <button className="menu-button">
            {/* TODO: abre um carrossel com artes explicando as funcionalidades do app */}
            <HiOutlineQuestionMarkCircle size={24}/> Ajuda
          </button>
          <button className="menu-button">
            {/* abre um modal dedicado a customização, organização e perfil do usuario*/}
            <HiOutlineCog size={24}/> Configurações
          </button>
        </div>
      </div>
  </header>
  )
}
export default Header;