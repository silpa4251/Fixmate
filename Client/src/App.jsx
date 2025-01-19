import { Route, Routes } from "react-router-dom"
// import LandingPage from "./page/LandingPage"
import LandingPage from "./page/landingPage"

function App() {


  return (
    <>
      <Routes>
          <Route path="/" element={<LandingPage/>}/>
      </Routes>
    </>
   
  )
}
export default App
