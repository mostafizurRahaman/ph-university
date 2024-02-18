import configs from '../configs';
import { USER_ROLE } from '../modules/user/user.contants';
import User from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'superadmin@gmail.com',
  password: configs.superAdminPassword,
  needsPasswordChanged: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
};

const seedSuperAdmin = async () => {
  //   ** Super Admin Creation :

  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.superAdmin,
  });

  //   ** Super User :
  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
