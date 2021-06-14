import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useGetEmployees = ({
  limit, offset, keyword, gender,
}) => useQuery(
  ['employees', {
    keyword, limit, offset, gender,
  }],
  async () => {
    const res = await api.get('/employees', {
      params: {
        limit, offset, keyword, gender,
      },
    });
    return res.data;
  },
);

export default useGetEmployees;
