// "use client";
export class BaseApi {
  public isExpired = false;
  private baseAPI = 'http://localhost:8080/api';

  async get<T>(rota: string, body = {}): Promise<T | undefined> {

    try {
      const res = await fetch(`${this.baseAPI}${rota}`, {
        headers: {
          Accept: 'application/json, text/plain',
          'Accept-Language': 'pt-BR',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      });

      if (res == undefined)
        console.log('Erro inesperado, entre em contato com o suporte!');

      return requestBody<T>(res, this);
    } catch (e) {
      console.log(e);
    }
  }

  async post<T>(rota: string, body = {}): Promise<T | undefined> {
    debugger
    try {
      const res = await fetch(`${this.baseAPI}${rota}`, {
        headers: {
          Accept: 'application/json, text/plain',
          'Accept-Language': 'pt-BR',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(body),
        method: 'POST',
      });

      if (res == undefined)
        console.log('Erro inesperado, entre em contato com o suporte!');

      return requestBody<T>(res);
    } catch (e) {
      console.log(e);
    }
  }

  async put<T>(rota: string, body = {}): Promise<T | undefined> {
    try {
      const res = await fetch(`${this.baseAPI}${rota}`, {
        headers: {
          Accept: 'application/json, text/plain',
          'Accept-Language': 'pt-BR',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(body),
        method: 'PUT',
      });

      if (res == undefined)
        console.log('Erro inesperado, entre em contato com o suporte!');

      return requestBody<T>(res);
    } catch (e) {
      console.log(e);
    }
  }

  async delete<T>(rota: string, body = {}): Promise<T | undefined> {
    try {
      const res = await fetch(`${this.baseAPI}${rota}`, {
        headers: {
          Accept: 'application/json, text/plain',
          'Accept-Language': 'pt-BR',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(body),
        method: 'DELETE',
      });

      if (res == undefined)
        console.log('Erro inesperado, entre em contato com o suporte!');

      return requestBody<T>(res);
    } catch (e) {
      console.log(e);
    }
  }
}

export async function requestBody<T>(
  res: Response,
  baseIn?: BaseApi,
): Promise<T | undefined> {
  if (res.ok) return (await res.json()) as T;
  else if (res.status == 403) {
    if (baseIn) baseIn.isExpired = true;
    console.log('Sessão expirada, faça login novamente.');
  }
}