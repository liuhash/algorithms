import {BrowserRouter,Routes,Route,Link} from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/Login";

function App() {
  return (
      <BrowserRouter>
          <div>
              <Link to='/login'>登录</Link>
              <Link to='/home'>首页</Link>
                <Routes>
                    <Route path='/home' element={<Layout/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                </Routes>
          </div>
      </BrowserRouter>

  );
}

export default App;
