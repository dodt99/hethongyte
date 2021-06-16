import React from 'react';

import Layout from '../../components/common/Layout';
import useMe from '../../hooks/useMe';
import PatientProfile from '../../components/profile/PatientProfile';

const MyProfile = () => {
  const { data: me } = useMe();

  return (
    <Layout title="Hồ sơ cá nhân">
      {/* {me && me.role === roleEnum.ADMIN && (
        <AdminProfile userId={me.id} />
      )}

      {me && me.role === roleEnum.EMPLOYEE && (
        <AdminProfile userId={me.id} />
      )}

      {me && me.role === roleEnum.PATIENT && (
        <PatientProfile userId={me.id} />
      )} */}

      {me && (
        <PatientProfile userId={me.id} />
      )}
    </Layout>
  );
};

export default MyProfile;
