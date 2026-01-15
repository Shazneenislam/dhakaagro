// components/Sidebar/Sidebar.js
import React, { useState } from "react";
import {
  LayoutGrid,
  Monitor,
  Cpu,
  Camera,
  Watch,
  Headphones,
  Bluetooth,
  Cloud,
  Plug,
  ShieldCheck,
  Server,
  HardDrive,
  LampDesk,
  X,
  ChevronLeft,
} from "lucide-react";

const sidebarIcons = [
  { Icon: LayoutGrid, label: "Dashboard" },
  { Icon: Monitor, label: "Monitors" },
  { Icon: Cpu, label: "Processors" },
  { Icon: Camera, label: "Cameras" },
  { Icon: Watch, label: "Watches" },
  { Icon: Headphones, label: "Headphones" },
  { Icon: Bluetooth, label: "Bluetooth" },
  { Icon: Cloud, label: "Cloud" },
  { Icon: Plug, label: "Power" },
  { Icon: ShieldCheck, label: "Security" },
  { Icon: Server, label: "Servers" },
  { Icon: HardDrive, label: "Storage" },
  { Icon: LampDesk, label: "Lighting" },
];

const Sidebar = ({ isOpen, onClose, expanded = true, onToggleExpand }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed min-h-full inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Full Height Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-white border-r border-[#d8dee4]
          shadow-lg
          z-50 transition-all duration-300 ease-in-out
          flex flex-col
          ${expanded ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Section - Toggle & Close */}
        <div className="flex justify-between items-center p-4 border-b border-[#d8dee4] h-16 shrink-0">
          {/* Logo when expanded */}
          {expanded && (
            <div className="flex items-center">
              <img
                src="/Logo.png"
                alt="Dhaka Agro"
                className="h-12 w-[250px] object-contain"
              />
            </div>
          )}
          
          {/* Collapsed logo */}
          {!expanded && (
            <img
              src="/Logo2.png"
              alt="Dhaka Agro"
              className="h-12 w-[250px] object-contain"
            />
          )}
          
          <div className="flex items-center gap-2">
            {/* Desktop Toggle Button */}
            <button
              onClick={onToggleExpand}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-[#425A8B]
                hover:bg-[#F2F4F7]
                transition
                hidden lg:flex
              "
              title={expanded ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronLeft 
                size={20} 
                className={`transition-transform ${expanded ? "" : "rotate-180"}`}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-[#425A8B]
                hover:bg-[#F2F4F7]
                transition
                lg:hidden
              "
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation - Scrollable with thin scrollbar */}
        <div className={`
          flex-1 overflow-y-auto py-4 sidebar-scroll
          ${!expanded ? 'overflow-y-visible' : ''}
        `}>
          <div className="space-y-1 px-2">
            {sidebarIcons.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  // Only close on mobile, not on desktop
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`
                  w-full
                  flex items-center
                  rounded-lg
                  py-3 px-3
                  transition-all duration-200
                  group
                  relative
                  ${activeIndex === index 
                    ? "bg-[#425A8B] text-white shadow-sm" 
                    : "text-[#425A8B] hover:bg-[#F2F4F7] hover:shadow-sm"
                  }
                  ${!expanded ? 'justify-center' : ''}
                `}
              >
                <div className={`
                  flex items-center justify-center
                  ${expanded ? 'w-8' : 'w-full'}
                  ${activeIndex === index ? 'text-white' : 'text-[#425A8B]'}
                `}>
                  <item.Icon size={20} />
                </div>
                
                {expanded && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!expanded && (
                  <div className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-2
                    px-2 py-1.5
                    bg-gray-800 text-white text-xs rounded
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    pointer-events-none
                    z-50
                    whitespace-nowrap
                    shadow-lg
                    before:content-[''] before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2
                    before:border-t-[5px] before:border-b-[5px] before:border-r-[5px]
                    before:border-t-transparent before:border-b-transparent before:border-r-gray-800
                  ">
                    {item.label}
                  </div>
                )}
                
                {/* Active indicator for collapsed state */}
                {!expanded && activeIndex === index && (
                  <div className="
                    absolute -right-1 top-1/2 -translate-y-1/2
                    w-1 h-6
                    bg-[#425A8B]
                    rounded-l
                  " />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section - User Profile - Removed as requested */}
      </aside>

      {/* Inline styles for thin scrollbar */}
      <style jsx>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
          margin: 4px 0;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* When sidebar is collapsed, hide scrollbar and show all items */
        .w-16 .sidebar-scroll {
          overflow-y: visible !important;
          scrollbar-width: none;
        }
        
        .w-16 .sidebar-scroll::-webkit-scrollbar {
          display: none !important;
        }
        
        /* Adjust spacing for collapsed state */
        .w-16 .sidebar-scroll > div {
          padding-bottom: 1rem; /* Add some bottom padding */
        }
      `}</style>
    </>
  );
};

export default Sidebar;