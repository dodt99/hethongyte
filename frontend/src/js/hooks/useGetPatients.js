import { useQuery } from 'react-query';
import { api } from '../helpers/axios';

const useGetPatients = ({
  limit, offset, keyword, sortBy, sortType, gender,
}) => useQuery(
  ['patients', {
    keyword, limit, offset, gender, sortBy, sortType,
  }],
  async () => {
    const res = await api.get('/patients', {
      params: {
        limit, offset, keyword, sortBy, sortType, gender,
      },
    });
    return res.data;
  },
);

export default useGetPatients;
