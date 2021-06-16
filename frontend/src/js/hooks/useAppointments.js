import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useAppointments = (params) => useQuery(['appointments', params], async () => {
  const res = await api.get('/appointments', { params });
  return res.data;
}, {
  staleTime: 3000000,
});

export default useAppointments;
