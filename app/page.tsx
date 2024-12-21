import Appbar from "./components/Appbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Link from "next/link";
export default function Home() {
  return (
      <main>
      <Appbar/>
      <ToastContainer />
      </main> 
  );
}
