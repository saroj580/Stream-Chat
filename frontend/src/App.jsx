import { Route, Routes } from "react-router"
import HomePage from './pages/HomePage.jsx';
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import  { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";

const App = () => {

  //fetch the single api with huge ugly code 
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // useEffect(() => {
  //   const getData = async () =>  {
  //     setIsLoading(true);
  //     try {
  //       const data = await fetch('https://jsonplaceholder.typicode.com/todos')
  //       const json = await data.json();
  //       setData(json)
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   getData();
  // },[])
  // console.log(data);

  //to make make more clean we use the TanStack react query
  

  return (
    <div className=''>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
