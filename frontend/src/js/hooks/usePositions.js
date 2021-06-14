import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const usePositions = () => useQuery('positions', async () => {
  const res = await api.get('/positions');
  return res.data;
}, {
  staleTime: 3000000,
});

export default usePositions;
