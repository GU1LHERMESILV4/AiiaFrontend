import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Smartphone, Check, Calendar, Gamepad2, Ticket, Moon, Sun } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import type { Screen } from '../App';

interface RechargeScreenProps {
  navigateTo: (screen: Screen) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  addTransaction: (name: string, value: number, category: string) => void;
}

const operators = [
  { id: 'vivo', name: 'Vivo', color: 'bg-purple-600' },
  { id: 'claro', name: 'Claro', color: 'bg-red-600' },
  { id: 'tim', name: 'TIM', color: 'bg-blue-600' },
  { id: 'oi', name: 'Oi', color: 'bg-yellow-500' },
];

const rechargeValues = [10, 15, 20, 25, 30, 50, 100];

// F009: Recarga de Serviços
const services = [
  { id: 'bilhete', name: 'Bilhete Único', icon: Ticket, color: 'bg-green-600' },
  { id: 'games', name: 'Jogos', icon: Gamepad2, color: 'bg-purple-600' },
  { id: 'transport', name: 'Transporte', icon: Ticket, color: 'bg-blue-600' },
];

export function RechargeScreen({ navigateTo, darkMode, toggleDarkMode, addTransaction }: RechargeScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [serviceValue, setServiceValue] = useState('');

  // F008: Fazer Recarga de Celular
  const handleMobileRecharge = () => {
    if (!phoneNumber || !selectedOperator || !selectedValue) {
      toast.error('Preencha todos os campos');
      return;
    }

    const operatorName = operators.find(op => op.id === selectedOperator)?.name || selectedOperator;
    addTransaction(`Recarga ${operatorName} - ${phoneNumber}`, -selectedValue, 'Recarga');
    toast.success(`Recarga de R$ ${selectedValue.toFixed(2)} realizada com sucesso!`);
    
    // Limpar formulário
    setPhoneNumber('');
    setSelectedOperator('');
    setSelectedValue(null);
  };

  // F009: Fazer Recarga de Serviço
  const handleServiceRecharge = () => {
    if (!selectedService || !serviceValue) {
      toast.error('Preencha todos os campos');
      return;
    }

    const value = parseFloat(serviceValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    const serviceName = services.find(s => s.id === selectedService)?.name || selectedService;
    addTransaction(`Recarga ${serviceName}`, -value, 'Recarga');
    toast.success(`Recarga de R$ ${value.toFixed(2)} realizada com sucesso!`);
    
    // Limpar formulário
    setSelectedService('');
    setServiceValue('');
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
            <h1>Recarga</h1>
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
        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile">Celular</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>

          {/* F008: Recarga de Celular */}
          <TabsContent value="mobile" className="space-y-6">
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Dados da recarga (F008)</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className={darkMode ? 'text-gray-300' : ''}>Número do celular</Label>
                  <div className="relative">
                    <Smartphone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Operator Selection */}
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Operadora</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {operators.map((operator) => (
                      <button
                        key={operator.id}
                        onClick={() => setSelectedOperator(operator.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedOperator === operator.id
                            ? 'border-red-600 bg-red-50'
                            : darkMode 
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 ${operator.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white`}>
                          {operator.name.charAt(0)}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-black'} text-center`}>{operator.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recharge Values */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Escolha o valor</h2>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {rechargeValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedValue(value)}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      selectedValue === value
                        ? 'border-red-600 bg-red-50'
                        : darkMode
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedValue === value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>R$ {value}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* F010: Recarga Recorrente */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`${darkMode ? 'text-white' : 'text-black'}`}>Recarga Recorrente (F010)</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agendar recarga automática mensal</p>
                </div>
                <button
                  onClick={() => setRecurringEnabled(!recurringEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    recurringEnabled ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    recurringEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {recurringEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="recurringDay" className={darkMode ? 'text-gray-300' : ''}>Dia da recarga</Label>
                  <Input
                    id="recurringDay"
                    type="number"
                    placeholder="Dia do mês (1-31)"
                    min="1"
                    max="31"
                    className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
              )}
            </Card>

            {/* Recent Recharges */}
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>Recargas recentes</p>
              <Card className={`divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : ''}`}>
                {[
                  { phone: '(11) 98765-4321', operator: 'Vivo', value: 20, date: '25/11/2024' },
                  { phone: '(11) 91234-5678', operator: 'Claro', value: 30, date: '18/11/2024' },
                ].map((recharge, index) => (
                  <div key={index} className={`p-4 hover:bg-${darkMode ? 'gray-700' : 'gray-50'} cursor-pointer transition-colors`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className={darkMode ? 'text-white' : 'text-black'}>{recharge.phone}</p>
                          <p className="text-sm text-gray-500">{recharge.operator} • {recharge.date}</p>
                        </div>
                      </div>
                      <p className={darkMode ? 'text-white' : 'text-black'}>R$ {recharge.value}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleMobileRecharge}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={!phoneNumber || !selectedOperator || !selectedValue}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {recurringEnabled ? 'Agendar Recarga Recorrente' : 'Fazer Recarga'}
            </Button>
          </TabsContent>

          {/* F009: Recarga de Serviços */}
          <TabsContent value="services" className="space-y-6">
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Recarga de Serviços (F009)</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-300' : ''}>Selecione o serviço</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedService === service.id
                            ? 'border-red-600 bg-red-50'
                            : darkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center text-white`}>
                            <service.icon className="w-6 h-6" />
                          </div>
                          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>{service.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedService && (
                  <div className="space-y-2">
                    <Label htmlFor="serviceValue" className={darkMode ? 'text-gray-300' : ''}>Valor da recarga</Label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>R$</span>
                      <Input
                        id="serviceValue"
                        type="number"
                        placeholder="0,00"
                        className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        value={serviceValue}
                        onChange={(e) => setServiceValue(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Button 
              onClick={handleServiceRecharge}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={!selectedService || !serviceValue}
            >
              Fazer Recarga de Serviço
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}