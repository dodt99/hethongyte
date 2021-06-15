import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useMyAppointments = (params) => useQuery(['my-appointments', params], async () => {
  const res = await api.get('/my-appointments');
  return res.data;
}, {
  staleTime: 3000000,
});

export default useMyAppointments;
