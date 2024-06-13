 


const clienteAxios = axios.create({
  baseURL: "http://localhost",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
export default clienteAxios;
