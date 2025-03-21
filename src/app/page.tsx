"use client"

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { User } from '@/types/user';
import { UserService } from './services/UserService';

const UserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
        message.success('User created successfully!');
        form.resetFields();
      } else {
        message.error('Error creating user.');
      }
    } catch (error: any) {
      message.error(`Error creating user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateZipCode = async (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter your Zip Code!');
    }
    if (value.length !== 8) {
      return Promise.reject('Zip Code must have 8 digits');
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
      const data = await response.json();
      if (data.erro) {
        return Promise.reject('Invalid Zip Code!');
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('Error validating Zip Code!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Create User</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email format' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }, { min: 8, message: 'Password must be at least 8 characters' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Zip Code"
            name="zipCode"
            rules={[{ required: true, message: 'Please enter your Zip Code!' }, { validator: validateZipCode }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;