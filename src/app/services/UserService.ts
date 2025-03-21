// src/services/UserService.ts
"use client";

import { User } from "@/types/user"; // Importe a interface User
import { BaseApi } from "./baseAPI";

const API = new BaseApi();

export class UserService {
  async createUser(user: User): Promise<User | undefined> {
    return await API.post<User>("/users", user);
  }

  // Outros métodos relacionados a usuários podem ser adicionados aqui
  // Exemplo:
  // async getUser(id: number): Promise<User | undefined> {
  //   return await API.get<User>(`/users/${id}`);
  // }
}