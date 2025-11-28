import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Gift, TrendingUp, Store, ArrowRight, Zap, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Screen } from '../App';

interface CashbackScreenProps {
  navigateTo: (screen: Screen) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  cashbackBalance: number;
  withdrawCashback: () => void;
}

const partners = [
  { id: 1, name: 'Amazon', cashback: '5%', category: 'E-commerce', color: 'bg-orange-500' },
  { id: 2, name: 'iFood', cashback: '8%', category: 'Delivery', color: 'bg-red-500' },
  { id: 3, name: 'Uber', cashback: '3%', category: 'Transporte', color: 'bg-black' },
  { id: 4, name: 'Netshoes', cashback: '10%', category: 'Esportes', color: 'bg-purple-600' },
  { id: 5, name: 'Magazine Luiza', cashback: '6%', category: 'Varejo', color: 'bg-blue-600' },
  { id: 6, name: 'Rappi', cashback: '7%', category: 'Delivery', color: 'bg-orange-600' },
];

const recentCashback = [
  { store: 'iFood', value: 12.50, date: '25/11/2024', status: 'Creditado' },
  { store: 'Amazon', value: 8.75, date: '20/11/2024', status: 'Creditado' },
  { store: 'Uber', value: 4.20, date: '18/11/2024', status: 'Pendente' },
];

export function CashbackScreen({ navigateTo, darkMode, toggleDarkMode, cashbackBalance, withdrawCashback }: CashbackScreenProps) {
  const totalCashback = cashbackBalance;
  const monthCashback = 45.45;

  // F006: Resgatar Cashback
  const handleWithdraw = () => {
    if (totalCashback <= 0) {
      toast.error('Você não tem cashback disponível para resgatar');
      return;
    }
    withdrawCashback();
    toast.success(`Cashback de R$ ${totalCashback.toFixed(2)} transferido para sua conta principal!`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-black text-white'} p-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateTo('home')}
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>Cashback</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={toggleDarkMode}
            className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* F005: Visualizar Saldo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-red-600 to-red-800 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <p className="text-sm opacity-90">Cashback Total (F005)</p>
            </div>
            <p className="text-3xl">R$ {totalCashback.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm opacity-75 mt-2">Disponível para usar</p>
          </Card>

          <Card className={`p-6 border-l-4 border-l-red-600 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Este mês</p>
            </div>
            <p className={`text-3xl ${darkMode ? 'text-white' : 'text-black'}`}>R$ {monthCashback.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-green-600 mt-2">+25% vs mês anterior</p>
          </Card>
        </div>

        {/* F006: Resgatar Cashback */}
        <Card className={`p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={darkMode ? 'text-white' : 'text-black'}>Resgate Rápido (F006)</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfira seu cashback para a conta</p>
              </div>
            </div>
            <Button 
              onClick={handleWithdraw}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Resgatar
            </Button>
          </div>
        </Card>

        {/* F007: Ofertas de Cashback */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={darkMode ? 'text-white' : 'text-black'}>Lojas parceiras (F007)</h2>
            <Button variant="ghost" size="sm" className="text-red-600">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <Card key={partner.id} className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${partner.color} rounded-lg flex items-center justify-center text-white`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {partner.cashback}
                  </div>
                </div>
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-1`}>{partner.name}</h3>
                <p className="text-sm text-gray-500">{partner.category}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Cashback */}
        <div>
          <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Histórico de cashback</h2>
          <Card className={`divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : ''}`}>
            {recentCashback.map((item, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className={darkMode ? 'text-white' : 'text-black'}>{item.store}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">+ R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-xs ${
                      item.status === 'Creditado' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* How it Works */}
        <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Como funciona?</h3>
          <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <p>Compre em lojas parceiras usando seu cartão RedBank</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <p>Receba uma porcentagem de volta em cashback</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <p>Use seu cashback para pagar contas ou transferir para sua conta</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}