import LogoDesktop from "/desktop_logo.png";
import LogoMobile from "/mobile_logo.png";

import {
  HiOutlineDotsVertical,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";

const Header = ({ onOpenConfig, backgroundColor }) => {
  return (
    <header className="flex flex-row items-center justify-between border-b border-gray-900/10 p-3 fixed top-0 right-0 w-full z-3" style={{ backgroundColor }}>
      <a href="https://github.com/PamellaSoto/organizely" target="_blank">
        <img
          className="hidden md:block h-16"
          src={LogoDesktop}
          alt="Organizely - organize sua semana, simplifique sua vida."
        />
        <img
          className="md:hidden h-10"
          src={LogoMobile}
          alt="Organizely - organize sua semana, simplifique sua vida."
        />
      </a>
      <div className="md:hidden">
        <button>
          <HiOutlineDotsVertical size={30} />
        </button>
      </div>
      <div className="hidden md:flex flex-col items-end gap-3">
        <p className="text-sm">
          Feito com 💜 por{" "}
          <a
            className="hover:underline"
            href="https://github.com/PamellaSoto"
            target="_blank"
          >
            Pamella Soto
          </a>
        </p>
        <div className="flex gap-8">
          <a
            className="menu-button"
            href="https://github.com/PamellaSoto/organizely/blob/main/README.md#how-to-use"
            target="_blank"
          >
            <HiOutlineQuestionMarkCircle size={24} /> Ajuda
          </a>
          <button onClick={onOpenConfig} className="menu-button">
            <HiOutlineCog size={24} /> Configurações
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
