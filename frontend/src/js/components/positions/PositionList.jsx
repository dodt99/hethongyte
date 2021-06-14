import React from 'react';
import {
  Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';

import usePositions from '../../hooks/usePositions';
import RemoveDialog from './RemoveDialog';
import UpdateDialog from './UpdateDialog';

const useStyles = makeStyles(() => ({
  tool: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
}));

const PositionList = () => {
  const classes = useStyles();

  const { data, error, isLoading } = usePositions();

  const Header = (
    <TableHead>
      <TableRow>
        <TableCell size="medium" align="center">
          ID
        </TableCell>
        <TableCell size="medium" align="center">Position</TableCell>
        <TableCell size="medium" align="center" />
      </TableRow>
    </TableHead>
  );

  if (error) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            {Header}
          </Table>
        </TableContainer>
        <span> Some thing went wrong</span>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="medium" aria-label="a dense table">
            {Header}
          </Table>
        </TableContainer>
        <CircularProgress />
      </>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="medium" aria-label="a dense table">
        {Header}

        <TableBody>
          {data && data.map((position, index) => (
            <TableRow key={position.id}>
              <TableCell size="medium" align="center">{index + 1}</TableCell>
              <TableCell size="medium" align="center">{position.name}</TableCell>
              <TableCell size="medium" align="center" className={classes.tool}>
                <UpdateDialog position={position} />
                <RemoveDialog positionId={position.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PositionList;
