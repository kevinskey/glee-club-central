
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import './App.css';

function App() {
  return (
    <>
      <Toaster position="top-right" closeButton />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
