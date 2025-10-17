import React from 'react'

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-10 py-4 md:py-5 bg-gray-900 border-b border-gray-700 shadow-md">
        <div className="font-bold text-2xl text-white flex items-center">
            <img 
            src="/Blocksoc logo.jpeg"
            alt="Blocksoc Logo"
            className="h-12 w-auto"
            />
        </div>
        <div className='absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.25)]' style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <div>ATMOS ENIGMA</div>
        </div>
        <div className='flex items-center gap-4'>
            <button className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors cursor-pointer">
                i
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-bold border border-gray-600 transition-colors cursor-pointer">
                USER
            </button>
        </div>  

    </div>
  )
}

export default Navbar

