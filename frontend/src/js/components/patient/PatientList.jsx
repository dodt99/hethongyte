import React, { useCallback, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TableSortLabel, TablePagination, CircularProgress, Grid,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import useGetPatients from '../../hooks/useGetPatients';
import FilterPatient from './FilterPatient';
import genderEnum from '../../enums/gender';
import { formatDate } from '../../helpers/date';
import AddPatient from './AddPatient';
import UpdatePatient from './UpdatePatient';

const PatientList = () => {
  const [keyword, setKeyword] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortType, setSortType] = useState('desc');
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

  const { data, isLoading, error } = useGetPatients({
    keyword: keyword || null,
    sortBy,
    sortType,
    limit: rowsPerPage,
    offset: rowsPerPage * page,
    gender,
  });

  const onChangeSort = (column) => {
    setSortBy(column);
    return sortType === 'desc' ? setSortType('asc') : setSortType('desc');
  };

  const Header = (
    <TableHead>
      <TableRow>
        <TableCell size="medium" align="left">
          <TableSortLabel
            active={sortBy === 'id'}
            direction={sortType}
            onClick={() => onChangeSort('id')}
          >
            ID
          </TableSortLabel>
        </TableCell>
        <TableCell size="medium" align="left">
          <TableSortLabel
            active={sortBy === 'name'}
            direction={sortType}
            onClick={() => onChangeSort('name')}
          >
            Name
          </TableSortLabel>
        </TableCell>
        <TableCell size="medium" align="left">Gender</TableCell>
        <TableCell size="medium" align="left">Birthday</TableCell>
        <TableCell size="medium" align="left">Telephone</TableCell>
        <TableCell size="medium" align="left">Address</TableCell>
        <TableCell size="medium" align="left">Created At</TableCell>
        <TableCell size="medium" align="left">Note</TableCell>
        <TableCell size="medium" align="left" />
      </TableRow>
    </TableHead>
  );

  return (
    <Grid container spacing={1} direction="column">
      <Grid item container justify="space-between">
        <Grid item xs>
          <FilterPatient
            register={register}
            control={control}
            resetFilter={resetFilter}
            setKeyword={setKeyword}
          />
        </Grid>

        <Grid item>
          <AddPatient />
        </Grid>
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            {Header}

            <TableBody>
              {isLoading && <CircularProgress />}

              {error && <span>Some thing went wrong</span>}

              {data && data.patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell size="medium" align="left">{patient.id}</TableCell>
                  <TableCell size="medium" align="left">{patient.name}</TableCell>
                  <TableCell size="medium" align="left">{genderEnum.getTitle(patient.gender)}</TableCell>
                  <TableCell size="medium" align="left">{patient.birthday && formatDate(patient.birthday)}</TableCell>
                  <TableCell size="medium" align="left">{patient.tel}</TableCell>
                  <TableCell size="medium" align="left">{patient.address}</TableCell>
                  <TableCell size="medium" align="left">{formatDate(patient.created_at)}</TableCell>
                  <TableCell size="medium" align="left">{patient.note}</TableCell>
                  <TableCell size="medium" align="center">
                    <UpdatePatient patient={patient} />
                  </TableCell>
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

export default PatientList;