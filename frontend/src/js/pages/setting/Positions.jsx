import React from 'react';
import { Grid } from '@material-ui/core';

import Layout from '../../components/common/Layout';
import PositionList from '../../components/positions/PositionList';
import AddDialog from '../../components/positions/AddDialog';
import SettingTab from '../../components/common/SettingTab';

const Positions = () => (
  <Layout title="Setting">
    <SettingTab currentValue="positions" />
    <Grid container spacing={2} direction="column">
      <Grid item container justify="flex-end">
        <AddDialog />
      </Grid>
      <Grid item>
        <PositionList />
      </Grid>
    </Grid>
  </Layout>
);

export default Positions;
