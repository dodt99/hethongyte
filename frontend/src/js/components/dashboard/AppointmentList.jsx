import React, { useCallback, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, CircularProgress, Grid,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import FilterAppointment from './FilterAppointment';
import { api } from '../../helpers/axios';
import { formatLocalHour, localDate } from '../../helpers/date';
import examinationType from '../../enums/examinationType';
import appointmentStatus from '../../enums/appointmentStatus';
import genderEnum from '../../enums/gender';
import AppointmentTools from './AppointmentTools';
import PersonalHealthRecord from './PersonalHealthRecord';

const AppointmentList = () => {
  const [keyword, setKeyword] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    watch, setValue, control, register,
  } = useForm({ mode: 'onChange' });

  const { gender, status } = watch();

  const resetFilter = useCallback(() => {
    setKeyword(null);
    setValue('keyword', null);
    setValue('gender', null);
    setValue('status', null);
  }, [setValue]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, isLoading, error } = useQuery(['appointment-list', {
    keyword: keyword || null,
    limit: rowsPerPage,
    offset: rowsPerPage * page,
    gender,
    status,
  }], async () => {
    const res = await api.get('/appointment-list', {
      params: {
        keyword: keyword || null,
        limit: rowsPerPage,
        offset: rowsPerPage * page,
        gender,
        status,
      },
    });
    return res.data;
  }, {
    staleTime: 3000000,
  });

  const Header = (
    <TableHead>
      <TableRow>
        <TableCell size="medium" align="left">STT</TableCell>
        <TableCell size="medium" align="left">Mã lịch hẹn</TableCell>
        <TableCell size="medium" align="left">Bệnh nhân</TableCell>
        <TableCell size="medium" align="left">Giới tính</TableCell>
        <TableCell size="medium" align="left">Ngày</TableCell>
        <TableCell size="medium" align="left">Giờ hẹn</TableCell>
        <TableCell size="medium" align="left">Nhu cầu</TableCell>
        <TableCell size="medium" align="left">Mô tả</TableCell>
        <TableCell size="medium" align="left">Trạng thái</TableCell>
        <TableCell size="medium" align="left">Hồ sơ</TableCell>
        <TableCell size="medium" align="left" />
      </TableRow>
    </TableHead>
  );

  return (
    <Grid container spacing={1} direction="column">
      <Grid item container justify="space-between">
        <Grid item xs>
          <FilterAppointment
            register={register}
            control={control}
            resetFilter={resetFilter}
            setKeyword={setKeyword}
          />
        </Grid>
      </Grid>

      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            {Header}

            <TableBody>
              {isLoading && <CircularProgress />}

              {error && <span>Some thing went wrong</span>}

              {data && data.appointments.map((appointment, index) => (
                <TableRow key={appointment.id}>
                  <TableCell size="medium" align="left">{index + 1}</TableCell>
                  <TableCell size="medium" align="left">{`APM${appointment.id}`}</TableCell>
                  <TableCell size="medium" align="left">{appointment.patient.name}</TableCell>
                  <TableCell size="medium" align="left">{genderEnum.getTitle(appointment.patient.gender)}</TableCell>
                  <TableCell size="medium" align="left">{localDate(appointment.start_time)}</TableCell>
                  <TableCell size="medium" align="left">{`${formatLocalHour(appointment.start_time)} - ${formatLocalHour(appointment.end_time)}`}</TableCell>
                  <TableCell size="medium" align="left">{examinationType.getTitle(appointment.type)}</TableCell>
                  <TableCell size="medium" align="left">{appointment.description}</TableCell>
                  <TableCell size="medium" align="left">{appointmentStatus.getTitle(appointment.status)}</TableCell>
                  <TableCell size="medium" align="left">
                    <PersonalHealthRecord userId={appointment.patient.id} />
                  </TableCell>
                  <TableCell size="medium" align="center">
                    <AppointmentTools appointment={appointment} />
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

export default AppointmentList;
