import React from 'react';
import { Menu, Search } from 'lucide-react';

type HeaderProps = {
  onMenuToggle: () => void;
  onSearchToggle: () => void;
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSearchToggle }) => {
  return (
    <header className="px-4 py-3 bg-white shadow-md z-10 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={onMenuToggle}
          className="mr-2" 
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-heading font-bold text-lg text-[#004D7F]">Carlo's Amsterdam Tour</h1>
      </div>
      <div className="flex items-center">
        <button 
          onClick={onSearchToggle}
          className="ml-2" 
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
