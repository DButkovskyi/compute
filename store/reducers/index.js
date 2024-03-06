import { combineReducers } from 'redux';
import register from './register';
import login from './login';
import getProfile from './get-profile';
import getServers from './get-servers';
import getSingleServer from './get-single-server';
import stopSingleServer from './stop-single-server';
import startSingleServer from './start-single-server';
import rebootHardSingleServer from './reboot-hard-single-server';
import rebootSoftSingleServer from './reboot-soft-single-server';
import deleteSingleServer from './delete-single-server';
import createServer from './create-server';
import getKeyPairs from './get-key-pairs';
import getImages from './get-images';
import getFlavors from './get-flavors';
import createVolume from './create-volume';
import getVolumes from './get-volumes';
import getSingleVolume from './get-single-volume';
import deleteSingleVolume from './delete-single-volume';
import extendSingleVolumeSize from './extend-single-volume-size';
import getUsage from './get-usage';

const baseReducers = combineReducers({
  register,
  login,
  getProfile,
  getServers,
  getSingleServer,
  stopSingleServer,
  startSingleServer,
  rebootHardSingleServer,
  rebootSoftSingleServer,
  deleteSingleServer,
  createServer,
  getKeyPairs,
  getImages,
  getFlavors,
  createVolume,
  getVolumes,
  getSingleVolume,
  deleteSingleVolume,
  extendSingleVolumeSize,
  getUsage,
});

export default baseReducers;
