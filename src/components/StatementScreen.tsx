import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Download, Filter, ArrowUpRight, ArrowDownRight, Search, Edit2, Moon, Sun, PieChart } from 'lucide-react';
import type { Screen, Transaction } from '../App';

interface StatementScreenProps {
  navigateTo: (screen: Screen) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const categories = ['Todas', 'Alimentação', 'Transporte', 'Entretenimento', 'Saúde', 'Salário', 'Transferência', 'Cashback', 'PIX'];

export function StatementScreen({ navigateTo, darkMode, toggleDarkMode, transactions, setTransactions }: StatementScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // F013: Busca e Filtro
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.value.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalIncome = filteredTransactions.filter(t => t.value > 0).reduce((sum, t) => sum + t.value, 0);
  const totalExpense = filteredTransactions.filter(t => t.value < 0).reduce((sum, t) => sum + t.value, 0);

  // F014: Edição de Categoria
  const handleEditCategory = (id: number, category: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, category } : t
    ));
    setEditingId(null);
    setNewCategory('');
  };

  // F012: Visualização Gráfica - Calcular gastos por categoria
  const categoryTotals = filteredTransactions
    .filter(t => t.value < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.value);
      return acc;
    }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

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
            <h1>Extrato</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
              onClick={() => setShowChart(!showChart)}
            >
              <PieChart className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={toggleDarkMode}
              className={darkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Summary Cards - F011 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={`p-6 border-l-4 border-l-green-600 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Total de Entradas</p>
            <p className="text-2xl text-green-600">+ R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </Card>
          <Card className={`p-6 border-l-4 border-l-red-600 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Total de Saídas</p>
            <p className="text-2xl text-red-600">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </Card>
        </div>

        {/* F012: Visualização Gráfica */}
        {showChart && (
          <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Gastos por Categoria (F012)</h2>
            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([category, amount]) => {
                const percentage = (amount / totalSpent) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category}</span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        R$ {amount.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className={`w-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* F013: Busca e Filtro */}
        {showFilters && (
          <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Filtros (F013)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className={darkMode ? 'text-gray-300' : ''}>Buscar transação</Label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <Input
                    id="search"
                    placeholder="Nome ou valor..."
                    className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className={darkMode ? 'text-gray-300' : ''}>Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* Transactions List - F011 Extrato Detalhado */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <div className={`p-4 border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
            <h2 className={darkMode ? 'text-white' : 'text-black'}>Novembro 2024</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredTransactions.length} transações encontradas
            </p>
          </div>
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : ''}`}>
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={`p-4 hover:bg-${darkMode ? 'gray-700' : 'gray-50'} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.value > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.value > 0 ? (
                        <ArrowDownRight className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={darkMode ? 'text-white' : 'text-black'}>{transaction.name}</p>
                      
                      {/* F014: Edição de Categoria */}
                      {editingId === transaction.id ? (
                        <div className="flex gap-2 mt-1">
                          <Select value={newCategory || transaction.category} onValueChange={setNewCategory}>
                            <SelectTrigger className={`h-8 text-xs ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : ''}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                              {categories.filter(c => c !== 'Todas').map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            className="h-8 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleEditCategory(transaction.id, newCategory || transaction.category)}
                          >
                            Salvar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                          <button
                            onClick={() => {
                              setEditingId(transaction.id);
                              setNewCategory(transaction.category);
                            }}
                            className="text-gray-400 hover:text-red-600"
                            title="Editar categoria (F014)"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400">{transaction.date} às {transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={transaction.value > 0 ? 'text-green-600' : 'text-red-600'}>
                      {transaction.value > 0 ? '+' : ''}R$ {Math.abs(transaction.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}