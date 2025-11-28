import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { StatementScreen } from './components/StatementScreen';
import { PixScreen } from './components/PixScreen';
import { RechargeScreen } from './components/RechargeScreen';
import { CashbackScreen } from './components/CashbackScreen';

export type Screen = 'login' | 'home' | 'statement' | 'pix' | 'recharge' | 'cashback';

export interface Transaction {
  id: number;
  name: string;
  value: number;
  date: string;
  time: string;
  category: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, name: 'Supermercado Extra', value: -234.50, date: '27/11/2024', time: '14:32', category: 'Alimentação' },
  { id: 2, name: 'Transferência recebida', value: 500.00, date: '26/11/2024', time: '10:15', category: 'Transferência' },
  { id: 3, name: 'Salário', value: 5000.00, date: '25/11/2024', time: '08:00', category: 'Salário' },
  { id: 4, name: 'Netflix', value: -49.90, date: '24/11/2024', time: '12:00', category: 'Entretenimento' },
  { id: 5, name: 'Uber', value: -32.40, date: '23/11/2024', time: '19:45', category: 'Transporte' },
  { id: 6, name: 'Restaurante', value: -89.00, date: '22/11/2024', time: '20:30', category: 'Alimentação' },
  { id: 7, name: 'Farmácia', value: -67.80, date: '21/11/2024', time: '16:20', category: 'Saúde' },
  { id: 8, name: 'Cashback recebido', value: 15.50, date: '20/11/2024', time: '09:00', category: 'Cashback' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [balance, setBalance] = useState(12543.87);
  const [cashbackBalance, setCashbackBalance] = useState(156.78);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const navigateTo = (screen: Screen) => {
    if (isLoggedIn) {
      setCurrentScreen(screen);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTransaction = (name: string, value: number, category: string) => {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newTransaction: Transaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      name,
      value,
      date,
      time,
      category
    };
    
    setTransactions([newTransaction, ...transactions]);
    setBalance(balance + value);
  };

  const withdrawCashback = () => {
    if (cashbackBalance > 0) {
      addTransaction('Resgate de cashback', cashbackBalance, 'Cashback');
      setCashbackBalance(0);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {currentScreen === 'home' && (
          <HomeScreen 
            navigateTo={navigateTo} 
            onLogout={handleLogout} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            balance={balance}
            cashbackBalance={cashbackBalance}
            transactions={transactions}
          />
        )}
        {currentScreen === 'statement' && (
          <StatementScreen 
            navigateTo={navigateTo} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}
        {currentScreen === 'pix' && (
          <PixScreen 
            navigateTo={navigateTo} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            addTransaction={addTransaction}
            balance={balance}
          />
        )}
        {currentScreen === 'recharge' && (
          <RechargeScreen 
            navigateTo={navigateTo} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            addTransaction={addTransaction}
          />
        )}
        {currentScreen === 'cashback' && (
          <CashbackScreen 
            navigateTo={navigateTo} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            cashbackBalance={cashbackBalance}
            withdrawCashback={withdrawCashback}
          />
        )}
      </div>
    </>
  );
}