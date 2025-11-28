import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock } from 'lucide-react';
import logo from 'figma:asset/eb32992d026a1d8aa16ed8f87957c2e4cf093d7f.png';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logo} alt="PogBank Logo" className="w-40 h-40 object-contain" />
          </div>
          <h1 className="text-white text-3xl mb-2"></h1>
          <p className="text-gray-400">Seu banco digital completo</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Lock className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button className="text-red-600 hover:underline text-sm">
              Esqueci minha senha
            </button>
            <div className="text-sm text-gray-600">
              Não tem conta?{' '}
              <button className="text-red-600 hover:underline">
                Abra sua conta grátis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
