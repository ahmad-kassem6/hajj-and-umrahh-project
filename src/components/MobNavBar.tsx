import * as React from 'react'
import { Link } from 'react-router-dom'
import logoColor from '../assets/ICT.svg'
import BurgerMenu from './BurgerMenu'

interface MobNavBarProps {
  isMenuOpen: boolean
  toggleMenu: () => void
  menuItems: { label: string; to: string }[]
}

const MobNavBar: React.FC<MobNavBarProps> = ({
  isMenuOpen,
  toggleMenu,
  menuItems,
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-1 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex-1">
        <BurgerMenu
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          menuItems={menuItems}
        />
      </div>

      <div className="flex-1 flex justify-center">
        <Link to="/" className="block">
          <img src={logoColor} alt="Logo" className="w-16 h-16 object-contain" />
        </Link>
      </div>

      <div className="flex-1"></div>
    </div>
  )
}

export default MobNavBar
