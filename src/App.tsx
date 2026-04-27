import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';
import i18n from '@/i18n';
import { AppRouter } from '@/router/AppRouter';

function App() {
  const language = useAppSelector((s) => s.settings.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{ duration: 4000 }}
        containerStyle={{ top: 16, right: 16 }}
      />
    </>
  );
}

export default App;
