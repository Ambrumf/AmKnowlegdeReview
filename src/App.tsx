import { RouterProvider } from 'react-router-dom';
import { KnowledgeProvider } from './context/KnowledgeContext';
import { router } from './router';

/** 应用根组件 */
function App() {
  return (
    <KnowledgeProvider>
      <RouterProvider router={router} />
    </KnowledgeProvider>
  );
}

export default App;
