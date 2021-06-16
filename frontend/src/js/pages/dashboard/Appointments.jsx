import React from 'react';

import Layout from '../../components/common/Layout';
import DashboardTab from '../../components/dashboard/DashboardTab';
import AppointmentList from '../../components/dashboard/AppointmentList';

const Appointments = () => (
  <Layout title="Dashboard">
    <DashboardTab currentValue="appointments" />
    <AppointmentList />
  </Layout>
);

export default Appointments;
