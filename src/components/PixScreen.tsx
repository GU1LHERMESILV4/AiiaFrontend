import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, QrCode, User, Phone, Mail, Key, Copy, Star, Heart, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Screen } from '../App';

interface PixScreenProps {
  navigateTo: (screen: Screen) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  addTransaction: (name: string, value: number, category: string) => void;
  balance: number;
}

interface Favorite {
  name: string;
  key: string;
  icon: any;
  isFavorite: boolean;
}

export function PixScreen({ navigateTo, darkMode, toggleDarkMode, addTransaction, balance }: PixScreenProps) {
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixCopyPaste, setPixCopyPaste] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const myPixKey = 'ricardo.cavalcanti@email.com';

  // F004: Gerenciar Favoritos
  const [favorites, setFavorites] = useState<Favorite[]>([
    { name: 'Maria Santos', key: 'maria.santos@email.com', icon: Mail, isFavorite: true },
    { name: 'Carlos Oliveira', key: '(11) 98765-4321', icon: Phone, isFavorite: true },
    { name: 'Ana Costa', key: '123.456.789-00', icon: User, isFavorite: false },
  ]);

  const handleCopyPixKey = () => {
    // Fallback para copiar texto sem a Clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = myPixKey;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Chave Pix copiada!');
    } catch (err) {
      alert('Não foi possível copiar a chave Pix');
    }
    document.body.removeChild(textArea);
  };

  const toggleFavorite = (index: number) => {
    const newFavorites = [...favorites];
    newFavorites[index].isFavorite = !newFavorites[index].isFavorite;
    setFavorites(newFavorites);
  };

  // F001: Enviar PIX
  const handleSendPix = () => {
    if (!pixKey || !amount) {
      toast.error('Preencha todos os campos');
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    if (value > balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    // Encontrar o nome do favorito se existir
    const favorite = favorites.find(f => f.key === pixKey);
    const recipientName = favorite ? favorite.name : pixKey;

    addTransaction(`PIX enviado para ${recipientName}`, -value, 'PIX');
    toast.success(`PIX de R$ ${value.toFixed(2)} enviado com sucesso!`);
    setAmount('');
    setPixKey('');
  };

  // F003: PIX Copia e Cola
  const handlePixCopyPaste = () => {
    if (pixCopyPaste) {
      toast.info('Processando código PIX Copia e Cola...');
      // Simulação de processamento
      setTimeout(() => {
        toast.success('Código PIX validado! Preencha o valor.');
      }, 1000);
    }
  };

  // F002: Receber PIX (QR Code)
  const handleGenerateQrCode = () => {
    setShowQrCode(true);
    toast.success('QR Code gerado com sucesso!');
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
            <h1>Pix</h1>
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

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* My Pix Key */}
        <Card className="p-6 bg-gradient-to-br from-red-600 to-red-800 text-white">
          <p className="text-sm opacity-90 mb-2">Minha chave Pix</p>
          <div className="flex items-center justify-between">
            <p className="text-lg">{myPixKey}</p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleCopyPixKey}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Pix Options */}
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Enviar</TabsTrigger>
            <TabsTrigger value="receive">Receber</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            {/* F001: Enviar PIX */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Transferir via Pix</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pixKey" className={darkMode ? 'text-gray-300' : ''}>Chave Pix do destinatário</Label>
                  <Input
                    id="pixKey"
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className={darkMode ? 'text-gray-300' : ''}>Valor</Label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>R$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0,00"
                      className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendPix}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Continuar
                </Button>
              </div>
            </Card>

            {/* F003: PIX Copia e Cola */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>PIX Copia e Cola (F003)</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="copyPaste" className={darkMode ? 'text-gray-300' : ''}>Cole o código PIX</Label>
                  <Input
                    id="copyPaste"
                    placeholder="Cole aqui o código PIX recebido"
                    value={pixCopyPaste}
                    onChange={(e) => setPixCopyPaste(e.target.value)}
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                <Button 
                  onClick={handlePixCopyPaste}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={!pixCopyPaste}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Processar Código
                </Button>
              </div>
            </Card>

            {/* Quick Options */}
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>Ou escolha uma opção rápida</p>
              <div className="grid grid-cols-1 gap-3">
                <Card className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-red-600" />
                    </div>
                    <p className={`${darkMode ? 'text-white' : 'text-black'} text-sm`}>Ler QR Code</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* F004: Gerenciar Favoritos */}
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>Favoritos (F004)</p>
              <Card className={`divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : ''}`}>
                {favorites.map((contact, index) => (
                  <div key={index} className={`p-4 hover:bg-${darkMode ? 'gray-700' : 'gray-50'} cursor-pointer transition-colors`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                          <contact.icon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <p className={darkMode ? 'text-white' : 'text-black'}>{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.key}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(index);
                        }}
                      >
                        {contact.isFavorite ? (
                          <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                        ) : (
                          <Heart className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </TabsContent>

          {/* F002: Receber PIX (QR Code) */}
          <TabsContent value="receive" className="space-y-4">
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Receber via Pix (F002)</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="receiveAmount" className={darkMode ? 'text-gray-300' : ''}>Valor (opcional)</Label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>R$</span>
                    <Input
                      id="receiveAmount"
                      type="number"
                      placeholder="0,00"
                      className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deixe em branco para o pagador definir o valor</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateQrCode}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Gerar QR Code Estático
                  </Button>
                  <Button 
                    onClick={handleGenerateQrCode}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                  >
                    Gerar QR Code Dinâmico
                  </Button>
                </div>

                {/* QR Code Preview */}
                <div className={`flex flex-col items-center justify-center py-8 border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}>
                  <div className={`w-48 h-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center mb-4`}>
                    {showQrCode ? (
                      <div className="w-40 h-40 bg-white p-2">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                    ) : (
                      <QrCode className={`w-24 h-24 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                    {showQrCode ? 'QR Code gerado com sucesso!' : 'O QR Code aparecerá aqui após gerar'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}