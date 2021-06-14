import React, { useCallback, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, CircularProgress, Grid,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import genderEnum from '../../enums/gender';
import { formatDate } from '../../helpers/date';
import useGetEmployees from '../../hooks/useGetEmployees';
import AddEmployee from './AddEmployee';
import FilterEmployee from './FilterEmployee';
import userStatus from '../../../../../backend/app/enums/userStatus';

const EmployeeList = () => {
  const [keyword, setKeyword] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const {
    watch, setValue, control, register,
  } = useForm({ mode: 'onChange' });

  const { gender } = watch();

  const resetFilter = useCallback(() => {
    setKeyword(null);
    setValue('keyword', null);
    setValue('gender', null);
  }, [setValue]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, isLoading, error } = useGetEmployees({
    keyword: keyword || null,
    limit: rowsPerPage,
    offset: rowsPerPage * page,
    gender,
  });

  const Header = (
    <TableHead>
      <TableRow>
        <TableCell size="medium" align="left">ID</TableCell>
        <TableCell size="medium" align="left">Code</TableCell>
        <TableCell size="medium" align="left">Họ tên</TableCell>
        <TableCell size="medium" align="left">Giới tính</TableCell>
        <TableCell size="medium" align="left">Vị trí</TableCell>
        <TableCell size="medium" align="left">Email</TableCell>
        <TableCell size="medium" align="left">Số ĐT</TableCell>
        <TableCell size="medium" align="left">Địa chỉ</TableCell>
        <TableCell size="medium" align="left">Trình độ</TableCell>
        <TableCell size="medium" align="left">Kinh nghiệm</TableCell>
        <TableCell size="medium" align="left">Ngày vào</TableCell>
        <TableCell size="medium" align="left">Ngày rời</TableCell>
        <TableCell size="medium" align="left">Trạng thái</TableCell>
        <TableCell size="medium" align="left">Ghi chú</TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <Grid container spacing={1} direction="column">
      <Grid item container justify="space-between">
        <Grid item xs>
          <FilterEmployee
            register={register}
            control={control}
            resetFilter={resetFilter}
            setKeyword={setKeyword}
          />
        </Grid>

        <Grid item>
          <AddEmployee />
        </Grid>
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            {Header}

            <TableBody>
              {isLoading && <CircularProgress />}

              {error && <span>Some thing went wrong</span>}

              {data && data.employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell size="medium" align="left">{employee.id}</TableCell>
                  <TableCell size="medium" align="left">{employee.code}</TableCell>
                  <TableCell size="medium" align="left">{employee.name}</TableCell>
                  <TableCell size="medium" align="left">{genderEnum.getTitle(employee.gender)}</TableCell>
                  <TableCell size="medium" align="left">{employee.position.name}</TableCell>
                  <TableCell size="medium" align="left">{employee.email}</TableCell>
                  <TableCell size="medium" align="left">{employee.tel || ''}</TableCell>
                  <TableCell size="medium" align="left">{employee.address || ''}</TableCell>
                  <TableCell size="medium" align="left">{employee.qualification || ''}</TableCell>
                  <TableCell size="medium" align="left">{employee.experience || ''}</TableCell>
                  <TableCell size="medium" align="left">{employee.from_at ? formatDate(employee.from_at) : ''}</TableCell>
                  <TableCell size="medium" align="left">{employee.to_at ? formatDate(employee.to_at) : ''}</TableCell>
                  <TableCell size="medium" align="left">{userStatus.getTitle(employee.status)}</TableCell>
                  <TableCell size="medium" align="left">{employee.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data && (
            <TablePagination
              page={page}
              count={data.total}
              rowsPerPage={rowsPerPage}
              component="div"
              onChangeRowsPerPage={handleChangeRowsPerPage}
              onChangePage={(e, newPage) => setPage(newPage)}
            />
          )}
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default EmployeeList;
