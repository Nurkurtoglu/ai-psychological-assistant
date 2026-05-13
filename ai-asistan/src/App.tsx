import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';

function App() {

  return (
    <Routes>
      {/* 1. Kural: Ana sayfaya ("/") giren kişiye Giriş/Kayıt ekranını göster */}
      <Route path="/" element={<AuthPage />} />

      {/* 2. Kural: "/chat" adresine giden kişiye Sohbet ekranını göster */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/history" element={<HistoryPage />} />
      {/* 3. Kural: Bunlar dışında rastgele bir adrese (örn: "/deneme") gidilirse ana sayfaya geri at */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;