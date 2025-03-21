"use client";

import { User } from "@/types/user";
import { BaseApi } from "./baseAPI";

const API = new BaseApi();

export class UserService {
  async createUser(user: User): Promise<User | undefined> {
    return await API.post<User>("/users", user);
  }
}