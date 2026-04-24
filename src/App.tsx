import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import i18n from '@/i18n';
import { AppRouter } from '@/router/AppRouter';

function App() {
  const language = useAppSelector((s) => s.settings.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  return <AppRouter />;
}

export default App;
