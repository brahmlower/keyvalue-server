import axios from "axios";

export function putKeyValueItem(name: string, value: any, contentType: string): Promise<any> {
  const options = {
    headers: {
      'Content-Type': contentType
    }
  }
  return axios.put(`/keys/${name}`, value, options);
}

export function getKeyValueItem(name: string) {
  return axios.get(`/keys/${name}`);
}

export function getKeyValueItems() {
  return axios.get('/keys');
}

export function deleteKeyValueItem(name: string) {
  return axios.delete(`/keys/${name}`);
}
