"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { User } from '@/types/user';
import { UserService } from './services/UserService';
import toast, { Toaster } from 'react-hot-toast';
import { MoonOutlined, SunOutlined } from '@ant-design/icons'; // Ícones do Ant Design

const UserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Estado para controlar o tema
  const userService = new UserService();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const newUser: User = {
        name: values.name,
        email: values.email,
        password: values.password,
        zipCode: values.zipCode,
      };

      const createdUser = await userService.createUser(newUser);

      if (createdUser) {
        toast.success('Usuário criado com sucesso!');
        form.resetFields();
      } else {
        toast.error('Erro ao criar usuário, email de usuário já existente.');
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao criar usuário.';
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateZipCode = async (_: any, value: string) => {
    if (value.length !== 8) {
      return Promise.reject('O CEP deve ter 8 dígitos');
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
      const data = await response.json();
      if (data.erro) {
        return Promise.reject('CEP inválido!');
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('Erro ao validar CEP!');
    }
  };

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-lg shadow-lg w-full max-w-md transition-colors duration-300`}>

        <div className="flex justify-end mb-4">
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            className={`${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`}
          />
        </div>

        <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Criar Usuário</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Nome</span>}
            name="name"
            rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
          >
            <Input className={`w-full p-2 rounded ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`} />
          </Form.Item>
          <Form.Item
            label={<span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu email!' },
              { type: 'email', message: 'Formato de email inválido' },
            ]}
          >
            <Input className={`w-full p-2 rounded ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`} />
          </Form.Item>
          <Form.Item
            label={<span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Senha</span>}
            name="password"
            rules={[
              { required: true, message: 'Por favor, insira sua senha!' },
              { min: 8, message: 'A senha deve ter pelo menos 8 caracteres' },
            ]}
          >
            <Input.Password className={`w-full p-2 rounded ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`} />
          </Form.Item>
          <Form.Item
            label={<span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>CEP</span>}
            name="zipCode"
            rules={[
              { required: true, message: 'Por favor, insira seu CEP!' },
              { validator: validateZipCode },
            ]}
          >
            <Input className={`w-full p-2 rounded ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={`w-full py-2 rounded ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-700 hover:bg-blue-800'} text-white font-semibold transition-colors duration-300`}
            >
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          className: theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-white',
        }}
      />
    </div>
  );
};

export default UserForm;