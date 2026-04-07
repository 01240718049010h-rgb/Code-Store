import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { MochilaProvider } from './context/MochilaContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MochilaProvider>
          <AppRouter />
        </MochilaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;