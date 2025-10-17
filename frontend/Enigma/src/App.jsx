import { useState } from 'react'
import Navbar from './components/Navbar'
import MainComponent from './components/MainComponent'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-white text-blue-900 flex flex-col min-h-screen">
        <Navbar />
        <MainComponent />
      </div>
    </>
  )
}

export default App
