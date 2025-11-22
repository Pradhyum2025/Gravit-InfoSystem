// ---------------------------------------------------------------------
// <copyright file="App.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Toaster } from './components/ui/sonner'

function App() {
  return <>
  <Navbar/>
   <Outlet />
  <Footer />
  <Toaster />
  </>
}

export default App
