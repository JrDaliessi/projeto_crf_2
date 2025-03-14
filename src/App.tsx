import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';
import TestPage from './pages/TestPage';
import StyleDemo from './pages/StyleDemo';
import SimpleStyleDemo from './pages/SimpleStyleDemo';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/style-demo" element={<StyleDemo />} />
          <Route path="/simple-demo" element={<SimpleStyleDemo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App; 