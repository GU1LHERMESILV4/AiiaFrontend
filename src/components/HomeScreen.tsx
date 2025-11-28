import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Eye, 
  EyeOff, 
  Receipt, 
  Smartphone, 
  Gift, 
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Moon,
  Sun,
  Mic,
  MicOff
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';
import type { Screen, Transaction } from '../App';

interface HomeScreenProps {
  navigateTo: (screen: Screen) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  balance: number;
  cashbackBalance: number;
  transactions: Transaction[];
}

export function HomeScreen({ navigateTo, onLogout, darkMode, toggleDarkMode, balance, cashbackBalance, transactions }: HomeScreenProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    window.speechSynthesis.cancel(); // Cancela qualquer fala anterior
    window.speechSynthesis.speak(utterance);
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('saldo')) {
      const saldoTexto = balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      speak(`Seu saldo é de ${saldoTexto} reais`);
      toast.info('Falando saldo...');
    } else if (lowerCommand.includes('pix') || lowerCommand.includes('enviar pix')) {
      speak('Abrindo tela de PIX');
      navigateTo('pix');
    } else if (lowerCommand.includes('extrato') || lowerCommand.includes('ver extrato')) {
      speak('Abrindo extrato');
      navigateTo('statement');
    } else if (lowerCommand.includes('recarga') || lowerCommand.includes('fazer recarga')) {
      speak('Abrindo recarga');
      navigateTo('recharge');
    } else if (lowerCommand.includes('cashback') || lowerCommand.includes('ver cashback')) {
      speak('Abrindo cashback');
      navigateTo('cashback');
    } else if (lowerCommand.includes('início') || lowerCommand.includes('home') || lowerCommand.includes('voltar')) {
      speak('Você já está na tela inicial');
    } else {
      speak('Comando não reconhecido. Tente dizer: ver extrato, enviar PIX, fazer recarga ou ver cashback');
      toast.error('Comando não reconhecido');
    }
  };

  const toggleVoiceMode = async () => {
    if (!voiceMode) {
      // Verificar permissão de microfone primeiro
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Parar o stream imediatamente
      } catch (error) {
        toast.error('Permissão de microfone necessária', {
          description: 'Clique no ícone de cadeado na barra de endereço e permita o acesso ao microfone',
          duration: 6000,
        });
        return;
      }

      // Ativar reconhecimento de voz
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error('Seu navegador não suporta reconhecimento de voz', {
          description: 'Use o Google Chrome para melhor compatibilidade'
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceMode(true);
        toast.success('Comando de voz ativado!', {
          description: 'Diga: "Ver extrato", "Enviar PIX", "Fazer recarga" ou "Saldo"',
          duration: 4000,
        });
        speak('Comando de voz ativado');
      };

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript;
        console.log('Comando reconhecido:', command);
        toast.info(`Você disse: "${command}"`);
        processVoiceCommand(command);
      };

      recognition.onerror = (event: any) => {
        console.error('Erro no reconhecimento:', event.error);
        if (event.error === 'not-allowed' || event.error === 'not-allowed-error') {
          toast.error('Permissão de microfone negada', {
            description: 'Clique no ícone de cadeado na barra de endereço e permita o acesso ao microfone',
            duration: 6000,
          });
          setVoiceMode(false);
          if (recognitionRef.current) {
            recognitionRef.current = null;
          }
        } else if (event.error === 'no-speech') {
          console.log('Nenhuma fala detectada');
        } else if (event.error === 'audio-capture') {
          toast.error('Microfone não encontrado', {
            description: 'Verifique se seu microfone está conectado',
            duration: 5000,
          });
          setVoiceMode(false);
          if (recognitionRef.current) {
            recognitionRef.current = null;
          }
        }
      };

      recognition.onend = () => {
        if (voiceMode && recognitionRef.current) {
          try {
            recognition.start(); // Reiniciar automaticamente
          } catch (e) {
            console.error('Erro ao reiniciar reconhecimento:', e);
          }
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        toast.error('Erro ao iniciar reconhecimento de voz', {
          description: 'Tente novamente',
        });
        console.error('Erro ao iniciar:', error);
      }
    } else {
      // Desativar reconhecimento de voz
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      window.speechSynthesis.cancel();
      toast.info('Comando de voz desativado');
      setVoiceMode(false);
    }
  };

  useEffect(() => {
    return () => {
      // Limpar ao desmontar o componente
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-black text-white'} p-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span>RC</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Olá,</p>
              <p>Ricardo Cavalcanti</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={toggleVoiceMode}
              className={`${darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'} ${voiceMode ? 'bg-red-600' : ''}`}
              title="Comando de Voz (F016)"
            >
              {voiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button 
              variant="ghost" 
              onClick={toggleDarkMode}
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
              title="Alternar Tema (F017)"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" onClick={onLogout} className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Balance Card - F015 Dashboard Personalizado */}
        <Card className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm opacity-90">Saldo disponível</span>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-4xl mb-2">
            {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
          </div>
          <div className="text-sm opacity-90 mb-6">
            Cashback disponível: {showBalance ? `R$ ${cashbackBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Transferir
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Depositar
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className={darkMode ? 'text-white mb-4' : 'text-black mb-4'}>Acesso rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
              onClick={() => navigateTo('pix')}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <p className={darkMode ? 'text-white' : 'text-black'}>Pix</p>
            </Card>

            <Card 
              className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
              onClick={() => navigateTo('statement')}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 text-red-600" />
              </div>
              <p className={darkMode ? 'text-white' : 'text-black'}>Extrato</p>
            </Card>

            <Card 
              className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
              onClick={() => navigateTo('recharge')}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6 text-red-600" />
              </div>
              <p className={darkMode ? 'text-white' : 'text-black'}>Recarga</p>
            </Card>

            <Card 
              className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
              onClick={() => navigateTo('cashback')}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Gift className="w-6 h-6 text-red-600" />
              </div>
              <p className={darkMode ? 'text-white' : 'text-black'}>Cashback</p>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className={darkMode ? 'text-white mb-4' : 'text-black mb-4'}>Últimas transações</h2>
          <Card className={`divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : ''}`}>
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.value > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.value > 0 ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className={darkMode ? 'text-white' : 'text-black'}>{transaction.name}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className={transaction.value > 0 ? 'text-green-600' : 'text-red-600'}>
                  {transaction.value > 0 ? '+' : ''}R$ {Math.abs(transaction.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}