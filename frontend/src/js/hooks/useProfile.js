import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useProfile = (userId) => useQuery(['profile', userId], async () => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
}, {
  staleTime: 3000000,
});

export default useProfile;
